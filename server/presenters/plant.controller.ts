import express, {Request, Response} from "express";
import model from "../model";
import Model from "../model";
import multer from "multer";
import {getCareAdvice, searchSpecies} from "../models/plantModel"
import {AxiosError} from "axios";


const router = express.Router();

// Configure multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

/**
 * Middleware for checking if a user is authenticated.
 * @param req request
 * @param res response
 * @param next next function
 */
const requireAuth = (req: Request, res: Response, next: Function) => {
    if (model.findUserBySessionId(req.session.id)) {
        next();
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
};

/**
 * Route for checking if a user is authenticated.
 */
router.get("/isAuthenticated", (req: Request, res: Response) => {
    try {
        if (Model.findUserBySessionId(req.session.id)) {
            res.status(200).json({authenticated: true});
        } else {
            res.status(401).json({authenticated: false});
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

/**
 * Route for adding a plant to the user's profile.
 */
router.post("/add", requireAuth, upload.single('imageFile'), async (req: Request, res: Response) => {
    try {
        const {id, plantName, wateringFrequency, lastWatered, imageURL} = req.body;
        const imageFile = req.file?.buffer ?? null; // Set imageFile to null if undefined
        let email = "";

        // Get email from findUserBySessionId (you probably meant "findUserBySessionId")
        try {
            const user = await model.findUserBySessionId(req.session.id); // Assuming this returns a promise
            if (!user) {
                throw new Error("User not found");
            }
            email = user.email;
        } catch (error) {
            console.error("Error getting email from session ID:", error);
            return res.status(500).json({success: false, message: "Error getting email from session ID"});
        }

        // Add the plant to the user's profile (imageFile is binary, imageURL is optional)
        const success = await Model.addPlantToUser(id, plantName, wateringFrequency, lastWatered, imageURL, imageFile, email);

        if (success) {
            return res.status(200).json({success: true, message: "Plant added successfully"});
        } else {
            return res.status(500).json({success: false, message: "Error adding plant"});
        }
    } catch (error) {
        if (error instanceof Error && (error as any).code === "ER_DUP_ENTRY") {
            return res.status(400).json({success: false, message: "Plant already exists in profile"});
        }
        console.error("Internal server error:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
});

/**
 * Route for deleting a plant from the user's profile.
 */
router.post("/delete", requireAuth, async (req: Request, res: Response) => {
    try {
        const {plantName} = req.body;
        let email = "";

        try {
            const user = await model.findUserBySessionId(req.session.id);
            if (!user) {
                throw new Error("User not found");
            }
            email = user.email;
        } catch (error) {
            console.error("Error getting email from session ID:", error);
            return res.status(500).json({success: false, message: "Error getting email from session ID"});
        }

        const success = await Model.deletePlantFromUser(plantName, email);

        if (success) {
            return res.status(200).json({success: true, message: "Plant deleted successfully"});
        } else {
            return res.status(500).json({success: false, message: "Error deleting plant"});
        }
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
});

/**
 * Route for updating a plant in the user's profile.
 */
router.post("/update", requireAuth, async (req: Request, res: Response) => {
    try {
        const { plantName, lastWatered } = req.body; // Extract the plant name and last watered date
        let email = "";

        try {
            const user = await model.findUserBySessionId(req.session.id);
            if (!user) {
                throw new Error("User not found");
            }
            email = user.email;
        } catch (error) {
            console.error("Error getting email from session ID:", error);
            return res.status(500).json({ success: false, message: "Error getting email from session ID" });
        }

        const success = await Model.updatePlantInUser(plantName, lastWatered, email);

        if (success) {
            return res.status(200).json({ success: true, message: "Plant updated successfully" });
        } else {
            return res.status(500).json({ success: false, message: "Error updating plant" });
        }
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


/**
 * Route for getting all plants associated with the user.
 */
router.get("/get", requireAuth, async (req: Request, res: Response) => {
    try {

        let email = "";
        // get email from fidUserBySessionId
        try {
            const user = model.findUserBySessionId(req.session.id);
            if (!user) {
                throw new Error("User not found");
            }
            email = user.email;
        } catch (error) {
            console.error("Error getting email from session ID:", error);
            res.status(500).json({success: false, message: "Error getting email from session ID"});
        }

        if (!email) {
            return res.status(400).json({message: "Email is required"});
        }

        const plants = await Model.fetchPlantsForUser(email);

        // convert image buffer to base64
        plants.forEach((plant) => {
                if (plant.image_blob) {
                    plant.image_blob = plant.image_blob.toString("base64");
                }
            }
        );

        res.status(200).json({success: true, plants});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error"});
    }
});

router.get("/search", async (req: Request, res: Response) => {
    const {query} = req.query;

    try {
        const response = await searchSpecies(query as string);
        const status = response.status;
        const result = response.data;

        if (status === 200) {
            return res.status(status).json({result});
        } else if (status === 429) {
            return res.status(status).json({error: "Code: 429 Too many requests with this API key"});
        } else {
            return res.status(status).json({error: `Code: ${status} Something went wrong`});
        }
    } catch (error: any) {
        if (error.response) {
            // Error from the server
            const status = error.response.status;
            const errorMessage = error.response.data?.error || "An error occurred";

            return res.status(status).json({error: `Code: ${status} ${errorMessage}`});
        } else if (error.code === 'ECONNABORTED') {
            // Handle axios timeout specifically
            console.log(error);
            return res.status(408).json({error: "Code 408: API request taking too long"});
        } else {
            // Other unknown errors
            console.error("Error in /search: ", error.message);
            return res.status(500).json({error: "Code 500: Internal server error"});
        }
    }
});

router.get("/care_advice", async (req: Request, res: Response) => {
    const {query} = req.query;

    try {
        const response = await getCareAdvice(undefined, query as string);

        const status = response.status;
        const result = response.data;

        if (status === 200) {
            return res.status(status).json({result});
        } else if (status === 429) {
            return res.status(status).json({error: "Code: 429 Too many requests with this API key"});
        } else {
            return res.status(status).json({error: `Code: ${status} Something went wrong`});
        }
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || "An error occurred";

            return res.status(status).json({error: `Code: ${status} ${errorMessage}`});
        } else if (error.code === 'ECONNABORTED') {
            // Handle axios timeout specifically
            return res.status(408).json({error: "Code 408: API request taking too long"});
        } else {
            // Other unknown errors
            console.error("Error in /care_advice: ", error.message);
            return res.status(500).json({error: "Code 500: Internal server error"});
        }
    }
});

export default router;

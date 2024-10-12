import express, {Request, Response} from "express";
import model from "../model";
import Model from "../model";
import multer from "multer";
import {getCareAdvice, searchSpecies} from "../Models/plantModel"


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


// TODO functions below in model to remove, fetch and update plants


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
    console.log("getting info from server");
    try {
        console.log("getting info from server");
        const result = await searchSpecies(query as string);
        res.status(200).json({result});
    } catch (e) {
        console.error("Error in /search: pls help", e);
        res.status(500).json({result: null});
    }
});

router.get("/care_advice", async (req: Request, res: Response) => {
    const {query} = req.query;
    try {
        const result = await getCareAdvice(undefined, query as string);
        console.log(result);
        res.status(200).json({result: result});
    } catch (e) {
        console.error("Error in /care advice:", e);
        res.status(500).json({result: null});
    }
});

export default router;

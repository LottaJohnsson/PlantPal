import express, {Request, Response} from "express";
import Model from "../model";
import model from "../model";
import exp from "constants";

const router = express.Router();

/**
 * Routes used for authentication of users.
 * Handles registration, login and logout of users.
 * Middlware for checking if a user is logged in is also included.
 */

/**
 * middleware for checking if a user is authenticated.
 * @param req request
 * @param res response
 * @param next next function
 */
const requireAuth = (req: Request, res: Response, next: Function) => {
    if (model.findUserBySessionId(req.session.id)) {
        next();
        res.status(200).json({message: "Authorized"});
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
    res.status(500).json({message: "Internal server error"});
}

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
 * Route for creating a new user account. Checks if the email is already in use, and if not, creates a new account.
 */
router.post("/register", async (req: Request, res: Response) => {
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({message: "Invalid email"});
    }

    if (req.body.password === '') {
        return res.status(400).json({message: "Need to enter username or password"});
    }

    try {
        const {email, password} = req.body;
        const {id: sessionId} = req.session;

        console.log("Registering user with email:", email);

        const successfulRegistration = await Model.createUser(sessionId, email, password);

        console.log("Registration successful:", successfulRegistration);

        if (successfulRegistration) {
            console.log("Registration successful");
            return res.status(200).json({message: "Registration successful"});
        } else {
            return res.status(401).json({message: "Registration failed. Email might already be in use."});
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});


/**
 * Route for logging in a user. Checks if the email and password is correct, and if so, logs in the user.
 */
router.post("/login", async (req: Request, res: Response) => {
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({message: "Invalid email"});
    }

    if (!req.body.password) {
        return res.status(400).json({message: "Need to enter username or password"});
    }

    try {
        const {email, password} = req.body;
        const {id: sessionId} = req.session;

        const successfulLogin = await Model.loginUser(sessionId, email, password);

        if (successfulLogin) {
            return res.status(200).json({message: "Login successful"});
        } else {
            return res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({message: "Internal server error"});
    }
});


/**
 * Route for logging out a user.
 */
router.post("/logout", (req: Request, res: Response) => {
    console.log("try to log out")
    try {
        const {id: sessionId} = req.session;
        Model.logoutUser(sessionId)
            .then(() => {
                res.status(200).json({loggedOut: true});
            });
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default router;
export {requireAuth};
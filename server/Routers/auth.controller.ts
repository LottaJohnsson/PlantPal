import express, { Request, Response } from "express";
import Model from "../model";
import model from "../model";

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
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

/**
 * Route for checking if a user is authenticated.
 */
router.get("/isAuthenticated", (req: Request, res: Response) => {
  if (Model.findUserBySessionId(req.session.id)) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

/**
 * Route for creating a new user account. Checks if the email is already in use, and if not, creates a new account.
 */
router.post("/register", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { id: sessionId } = req.session;
  Model.createUser(sessionId, email, password)
  .then((succsesfulRegistration) => {
    res.status(200).json({ registered: succsesfulRegistration });
  });
});

/**
 * Route for logging in a user. Checks if the email and password is correct, and if so, logs in the user.
 */
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { id: sessionId } = req.session;
  Model.loginUser(sessionId, email, password)
  .then((succsesfulLogin) => {
    res.status(200).json({ loggedIn: succsesfulLogin });
  });
});

/**
 * Route for logging out a user.
 */
router.post("/logout", (req: Request, res: Response) => {
  const { id: sessionId } = req.session;
  Model.logoutUser(sessionId)
  .then(() => {
    res.status(200).json({ loggedOut: true });
  });
});

export default router;
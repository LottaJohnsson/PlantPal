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
    res.status(200).json({ message: "Authorized" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  res.status(500).json({ message: "Internal server error" });
}

/**
 * Route for checking if a user is authenticated.
 */
router.get("/isAuthenticated", (req: Request, res: Response) => {
  try {
    if (Model.findUserBySessionId(req.session.id)) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route for creating a new user account. Checks if the email is already in use, and if not, creates a new account.
 */
router.post("/register", (req: Request, res: Response) => {
  if(validateEmail(req.body.email) === false) {
    res.status(400).json({ message: "Invalid email" });
  }
  if (req.body.password === '' || req.body.password === '') {
    res.status(400).json({ message: "Need to enter username or password" });
    return
  }
  try {
    const { email, password } = req.body;
    const { id: sessionId } = req.session;
    Model.createUser(sessionId, email, password)
    .then((succsesfulRegistration) => {
      res.status(200).json({ registered: succsesfulRegistration });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route for logging in a user. Checks if the email and password is correct, and if so, logs in the user.
 */
router.post("/login", (req: Request, res: Response) => {
  if (!validateEmail(req.body.email)) {
    res.status(400).json({ message: "Invalid email" });
    return
  }
  if (req.body.password === '' || req.body.password === '') {
    res.status(400).json({ message: "Need to enter username or password" });
    return
  }
  try {
    const { email, password } = req.body;
    const { id: sessionId } = req.session;
    Model.loginUser(sessionId, email, password)
    .then((succsesfulLogin) => {
      res.status(200).json({ loggedIn: succsesfulLogin });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route for logging out a user.
 */
router.post("/logout", (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.session;
    Model.logoutUser(sessionId)
    .then(() => {
      res.status(200).json({ loggedOut: true });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }); 
  }
});

function validateEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default router;
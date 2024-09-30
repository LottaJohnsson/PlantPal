"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var model_1 = __importDefault(require("../model"));
var model_2 = __importDefault(require("../model"));
var router = express_1.default.Router();
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
var requireAuth = function (req, res, next) {
    if (model_2.default.findUserBySessionId(req.session.id)) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
/**
 * Route for checking if a user is authenticated.
 */
router.get("/isAuthenticated", function (req, res) {
    if (model_1.default.findUserBySessionId(req.session.id)) {
        res.status(200).json({ authenticated: true });
    }
    else {
        res.status(401).json({ authenticated: false });
    }
});
/**
 * Route for creating a new user account. Checks if the email is already in use, and if not, creates a new account.
 */
router.post("/register", function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    var sessionId = req.session.id;
    model_1.default.createUser(sessionId, email, password)
        .then(function (succsesfulRegistration) {
        res.status(200).json({ registered: succsesfulRegistration });
    });
});
/**
 * Route for logging in a user. Checks if the email and password is correct, and if so, logs in the user.
 */
router.post("/login", function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    var sessionId = req.session.id;
    model_1.default.loginUser(sessionId, email, password)
        .then(function (succsesfulLogin) {
        res.status(200).json({ loggedIn: succsesfulLogin });
    });
});
/**
 * Route for logging out a user.
 */
router.post("/logout", function (req, res) {
    var sessionId = req.session.id;
    model_1.default.logoutUser(sessionId)
        .then(function () {
        res.status(200).json({ loggedOut: true });
    });
});
exports.default = router;

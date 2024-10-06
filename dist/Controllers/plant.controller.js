"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var model_1 = __importDefault(require("../model"));
var model_2 = __importDefault(require("../model"));
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
var upload = (0, multer_1.default)({ dest: "uploads/" });
/**
 * Middleware for checking if a user is authenticated.
 * @param req request
 * @param res response
 * @param next next function
 */
var requireAuth = function (req, res, next) {
    if (model_1.default.findUserBySessionId(req.session.id)) {
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
    try {
        if (model_2.default.findUserBySessionId(req.session.id)) {
            res.status(200).json({ authenticated: true });
        }
        else {
            res.status(401).json({ authenticated: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
/**
 * Route for adding a plant to the user's profile.
 */
router.post("/add", requireAuth, upload.single('imageFile'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, plantName, wateringFrequency, lastWatered, imageURL, imageFile, email, user, success, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, plantName = _a.plantName, wateringFrequency = _a.wateringFrequency, lastWatered = _a.lastWatered, imageURL = _a.imageURL;
                imageFile = req.file ? new Blob([req.file.buffer]) : new Blob();
                email = "";
                // get email from fidUserBySessionId
                try {
                    user = model_1.default.findUserBySessionId(req.session.id);
                    if (!user) {
                        throw new Error("User not found");
                    }
                    email = user.email;
                }
                catch (error) {
                    console.error("Error getting email from session ID:", error);
                    res.status(500).json({ success: false, message: "Error getting email from session ID" });
                }
                return [4 /*yield*/, model_2.default.addPlantToUser(id, plantName, wateringFrequency, lastWatered, imageURL, imageFile, email)];
            case 1:
                success = _b.sent();
                if (success) {
                    res.status(200).json({ success: true, message: "Plant added successfully" });
                }
                else {
                    res.status(500).json({ success: false, message: "Error adding plant" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Internal server error:", error_1);
                res.status(500).json({ success: false, message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// TODO functions below in model to remove and get plants, maybe also update plant 
// /**
//  * Route for getting all plants associated with the user.
//  */
// router.get("/get", requireAuth, (req: Request, res: Response) => {
//   try {
//     const { email } = req.query; 
//     Model.getPlantsByUser(email as string)
//       .then((plants) => {
//         res.status(200).json(plants);
//       })
//       .catch((error) => {
//         res.status(500).json({ message: "Error fetching plants", error });
//       });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// /**
//  * Route for removing a plant from the user's profile.
//  */
// router.delete("/remove/:plantId", requireAuth, (req: Request, res: Response) => {
//   try {
//     const { plantId } = req.params;
//     Model.removePlant(plantId)
//       .then(() => {
//         res.status(200).json({ message: "Plant removed successfully" });
//       })
//       .catch((error) => {
//         res.status(500).json({ message: "Error removing plant", error });
//       });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
exports.default = router;

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
var userModel_1 = __importDefault(require("./Models/userModel"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var db_1 = __importDefault(require("./db"));
var Model = /** @class */ (function () {
    function Model() {
        this.users = {};
    }
    /**
     * Function for creating a new user account. Checks if the email is already in use, and if not, creates a new account.
     * Haches the new password before storing it in the database. Add the account the the users object with current session id
     * @param sessionId Session ID of the session creating the account
     * @param email Email for the new account
     * @param password Password for the new account
     * @returns true if the account was successfully created, false if the email is already in use
     */
    Model.prototype.createUser = function (sessionId, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, hash, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.default.query('SELECT * FROM users WHERE email = ?', [email])];
                    case 1:
                        stmt = (_a.sent())[0];
                        if (!(stmt.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 2:
                        hash = _a.sent();
                        newUser = new userModel_1.default(email);
                        this.users[sessionId] = newUser;
                        return [4 /*yield*/, db_1.default.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     *
     * @param sessionId Session ID of the session logging in
     * @param email Email of the account logging in
     * @param password Password of the account logging in
     * @returns reutrns true if the login was successful, false if the email or password is incorrect
     */
    Model.prototype.loginUser = function (sessionId, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var stmt, user, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.default.query('SELECT * FROM users WHERE email = ?', [email])];
                    case 1:
                        stmt = (_a.sent())[0];
                        if (!(stmt.length > 0)) return [3 /*break*/, 3];
                        user = stmt[0];
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 2:
                        if (_a.sent()) {
                            newUser = new userModel_1.default(email);
                            this.users[sessionId] = newUser;
                            return [2 /*return*/, true];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Function for logging out a user. Deletes the user from the users object
     * @param sessionId Session ID of the session logging out
     */
    Model.prototype.logoutUser = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                delete this.users[sessionId];
                return [2 /*return*/];
            });
        });
    };
    /**
     * Function for finding the user object for a session ID
     * @param sessionId Session ID of the session to find the user for
     * @returns user object for the session ID
     */
    Model.prototype.findUserBySessionId = function (sessionId) {
        return this.users[sessionId];
    };
    return Model;
}());
exports.default = new Model();

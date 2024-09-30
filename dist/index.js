"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var path_1 = __importDefault(require("path"));
var authRouter_1 = __importDefault(require("./Routers/authRouter"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((0, express_session_1.default)({
    secret: "Super hemligt jag lovar",
    resave: true,
    saveUninitialized: true,
}));
app.use('/auth', authRouter_1.default);
app.get("*", function (req, res, next) {
    try {
        res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
    }
    catch (error) {
        next(error);
    }
});
var PORT = 3000;
app.listen(PORT, function () {
    console.log("App listening on port ".concat(PORT));
});

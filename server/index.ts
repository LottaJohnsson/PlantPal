import express, {Request, Response, NextFunction} from "express";
import session from "express-session";
import path from "path";
import authRouter from "./Controllers/auth.controller";
import morgan from "morgan";
import plantRouter from "./Controllers/plant.controller";


const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));

app.use(session({
    secret: "Super hemligt jag lovar",
    resave: true,
    saveUninitialized: true,

}))

app.use('/auth', authRouter);
app.use('/plants', plantRouter);

app.get("*", (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.sendFile(path.join(__dirname, "../public", "index.html"));
    } catch (error) {
        next(error);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
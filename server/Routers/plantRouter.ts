import express, {Request, Response} from "express";
import {searchSpecies} from "../Models/plantModel"

const router = express.Router();
router.get("/search", async (req: Request, res: Response) => {
    const {query} = req.query;
    try {
        const result = await searchSpecies(query as string);
        console.log(result);
        res.status(200).json({result: result});
    } catch (e) {
        console.error("Error in /search:", e);
        res.status(500).json({result: null});
    }
});

export default router;
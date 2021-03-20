import { Request, Response, Router } from "express";
import { createChapter, getChapter, modChapter,
findChaptersByDepth,
findChaptersByParent,
findChaptersByUser,
findChaptersByIdentifier,
getFirstChapter} from "../controllers/chapter.controller";
import { verifyToken } from "../middlewares";

const chaptersRouter = Router();

chaptersRouter
    .post("/search",
    [verifyToken],
    async (req: Request, res:Response) => {

        let chapters;

        switch(req.body.filter) {
            case "identifier":
                chapters = await findChaptersByIdentifier(req.body.value);
                break;
            case "depth":
                chapters = await findChaptersByDepth(req.body.value);
                break;
            case "parent":
                chapters = await findChaptersByParent(req.body.value);
                break;
            case "userName":
                chapters = await findChaptersByUser(req.body.value);
                break;
            default:
                break;
        }

        return res.send({ chapters })
    })
    .post("/writeChapter",
    [verifyToken],
    async (req: Request, res: Response) => {

        console.log(req.body);

        const chapter = await createChapter({
            text: req.body.text,
            parentId: req.body.parent === "" ? null : req.body.parent,
            userId: req.body.decodedId,
            identifier: req.body.identifier,
            image: req.files ? req.files.image : null
        });

        return res.send({ chapter });
    })
    .post("/:chapterId/modChapter",
    [verifyToken],
    async (req: Request, res: Response) => {
        const chapter = await modChapter(
            req.params.chapterId,
            req.body.modStatus,
            req.body.decodedId
        );

        return res.send({ chapter });
    })
    .get("/first",
    async (req: Request, res:Response) => {
        const chapter = await getFirstChapter();
        return res.send({ chapter });
    })
    .get("/:chapterId",
    async (req: Request, res:Response) => {
        const chapter = await getChapter(
            req.params.chapterId
        );
        return res.send({ chapter });
    });

export default chaptersRouter;
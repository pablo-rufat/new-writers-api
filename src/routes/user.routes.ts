import { Request, Response, Router } from "express";
import { CreateUser, getUserRoles, LoginUser, setBookMark } from "../controllers/user.controller";
import { verifyToken } from "../middlewares";

const usersRouter = Router();

usersRouter
  .post("/register", async (req: Request, res: Response) => {
    const user = await CreateUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });

    console.log("USUARIO REGISTRADO");

    if (user) {
      const loggedUser = await LoginUser({
        email: req.body.email,
        password: req.body.password
      });

      return res.send({ loggedUser });
    }
  })
  .post("/login", async (req: Request, res: Response) => {
    const user = await LoginUser({
      email: req.body.email,
      password: req.body.password
    });

    return res.send({ user });
  })
  .post("/bookmark", [verifyToken], async (req: Request, res: Response) => {
    await setBookMark(req.body.decodedId, req.body.bookmark);
    return res.send("OK");
  })
  .get("/roles", [verifyToken], async (req: Request, res: Response) => {
    const roles = await getUserRoles(req.body.decodedId);

    return res.send({ roles })
  });

export default usersRouter;
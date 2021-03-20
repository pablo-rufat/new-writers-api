import { ISessionUser } from "../../src/types/interfaces";

declare module "express-session" {
    interface Session {
        currentUser: ISessionUser
    }
  }
import { UploadedFile } from "express-fileupload";
import { Document } from "mongoose";
import { Roles, ModStatus } from "./types";

export interface ICreateUserInput {
    email: IUser['email'];
    firstName: IUser['firstName'];
    lastName: IUser['lastName'];
    password: IUser['password'];
}

export interface ILoginUserInput {
    email: IUser['email'];
    password: IUser['password'];
}

export interface ISessionUser {
  user: IUserPublic,
  token: string
}

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  bookmark: string | null;
  roles: IRole[];
}
export interface IUserPublic {
  email: string;
  firstName: string;
  lastName: string;
  bookmark: string | null;
  roles: IRole[];
}

export interface IChapter extends Document {
  identifier: string;
  text: string;
  userName: string;
  date: Date;
  depth: number;
  modStatus: ModStatus;
  children: IChapter[];
  image: string;
}

export interface ICreateChapterInput {
  identifier: string;
  text: IChapter['text'];
  parentId: string | null;
  userId: string;
  image: UploadedFile | UploadedFile[] | null;
}

export interface IRole extends Document {
    name: Roles;
}

export interface IChapterFilter {
  depth: number;
  identifier: string;
  userName: string;
}
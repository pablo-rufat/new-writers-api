import User from '../models/user.model';
import Role from '../models/role.model';
import Chapter from '../models/chapter.model';
import bcrypt from "bcrypt";
import { Roles } from '../types/types';
import jwt from "jsonwebtoken";
import { ICreateUserInput, ILoginUserInput, IRole, IUserPublic, ISessionUser, IUser, IChapter } from '../types/interfaces';
import { env } from '../config/env';

export const CreateUser = async ({
    email,
    firstName,
    lastName,
    password
  }: ICreateUserInput): Promise<IUserPublic> => {

    const role: IRole | null = await Role.findOne({ name: Roles.user }).exec();

    return User.create({
      email,
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 8),
      bookmark: null,
      roles: [role]
    })
    .then((data: IUser) => {
        return {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          bookmark: data.bookmark,
          roles: data.roles,
        };
    })
    .catch((error: Error) => {
        throw error;
    });
};

export const getUserRoles = async (userId: string) => {
  const user: IUser | null = await User.findById(userId).populate("roles").exec();

  if (!user) {
    throw Error("User not found");
  }

  return user.roles;
}

export const setBookMark = async (userId: string, bookmark: string) => {
  const user: IUser | null = await User.findById(userId).exec();

  if (!user) {
    throw Error("User not found");
  }

  if (bookmark) {
    const chapter: IChapter | null = await Chapter.findById(bookmark).exec();

    if (!chapter) {
      throw Error("Chapter not found");
    }
  }

  User.findByIdAndUpdate(userId, {
    bookmark: bookmark
  }).exec();
}

export const LoginUser = async ({
    email,
    password
  }: ILoginUserInput): Promise<ISessionUser> => {

    return User.findOne({
        email
    })
    .exec()
    .then((data: IUser | null) => {

      if (!data) {
        throw Error("User not found");
      }

      const passwordIsValid: boolean = bcrypt.compareSync(
          password,
          data.password
      );

      if (!passwordIsValid) {
        throw Error("Invalid Password!");
      }

      const token: string = jwt.sign({ id: data.id }, env.JWT_SECRET!, {
          expiresIn: 86400 // 24 horas
      });

      const userPublic: IUserPublic = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        bookmark: data.bookmark,
        roles: data.roles,
      };

      return {
        user: userPublic,
        token
      }
    })
    .catch((error: Error) => {
        throw error;
    });
};

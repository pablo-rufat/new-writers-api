import User from "../models/user.model";
import { IRole, IUser } from "../types/interfaces";
import Role from "../models/role.model";
import { Roles, ModStatus } from "../types/types";
import { CallbackError } from "mongoose";

export const validateModStatus = (modStatus: any) => {
    return Object.values(ModStatus).includes(modStatus);
};

export const isMod = (userId: string) => {

    User.findById(userId).exec((err: CallbackError, user: IUser | null) => {

        if (err) {
            throw Error(err.message);
        }

        if (!user) {
            throw Error("User not found");
        }

        Role.find( { _id: { $in: user.roles } }, (errRole: any, roles: IRole[]) => {
            if (errRole) {
                throw Error(errRole);
            }

            let mod = false;

            roles.forEach( (role: IRole) => {
                if (role.name === Roles.mod) {
                    mod = true;
                }
            });

            if (mod) {
                return;
            }

            throw Error("Require Mod Role.");
        });
    });
};
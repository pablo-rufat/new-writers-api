import mongoose, { Schema } from "mongoose";
import { IRole } from "../types/interfaces";
import { Roles } from "../types/types";

const RoleSchema: Schema = new Schema({
    name: {
        type: Roles,
        required: true,
    }
});

export default mongoose.model < IRole > ("Role", RoleSchema);
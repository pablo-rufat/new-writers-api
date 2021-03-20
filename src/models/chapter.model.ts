import mongoose, { Schema } from "mongoose";
import { IChapter } from "../types/interfaces";
import { ModStatus } from "../types/types";

const ChapterSchema: Schema = new Schema({
    identifier: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
    modStatus: {
        type: ModStatus,
        required: true,
        default: ModStatus.waiting,
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    }],
    image: {
      type: String,
      required: false,
    }
  });

export default mongoose.model < IChapter > ("Chapter", ChapterSchema);
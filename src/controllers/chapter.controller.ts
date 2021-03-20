import { IChapter, ICreateChapterInput, IUser } from '../types/interfaces';
import User from '../models/user.model';
import Chapter from '../models/chapter.model';
import { ModStatus } from '../types/types';
import { isMod, validateModStatus } from '../util/validations';
import { uploadFile } from '../config/awsS3';
import { env } from '../config/env';

export const getChapter = async (chapterId: string): Promise<IChapter | null> => {
    const chapter = await Chapter.findOne({ _id: chapterId, modStatus: ModStatus.approved }).populate("children").exec();
    chapter?.children.filter(child => child.modStatus === ModStatus.approved);
    return chapter;
};

export const getFirstChapter = async (): Promise<IChapter | null> => {
    const chapter = await Chapter.findOne({ depth: 0, modStatus: ModStatus.approved }).populate("children").exec();
    console.log(chapter);
    chapter?.children.filter(child => child.modStatus === ModStatus.approved);
    return chapter;
};

export const findChaptersByIdentifier = async (identifier: string): Promise<IChapter[]> => {

    return Chapter.find({ identifier: { $regex: identifier }, modStatus: ModStatus.approved }).exec();
};

export const findChaptersByDepth = async (depth: number): Promise<IChapter[]> => {

    return Chapter.find({ depth, modStatus: ModStatus.approved }).exec();
};

export const findChaptersByParent = async (parentId: string): Promise<IChapter[]> => {

    const parent: IChapter | null = await Chapter.findById(parentId).exec();

    if (!parent) return [];

    return Chapter.find({ _id:  parent.children, modStatus: ModStatus.approved }).exec();
};

export const findChaptersByUser = async (userName: string): Promise<IChapter[]> => {

    return Chapter.find({ userName: { $regex: userName }, modStatus: ModStatus.approved }).exec();
};

export const createChapter = async ({
    text,
    parentId,
    userId,
    identifier,
    image
  }: ICreateChapterInput): Promise<IChapter | null> => {

    const user: IUser | null = await User.findById(userId).exec();
    const parent: IChapter | null = await Chapter.findById(parentId).exec();

    console.log(parent);

    if (!user) {
        throw Error("User not found.");
    }

    // TODO: CREAR MD5 DE LOS CAPITULOS PARA COMPARAR EL TEXTO

    const chapter = await Chapter.create({
        identifier,
        text,
        userName: `${user.firstName} ${user.lastName}`,
        date: new Date(),
        depth: parent ? parent.depth + 1 : 0,
        children: [],
        image: env.DEFAULT_IMAGE_LOCATION,
    });

    if (image && !Array.isArray(image)) {
        const location = await uploadFile(image.data, image.name);
        if (location) {
            Chapter.findByIdAndUpdate(chapter._id, { image: location }).exec();
        }
    }

    if ( parent ) {
        parent.update({ $addToSet: { children: chapter._id } }).exec();
    }

    return chapter;
};

export const modChapter = async (
    chapterId: string,
    modStatus: ModStatus,
    userId: string
): Promise<IChapter | null> => {

    isMod(userId);
    if (!validateModStatus(modStatus)) {
        throw Error("Invalid Status.");
    }

    await Chapter.findByIdAndUpdate(chapterId, { modStatus: modStatus }).exec();

    return Chapter.findById(chapterId).exec();
};
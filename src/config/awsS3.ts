import AWS from "aws-sdk";
import { env } from "./env";

export const s3 = new AWS.S3({
    accessKeyId: env.S3_KEY,
    secretAccessKey: env.S3_SECRET
});

export const initS3Bucket = async () => {
    const options = {
        Bucket: env.S3_BUCKET_CHAPTER_IMAGES,
    };

    try {
        await s3.headBucket(options).promise();
        console.log(`The bucket ${env.S3_BUCKET_CHAPTER_IMAGES} already exists`);
    } catch (error) {
        if (error.statusCode === 404) {
            s3.createBucket({
                Bucket: env.S3_BUCKET_CHAPTER_IMAGES,
                CreateBucketConfiguration: {
                    LocationConstraint: env.AWS_REGION
                }
            }, (err, data) => {
                if (err){
                    throw err;
                } else {
                    console.log(`${env.S3_BUCKET_CHAPTER_IMAGES} bucket created.`);
                    updateBucketPolicy(env.S3_BUCKET_CHAPTER_IMAGES, {
                        Version: "2012-10-17",
                        Statement: [
                          {
                            Sid: "AddPerm",
                            Effect: "Allow",
                            Principal: "*",
                            Action: ["s3:GetObject"],
                            Resource: [`arn:aws:s3:::${env.S3_BUCKET_CHAPTER_IMAGES}/*`]
                            }
                        ]
                    });
                }
            });
        }
        throw error;
    }
};

const updateBucketPolicy = (bucketName: string, policy: any) => {

    const bucketPolicyParams = {Bucket: bucketName, Policy: JSON.stringify(policy)};

    s3.putBucketPolicy(bucketPolicyParams, (err, data) => {
        if (err) {
            throw err
        } else {
            console.log("Policy updated", data);
        }
    });
}

export const uploadFile = async (file: Buffer, filename: string): Promise<string> => {
    const params = {
        Bucket: env.S3_BUCKET_CHAPTER_IMAGES,
        Key: filename,
        Body: file
    };

    try {
        const upload = await s3.upload(params).promise();
        return upload.Location;
    } catch (err) {
        throw err;
    }
};
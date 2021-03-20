import express, { Application } from "express";
import routes from "./routes";
import dbConnection from "./config/dbConnection";
import { env } from "./config/env";
import morgan from "morgan";
import cors from "cors";
import { initS3Bucket } from "./config/awsS3";
import fileUpload from "express-fileupload";

dbConnection({ db: env.DB_CONNECTION! });
initS3Bucket();

const allowedOrigins = [env.FRONT_ORIGIN];

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: allowedOrigins
}));
app.use(fileUpload({
  limits: { fileSize: env.MAX_SIZE_TWO_MEGABYTES },
  useTempFiles : false,
  tempFileDir : '/tmp/'
}));
app.use(routes);

// Logging
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const PORT = env.PORT
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
import mongoose from "mongoose";
import Role from '../models/role.model';
import { Roles } from "../types/types";

type DBInput = {
  db: string,
}

export default ({ db }: DBInput) => {
  const connect = () => {
    mongoose
      .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        return console.info(`Successfully connected to MONGODB`);
      })
      .catch(err => {
        console.error(`Error connecting to database :`, err);
        return process.exit(1);
      });
  }

  connect();
  mongoose.connection.on("disconnected", connect);

  Role.countDocuments().exec()
  .then((count: number) => {
    if (count !== 3) {
      Role.deleteMany({})
      .then(() => {
        Role.insertMany([{
          name: Roles.admin
        },{
          name: Roles.mod
        },{
          name: Roles.user
        }]);
      });
    }
  });
}
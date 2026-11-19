import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = (): void => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error("MONGODB_URL environment variable is missing!");
    process.exit(1);
  }

  mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connection successful with database"))
    .catch((error) => {
      console.log("Issue in db connection");
      console.error(error);
      process.exit(1);
    });
};

export default { connect };

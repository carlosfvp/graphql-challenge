import mockDatabase from "../setup/mockDatabase";
import { app } from "./app";
import { connectToDatabase } from "./database";

const start = async () => {
  console.log("Starting......");

  await connectToDatabase();

  await mockDatabase();

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();

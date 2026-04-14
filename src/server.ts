import app from "./app";
import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();
  app.listen(3000);
};

start();
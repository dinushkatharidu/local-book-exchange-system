import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  // Either include dbName here or put it in the URI
  await mongoose.connect(uri, { dbName: "local-book-exchange" });
  console.log("✅ MongoDB connected");
}

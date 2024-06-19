import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.DB_URI;
let client: MongoClient;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const connectMongo = async () => {
  try {
    return await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
  }
};

export default clientPromise;

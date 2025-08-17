import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://fersilva362:K81p6VCYCcB8gy9p@cluster0.wyzjdlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function setupDataBase() {
  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");
    const users = db.collection("users");
    const comments = db.collection("comments");

    return { client, db, movies, users, comments };
  } catch (error) {
    console.log("fail" + error);
  }
}

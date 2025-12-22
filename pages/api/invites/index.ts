import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  if (req.method === "POST") {
    const data = req.body;
    const result = await collection.insertOne({ ...data, createdAt: new Date(), updatedAt: new Date() });
    const invite = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(invite);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  if (req.method === "GET") {
    const invite = await collection.findOne({ _id: new ObjectId(id as string) });
    res.status(200).json(invite);
  } else if (req.method === "PUT") {
    const data = req.body;
    await collection.updateOne(
      { _id: new ObjectId(id as string) },
      { $set: { ...data, updatedAt: new Date() } }
    );
    const updated = await collection.findOne({ _id: new ObjectId(id as string) });
    res.status(200).json(updated);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

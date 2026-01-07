import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  const invites = await collection.find({}).toArray();
  return NextResponse.json(invites);
}

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  const data = await req.json();
  const result = await collection.insertOne({ ...data, createdAt: new Date(), updatedAt: new Date() });
  const invite = await collection.findOne({ _id: result.insertedId });
  return NextResponse.json(invite, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  
  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  const invite = await collection.findOne({ _id: new ObjectId(id) });
  return NextResponse.json(invite);
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  const client = await clientPromise;
  const db = client.db("invites");
  const collection = db.collection("invites");

  const data = await req.json();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return NextResponse.json(updated);
}

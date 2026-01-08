import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db("invites");

  const invite = await db
    .collection("invites")
    .findOne({ _id: new ObjectId(params.id) });

  return NextResponse.json(invite);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db("invites");

  const data = await req.json();

  await db.collection("invites").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...data, updatedAt: new Date() } }
  );

  const updated = await db
    .collection("invites")
    .findOne({ _id: new ObjectId(params.id) });

  return NextResponse.json(updated);
}

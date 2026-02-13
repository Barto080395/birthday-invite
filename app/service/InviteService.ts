// app/service/InviteService.ts
import { db } from "@/firebaseConfig";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { Invite } from "../types/Invite.types";

const invitesCollection = collection(db, "invites");

// CREA INVITO
export async function createInvite(data: {
  title: string;
  message: string;
  location: string;
  targetDate?: string;
}): Promise<Invite> {
  const docRef = doc(invitesCollection);

  const inviteData: Invite = {
    _id: docRef.id,
    title: data.title,
    message: data.message,
    location: data.location,
    targetDate: data.targetDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, inviteData);
  return inviteData;
}

// AGGIORNA INVITO
export async function updateInvite(
  id: string,
  data: {
    title?: string;
    message?: string;
    location?: string;
    targetDate?: string;
  }
): Promise<Invite> {
  const docRef = doc(invitesCollection, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Invite non trovato");

  const updatedData: Partial<Invite> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(docRef, updatedData);

  const finalData: Invite = { ...docSnap.data(), ...updatedData } as Invite;
  return finalData;
}

// OTTIENI INVITO
export async function getInvite(id: string): Promise<Invite | null> {
  const docRef = doc(invitesCollection, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as Invite;
}

import { Invite } from "./types/Invite.types";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/invite`;

export async function createInvite(
  data: Omit<Invite, "_id" | "createdAt" | "updatedAt">
): Promise<Invite> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Errore creazione invite: ${res.status}`);
  return (await res.json()) as Invite;
}

export async function updateInvite(id: string, data: Partial<Invite>): Promise<Invite> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Errore aggiornamento invite: ${res.status}`);
  return (await res.json()) as Invite;
}

export async function getInvite(id: string): Promise<Invite | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
      console.warn(`Invite ${id} non trovato. Status: ${res.status}`);
      return null;
    }
    return (await res.json()) as Invite;
  } catch (err) {
    console.error("Errore fetching invite:", err);
    return null;
  }
}

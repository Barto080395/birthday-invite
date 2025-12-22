import { Invite } from "./types/Invite.types";

const BASE_URL = "http://192.168.1.5:3000/api/invite";

export async function createInvite(
  data: Omit<Invite, "_id" | "createdAt" | "updatedAt">
) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json() as Promise<Invite>;
}

export async function updateInvite(id: string, data: Partial<Invite>) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json() as Promise<Invite>;
}

export async function getInvite(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json() as Promise<Invite>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";

export default function InvitePage() {
  const router = useRouter();        // ← qui lo metti all’inizio del componente
  const { id } = router.query;       // ← estrai l’ID dalla query

  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (!id) return;                 // aspetta che id sia disponibile
    getInvite(id as string).then(setInvite);
  }, [id]);

  if (!invite) return <p>Caricamento...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>{invite.title}</h1>
      <p>📍 {invite.location}</p>
      <p>📅 {invite.targetDate ? new Date(invite.targetDate).toLocaleDateString() : "Data non impostata"}</p>
    </div>
  );
}

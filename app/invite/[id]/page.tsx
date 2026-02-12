"use client";

import { useEffect, useState } from "react";
import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";

interface InvitePageProps {
  params: { id: string };
}

export default function InvitePage({ params }: InvitePageProps) {
  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    getInvite(params.id).then(setInvite);
  }, [params.id]);

  if (!invite) return <p>Caricamento...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>{invite.title}</h1>
      <p>📍 {invite.location}</p>
      <p>📅 {invite.targetDate ? new Date(invite.targetDate).toLocaleDateString() : "Data non impostata"}</p>
      {invite.imageUrl ? (
        <img src={invite.imageUrl} alt="Invito" style={{ width: 200, borderRadius: 12, marginTop: 20 }} />
      ) : (
        <img src="/assets/images/icon.jpg" alt="Invito default" style={{ width: 200, borderRadius: 12, marginTop: 20 }} />
      )}
    </div>
  );
}

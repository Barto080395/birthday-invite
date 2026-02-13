"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";

export default function InvitePage() {
  const params = useParams();
  const id = params?.id as string;

  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (!id) return;
    getInvite(id).then(setInvite);
  }, [id]);

  if (!invite) return <p>Caricamento...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>{invite.title}</h1>
      <p>📍 {invite.location}</p>
      <p>
        📅 {invite.targetDate
          ? new Date(invite.targetDate).toLocaleDateString()
          : "Data non impostata"}
      </p>
    </div>
  );
}

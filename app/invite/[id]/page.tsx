"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";

export default function InvitePage() {
  const router = useRouter();
  const { id } = router.query as { id?: string }; // id può arrivare come undefined

  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Client-side fetch
    const fetchInvite = async () => {
      setLoading(true);
      try {
        const data = await getInvite(id);
        setInvite(data);
      } catch (err) {
        console.error("Errore fetch invite:", err);
        setInvite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Caricamento invito...</p>;
  if (!invite) return <p style={{ textAlign: "center", marginTop: 50 }}>Invito non trovato 😢</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>{invite.title}</h1>
      <p>📍 {invite.location}</p>
      <p>📅 {invite.targetDate ? new Date(invite.targetDate).toLocaleDateString() : "Data non impostata"}</p>
      <img
        src={invite.imageUrl || "/assets/images/icon.jpg"}
        alt="Invito"
        style={{ width: 200, borderRadius: 12, marginTop: 20 }}
      />
    </div>
  );
}

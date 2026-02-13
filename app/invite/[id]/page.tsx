"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (!id) return;
    getInvite(id).then((data) => {
      setInvite(data);
    });
  }, [id]);

  if (!invite) return <p>Caricamento...</p>;

  return (
    <div>
      <h1>{invite.title}</h1>
      <p>{invite.location}</p>
      <p>{invite.targetDate}</p>
    </div>
  );
}

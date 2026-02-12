import { getInvite } from "@/app/service/InviteService";
import { Invite } from "@/app/types/Invite.types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function InvitePage() {
  const router = useRouter();
  const { id } = router.query;

  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (!id) return;
    getInvite(id as string).then(setInvite);
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

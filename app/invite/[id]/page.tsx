// app/invite/[id]/page.tsx
import { getInvite } from "@/app/service/InviteService";

interface InvitePageProps {
  params: { id: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const invite = await getInvite(params.id);
  if (!invite) return <p>Invito non trovato</p>;

  return (
    <div>
      <h1>{invite.title}</h1>
      <p>{invite.location}</p>
      <p>{invite.targetDate}</p>
    </div>
  );
}

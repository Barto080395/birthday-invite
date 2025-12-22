// app/constants/Invite.types.ts
export type Invite = {
    _id?: string;          // MongoDB userà _id
    title: string;
    location: string;
    targetDate: string | null;  // backend restituisce string per date
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  
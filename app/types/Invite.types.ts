// app/constants/Invite.types.ts
export type Invite = {
  _id?: string; // ID documento Firestore
  title: string; // Titolo invito
  message: string;
  location: string; // Location
  targetDate: string | null; // Data evento in formato ISO string
  imageUrl?: string; // URL immagine (opzionale)
  createdAt?: string; // ISO string creazione
  updatedAt?: string; // ISO string ultimo aggiornamento
};

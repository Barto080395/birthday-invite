import { Theme } from "../context/ThemeContext";

export type Invite = {
  _id?: string; // ID documento Firestore
  title: string; // Titolo invito
  message: string;
  location: string; // Location
  targetDate: string | null; // Data evento in formato ISO string
  image?: any; // URL immagine (opzionale)
  createdAt?: string; // ISO string creazione
  updatedAt?: string; // ISO string ultimo aggiornamento
  theme?: Theme;
};

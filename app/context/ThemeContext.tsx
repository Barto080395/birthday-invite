import React, { createContext, useState, useContext, ReactNode } from "react";

export type Theme = {
  background: string;

  card: {
    background: string;
    shadowColor: string;
    shadowOpacity: number;
  };

  titleColor: string;    // colore del titolo
  titleSize: number;     // dimensione del titolo
  messageColor: string;  // colore del messaggio

  button: {
    background: string;
    text: string;
  };
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>({
    background: "#ffe4ef",   // sfondo rosa chiarissimo

    card: {
      background: "#ffffff",
      shadowColor: "#4a2a3a",
      shadowOpacity: 1,
    },
  
    titleColor: "#ff4f8b",   // rosa acceso elegante
    titleSize: 26,
    messageColor: "#4a2a3a", // testo leggibile
  
    button: {
      background: "#ff8fb7", // rosa principale
      text: "#ffffff",
    },
  
  });

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve essere usato dentro ThemeProvider");
  return context;
};

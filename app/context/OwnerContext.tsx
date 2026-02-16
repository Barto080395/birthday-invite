import React, { createContext, useState, useContext, ReactNode } from "react";

type OwnerContextType = {
  isOwner: boolean;
  setIsOwner: (value: boolean) => void;
};

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export const OwnerProvider = ({ children }: { children: ReactNode }) => {
  const [isOwner, setIsOwner] = useState(true); // default true

  return (
    <OwnerContext.Provider value={{ isOwner, setIsOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};

// Hook comodo per usare il context
export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) throw new Error("useOwner deve essere usato dentro OwnerProvider");
  return context;
};

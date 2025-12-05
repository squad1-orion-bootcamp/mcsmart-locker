import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  whatsapp: string;
  setWhatsapp: (whatsapp: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [whatsapp, setWhatsapp] = useState("");

  return (
    <UserContext.Provider value={{ whatsapp, setWhatsapp }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

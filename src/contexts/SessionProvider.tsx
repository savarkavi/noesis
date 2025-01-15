"use client";

import { Session } from "@/lib/session";
import { UserData } from "@/lib/types";
import { createContext, PropsWithChildren, useContext } from "react";

interface SessionContext {
  user: UserData;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used inside SessionProvider");

  return context;
};

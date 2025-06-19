import React, { createContext, useContext, useState, ReactNode } from "react";

type SessionContextType = {
    expired: boolean;
    triggerSessionExpired: () => void;
    resetSession: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [expired, setExpired] = useState(false);

    const triggerSessionExpired = () => setExpired(true);
    const resetSession = () => setExpired(false);

    return (
        <SessionContext.Provider value={{ expired, triggerSessionExpired, resetSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("useSession must be used within a SessionProvider");
    return context;
};

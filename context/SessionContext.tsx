import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { refreshAccessToken } from "@/services/auth";

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

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                console.log("🔄 Attempting token refresh...");
                await refreshAccessToken();
            } catch (err) {
                console.warn("⚠️ Token refresh failed, possibly expired:", err);
                triggerSessionExpired(); // Triggers modal
            }
        }, 15 * 60 * 1000); // ⏱ every 15 minutes

        return () => clearInterval(interval);
    }, []);

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

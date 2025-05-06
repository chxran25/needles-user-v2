// context/ScrollContext.tsx

import React, { createContext, useContext, useState } from "react";

type ScrollContextType = {
    scrollY: number;
    setScrollY: (y: number) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scrollY, setScrollY] = useState(0);

    return (
        <ScrollContext.Provider value={{ scrollY, setScrollY }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollContext = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScrollContext must be used within a ScrollProvider");
    }
    return context;
};

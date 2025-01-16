import React, { createContext, ReactNode, useContext } from "react";

interface LeagueContextProps {
    leagueId: string
    profileId: string
}

const LeagueContext = createContext<LeagueContextProps | undefined>(undefined);

export const useLeagueContext = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        throw new Error('useLeagueContext must be used within a LeagueContextProvider');
    }
    return context
}

interface LeagueProviderProps {
    leagueId: string
    profileId: string
    children: ReactNode
}

export const LeagueProvider: React.FC<LeagueProviderProps> = ({ leagueId, profileId, children }) => {
    return (
        <LeagueContext.Provider value={{ leagueId, profileId }}>
            {children}
        </LeagueContext.Provider>
    );
}
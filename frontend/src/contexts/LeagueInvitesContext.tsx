import { createContext, useContext, useEffect } from "react";
import { InviteMemberResponse } from "../../generated-api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import useGetApi from "../hooks/useGetApi";
import profileService from "../services/profile/profileService";

interface LeagueInvitesContextProps {
    responseData: InviteMemberResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchData: (params: string) => Promise<void>;
    setResponseData: React.Dispatch<React.SetStateAction<InviteMemberResponse | null>>;
}

const LeagueInvitesContext = createContext<LeagueInvitesContextProps | undefined>(undefined);

export const LeagueInvitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const account = useSelector((state: RootState) => state.auth.account);
    const profileId = account?.profileId;

    const { responseData, isLoading, error, fetchData, setResponseData } = useGetApi<InviteMemberResponse, string>(
        (profileId: string) => profileService.getLeagueInvitationsForProfile(profileId)
    );

    useEffect(() => {
        if (profileId) {
            fetchData(profileId);
        }
    }, [profileId, fetchData]);

    return (
        <LeagueInvitesContext.Provider value={{ responseData, isLoading, error, fetchData, setResponseData }}>
            {children}
        </LeagueInvitesContext.Provider>
    );
};

export const useLeagueInvites = (): LeagueInvitesContextProps => {
    const context = useContext(LeagueInvitesContext);
    if (!context) {
        throw new Error('useLeagueInvites must be used within a LeagueInvitesProvider');
    }
    return context;
};
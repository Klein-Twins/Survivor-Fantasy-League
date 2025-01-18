import React, { createContext, useContext, useEffect } from 'react';
import useGetApi from '../hooks/useGetApi';
import profileService from '../services/profile/profileService';
import leagueService from '../services/league/leagueService';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { InviteMemberResponse, League, LeagueInvite, ProfileLeaguesResponse } from '../../generated-api';

interface ProfileLeaguesContextProps {
    invitesData: LeagueInvite[] | null;
    invitesLoading: boolean;
    invitesError: string | null;
    setInvitesData: React.Dispatch<React.SetStateAction<InviteMemberResponse | null>>;
    leaguesData: League[] | null;
    leaguesLoading: boolean;
    leaguesError: string | null;
    setLeaguesData: React.Dispatch<React.SetStateAction<Response | null>>;
}

const ProfileLeaguesContext = createContext<ProfileLeaguesContextProps | undefined>(undefined);

export const ProfileLeaguesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const account = useSelector((state: RootState) => state.auth.account);
    const profileId = account?.profileId;

    const {
        responseData: invitesData,
        isLoading: invitesLoading,
        error: invitesError,
        fetchData: fetchInvites,
        setResponseData: setInvitesData,
    } = useGetApi<InviteMemberResponse, string>((profileId: string) => profileService.getLeagueInvitationsForProfile(profileId));

    const {
        responseData: leaguesData,
        isLoading: leaguesLoading,
        error: leaguesError,
        fetchData: fetchLeagues,
        setResponseData: setLeaguesData,
    } = useGetApi<ProfileLeaguesResponse, string>((profileId: string) => leagueService.getLeaguesForProfile(profileId));

    useEffect(() => {
        if (profileId) {
            fetchInvites(profileId);
            fetchLeagues(profileId);
        }
    }, [profileId, fetchInvites, fetchLeagues]);

    return (
        <ProfileLeaguesContext.Provider
            value={{
                invitesData,
                invitesLoading,
                invitesError,
                setInvitesData,
                leaguesData,
                leaguesLoading,
                leaguesError,
                setLeaguesData,
            }}
        >
            {children}
        </ProfileLeaguesContext.Provider>
    );
};

export const useProfileLeagues = (): ProfileLeaguesContextProps => {
    const context = useContext(ProfileLeaguesContext);
    if (!context) {
        throw new Error('useProfileLeagues must be used within a ProfileLeaguesProvider');
    }
    return context;
};
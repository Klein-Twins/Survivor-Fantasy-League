import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import useGetApi from '../../../hooks/useGetApi';
import LeagueInvitesList from './LeagueInvitesList';
import profileService from '../../../services/profile/profileService';
import { InviteMemberResponse, LeagueInvite } from '../../../../generated-api';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

const LeagueInvitesPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const account = useSelector((state: RootState) => state.auth.account);
    const profileId = account?.profileId;

    const { responseData, isLoading, error, fetchData } = useGetApi<InviteMemberResponse, string>(
        (profileId: string) => profileService.getLeagueInvitationsForProfile(profileId)
    );

    useEffect(() => {
        if (profileId) {
            fetchData(profileId);
        }
    }, [profileId, fetchData]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    let bgColor = "bg-slate-100";
    if (error) {
        bgColor = "bg-red-200";
    }

    return (
        <>
            <div className="flex flex-col mx-auto bg-slate-300 py-2 px-2 rounded-lg shadow-lg w-auto">
                <div onClick={toggleOpen} className="flex justify-between items-center hover:cursor-pointer px-2">
                    <h1 className='text-xl text-center font-bold'>League Invitations {responseData?.numLeagueInvites ? `(${responseData.numLeagueInvites})` : '(0)'}</h1>
                    {isOpen ? <ChevronUpIcon className="h-6 w-6 text-gray-700" /> : <ChevronDownIcon className="h-6 w-6 text-gray-700" />}
                </div>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    <hr className="border-t border-slate-400 my-2" />
                    <div className={`flex justify-between rounded-lg p-2 text-lg text-center transition-shadow ${bgColor}`}>
                        <div className='w-full'>
                            {isLoading && <h1 className='text-lg text-center'>Loading League Invitations...</h1>}
                            {!isLoading && error && <p>{error}</p>}
                            {!isLoading && !error && responseData && responseData.numLeagueInvites && responseData.numLeagueInvites > 0 ? (
                                <LeagueInvitesList leagueInvites={responseData.leagueInvites as LeagueInvite[]} />
                            ) : (
                                <h1 className='text-lg text-left'>You have no league invitations at the moment.</h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeagueInvitesPanel;
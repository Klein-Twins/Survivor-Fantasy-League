import React, { useState } from "react";
import { InviteRespondBodyInviteResponseEnum, LeagueInvite as LeagueInviteSchema } from "../../../../generated-api";
import { Button } from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import profileService from "../../../services/profile/profileService";
import usePostApi from "../../../hooks/usePostApi";

interface LeagueInviteProps {
    leagueInvite: LeagueInviteSchema;
    onRemoveInvite: (leagueId: string) => void;
}

const LeagueInvite: React.FC<LeagueInviteProps> = ({ leagueInvite, onRemoveInvite }) => {

    const [acceptClicked, setAcceptClicked] = useState(false);
    const [declineCLicked, setDeclineClicked] = useState(false);

    const account = useSelector((state: RootState) => state.auth.account);

    const {
        data: responseData,
        isLoading,
        error: apiError,
        execute: respondToInvite,
    } = usePostApi<any>(profileService.respondToLeagueInvite);

    const onAcceptClick = async () => {
        if (!account || !account.profileId || !leagueInvite || !leagueInvite.league || !leagueInvite.league.leagueId) {
            console.log("Failed to accept invite");
            return;
        }

        setAcceptClicked(true);

        const profileId = account.profileId;
        const inviteResponse = InviteRespondBodyInviteResponseEnum.ACCEPT;
        const leagueId = leagueInvite.league.leagueId;

        try {
            await respondToInvite(profileId, leagueId, inviteResponse);
            onRemoveInvite(leagueId);
        } catch (err) {
            console.error(err);
        }

        setAcceptClicked(false);
    };

    const onDeclineClick = async () => {
        if (!account || !account.profileId || !leagueInvite || !leagueInvite.league || !leagueInvite.league.leagueId) {
            console.log("Failed to decline invite");
            return;
        }

        setDeclineClicked(true);

        const profileId = account.profileId;
        const inviteResponse = InviteRespondBodyInviteResponseEnum.DECLINE;
        const leagueId = leagueInvite.league.leagueId;

        try {
            await respondToInvite(profileId, leagueId, inviteResponse);
            onRemoveInvite(leagueId);
        } catch (err) {
            console.error(err);
        }

        setDeclineClicked(false);
    };


    return (
        <div className="flex text-left justify-start w-full bg-blue-400 rounded-lg">
            <div className="flex flex-col p-4 space-y-2 w-4/5">
                <div className="flex flex-col">
                    <h1>League Name:</h1>
                    <h1 className="w-full text-xl font-bold ml-2">{leagueInvite.league?.name}</h1>
                </div>

                <h2 className="text-lg">Season: {leagueInvite.league?.season}</h2>
                <p className="text-lg ">{leagueInvite.message}</p>
            </div>
            <div className="flex flex-col space-y-2 w-1/5 p-2">
                <Button className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 w-full h-1/2" onClick={onAcceptClick}>{isLoading && acceptClicked ? "Loading..." : "Accept"}</Button>
                <Button className="bg-slate-200 p-2 rounded-md hover:bg-slate-300 w-full h-1/2" onClick={onDeclineClick}>{isLoading && declineCLicked ? "Loading..." : "Decline"}</Button>
            </div>
        </div>
    )
}

export default LeagueInvite
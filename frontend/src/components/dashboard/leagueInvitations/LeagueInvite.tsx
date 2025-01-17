import React from "react";
import { LeagueInvite as LeagueInviteSchema } from "../../../../generated-api";
import { Button } from "@headlessui/react";

interface LeagueInviteProps {
    leagueInvite: LeagueInviteSchema
}

const LeagueInvite: React.FC<LeagueInviteProps> = ({ leagueInvite }) => {
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
                <Button className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 w-full h-1/2">Accept</Button>
                <Button className="bg-slate-200 p-2 rounded-md hover:bg-slate-300 w-full h-1/2">Decline</Button>
            </div>
        </div>
    )
}

export default LeagueInvite
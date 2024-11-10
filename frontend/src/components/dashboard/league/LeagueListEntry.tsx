import React from 'react'

interface LeagueListEntryProps {
  league: any;
}


const LeagueListEntry: React.FC<LeagueListEntryProps> = ({league}) => {
  return (
    <div className="flex justify-between bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
      <div>
        <h5 className="text-lg font-semibold text-gray-800">{league.name}</h5>
        <p className="text-sm text-gray-600">Season: The New Era 2.0</p>
        <p className="text-sm text-gray-600">Location: Fiji, Oceania</p>
      </div>
      <div className="self-center">
        <button className="bg-blue-500 text-white text-sm py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          View League
        </button>
      </div>
    </div>
  )
}

export default LeagueListEntry

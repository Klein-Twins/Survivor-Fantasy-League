import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { League } from '../../../../generated-api';
import hamburgerImg from '../../../assets/hamburger.svg';
interface LeagueListEntryProps {
  league: League;
}

const LeagueListEntry: React.FC<LeagueListEntryProps> = ({ league }) => {

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const onClickLeagueEntry = (leagueId: number): void => {
    navigate(`/league`, { state: { leagueId } });
  }

  const handleDropdownChange = (action: string) => {
    setIsDropdownOpen(false); // Close the dropdown after an option is selected
    switch (action) {
      case "view":
        onClickLeagueEntry(league.leagueId);
        break;
      case "invite":
        // Handle invite friends logic
        console.log("Invite Friends");
        break;
      case "delete":
        // Handle delete league logic
        console.log("Delete League");
        break;
      default:
        break;
    }
  }

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  }


  return (
    <div className="flex justify-between bg-white rounded-lg transition-shadow cursor-pointer">
      <div className='w-full' onClick={() => onClickLeagueEntry(league.leagueId)}>
        <h5 className="text-lg font-semibold text-gray-800">{league.name}</h5>
        <p className="text-sm text-gray-600" > Season: The New Era 2.0</p>
        <p className="text-sm text-gray-600">Location: Fiji, Oceania</p>
      </div >
      <div className="relative self-center w-12">
        <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img className="w-6 mx-auto" src={hamburgerImg} alt="options" />
        </div>
        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
            onMouseLeave={handleMouseLeave}>
            <li>
              <button
                onClick={() => handleDropdownChange("view")}
                className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
              >
                View League
              </button>
            </li>
            <li>
              <button
                onClick={() => handleDropdownChange("invite")}
                className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
              >
                Invite Friends
              </button>
            </li>
            <li>
              <button
                onClick={() => handleDropdownChange("delete")}
                className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
              >
                Delete League
              </button>
            </li>
          </ul>
        )}
      </div>
    </div >
  )
}

export default LeagueListEntry

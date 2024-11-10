import { useState } from "react";

interface SeasonSelectProps {
  seasons: number[];
  onSeasonChange: (season: number) => void;
}

const SeasonSelect: React.FC<SeasonSelectProps> = ({ seasons, onSeasonChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<number>(seasons[seasons.length-1]);
  
    const handleSelectSeason = (season: number) => {
      setSelectedSeason(season);
      onSeasonChange(season);
      setIsOpen(false);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    }
  
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedSeason ? `Season ${selectedSeason}` : "Select Season"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
  
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            onMouseLeave={handleMouseLeave}>
            <div className="max-h-60 overflow-y-auto">
                <div className="py-1">
                {seasons.map((season) => (
                    <button
                    key={season}
                    onClick={() => handleSelectSeason(season)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 focus:outline-none"
                    >
                    Season {season}
                    </button>
                ))}
                </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default SeasonSelect;
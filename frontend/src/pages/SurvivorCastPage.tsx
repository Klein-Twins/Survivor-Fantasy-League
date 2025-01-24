import React, { useState, useEffect } from "react";
import SurvivorCardList from "../components/survivor/SurvivorCardList";
import survivorService, { GetSurvivorsBySeasonRequestParams } from "../services/survivor/survivorService";
import SeasonSelect from "../components/survivor/SeasonSelect";
import { useApi } from "../hooks/useApi";
import { GetSurvivorsResponse, Survivor } from "../../generated-api";

const availableSeasons : number[] = [47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const SurvivorCastPage : React.FC = () => {

    // const [survivors, setSurvivors] = useState<SurvivorDetails[]>([]);
    // const [loading, setLoading]=  useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<number>(availableSeasons[0]);

    const {data, isLoading : loading, error, execute} = useApi<void, GetSurvivorsBySeasonRequestParams, GetSurvivorsResponse>(
        survivorService.getSurvivorsWithDetailsBySeasonService
    )

    const survivors : Survivor[] = data?.responseData?.survivors || []


    useEffect(() => {
        const getSurvivors = async () => {
            execute({queryParams: {seasonId: selectedSeason}})
        };
        getSurvivors();
    }, [selectedSeason]);

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-between items-center mx-8 pt-4 pb-8">
            <h2 className="text-4xl font-semibold">Survivor Cast</h2>
            <SeasonSelect
            seasons={availableSeasons}
            onSeasonChange={(season) => setSelectedSeason(season)}
            />
        </div>
        {!loading && !error && <SurvivorCardList survivors={survivors} />}
        {!loading && error && <h2 className="text-center text-xl">{error}</h2>}
        {loading && <h2 className="text-center text-xl">Loading Survivors</h2>}
      </div>
    )
}

export default SurvivorCastPage;
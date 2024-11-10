import axios from "axios";
import React, { useState, useEffect } from "react";

interface SurvivorResponseData {
    survivorId : string,
    seasonId : string,
    firstName : string,
    lastName : string,
    nickName : string | null,
    originalTribeId : string | null,
    age : number,
    description: string,
    job : string,
    fromCity : string,
    fromState : string,
    fromCountry : string,
    imageUrl : string
}

const SurvivorCastPage : React.FC = () => {

    const [survivors, setSurvivors] = useState<SurvivorResponseData[]>([]);
    const [loading, setLoading]=  useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSurvivors = async () => {
            const seasonId = 47
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:3000/api/survivors?seasonId=47');
                setSurvivors(response.data.survivors);
            } catch (error) {
                setError("Failed to fetch survivors");
            } finally {
                setLoading(false);
            };
        };
        getSurvivors();
    }, []);

    if(loading) return <div>loading...</div>
    if(error) return <div>{error}</div>

    return (
        <div>
            <h2>Survivors</h2>
            <ul>
                {survivors.map(survivor => (
                    <li key={survivor.survivorId}>
                        <h3>{survivor.firstName} {survivor.lastName}</h3>
                        <img src={`http://localhost:3000/${survivor.imageUrl}`} alt={`${survivor.firstName} ${survivor.lastName}`} />
                        <p>{survivor.description}</p>
                        <p>From: {survivor.fromCity}, {survivor.fromState}, {survivor.fromCountry}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SurvivorCastPage;
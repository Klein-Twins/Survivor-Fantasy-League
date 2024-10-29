import { useEffect, useState } from "react";
import SurvivorCard from "../components/roster/SurvivorCard";

import getSurvivorCast from "../http/getSurvivorCast";

export default function RosterPage() {

    const [isFetching, setIsFetching] = useState(false);
    const [survivorCast, setSurvivorCast] = useState();

    useEffect(() => {
        async function fetchSurvivorCast() {
            setIsFetching(true);
            try {
                const response = await fetch('http://localhost:4343/api/survivorCastList');
                if(!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`)
                }
                const result = await response.json();
                setSurvivorCast(result);
            } catch (error) {
                console.log("Erorr fetching data: ",error);
            }
            setIsFetching(false);
        }
        fetchSurvivorCast();
        console.log(survivorCast);
    }, [])

    return (
        <>
            <ul className="flex flex-col space-y-6">
                {survivorCast.map((survivor) => {
                    return <li><SurvivorCard survivor={survivor} /></li>
                })}
            </ul>  
        </>

    );
}
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
    return (
        <>
            <div className="flex flex-col justify-between items-center md:flex-row py-4 px-4 bg-slate-800 text-slate-200 space-y-2 md:space-y-0 text-xl">
                <h1 style={{fontFamily: 'SurvivorFont'}}>Survivor Fantasy League</h1>
                <MainNavigation />
            </div>
            <main className="h-screen bg-gradient-to-b from-slate-800 to-yellow-500 text-slate-200 mx-auto p-4 text-center">
                <Outlet />
            </main>
        </>
    );
}
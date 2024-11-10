import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const HomePage: React.FC = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    
    return (
        <>
        <h1>{user ? `Hello ${user.username}` : "Please login or create an account"}</h1>   
        </>

    )
}

export default HomePage;
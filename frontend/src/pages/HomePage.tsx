import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const HomePage: React.FC = () => {

    const account = useSelector((state: RootState) => state.auth.account);
    
    return (
        <>
        <h1>{account ? `Hello ${account.userName}` : "Please login or create an account"}</h1>   
        </>

    )
}

export default HomePage;
import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../store/slices/modalSlice.ts";
import { logoutUser } from "../../store/slices/authSlice.ts";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/store.ts";

const LogoutConfirmation: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    function handleNoClick() {
        dispatch(closeModal());
    }

    async function handleYesClick() {
        const resultAction = await dispatch(logoutUser());
        if(logoutUser.fulfilled.match(resultAction)) {
            console.log('Logout successful', resultAction.payload);
            dispatch(closeModal());
            navigate("/");
        } else {
            dispatch(closeModal());
        }
    }

    return (
        <>
            <h2 className="text-center text-2xl">Are you sure you want to logout?</h2>
            <div className="flex items-center justify-center space-x-4 pt-4">
                <button onClick={handleNoClick} className="w-1/2 bg-gray-200 rounded hover:bg-gray-300">No</button>
                <button onClick={handleYesClick} className="w-1/2 bg-gray-200 rounded hover:bg-gray-300">Yes</button>
            </div>
        </>
    );
}

export default LogoutConfirmation;
import React from "react";
import { useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import { RootState } from "../store/store";
import Navbar from "../components/navbar/Navbar";
import Modal from "../components/ui/Modal";

const RootLayout : React.FC = () => {
    const isOpen = useSelector((state: RootState) => state.modal.isOpen);

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Modal isOpen ={isOpen} />
        </>
    );
};

export default RootLayout;
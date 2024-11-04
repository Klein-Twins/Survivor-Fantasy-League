import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store.ts";
import { closeModal } from "../../store/slices/modalSlice.ts";
import SignupForm from "../auth/forms/SignupForm.tsx";
import LoginForm from "../auth/forms/LoginForm.tsx"
import Form from "./forms/Form.tsx";
import LogoutConfirmation from "../auth/LogoutConfirmation.tsx";

interface ModalProps {
    isOpen: boolean;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
    const dispatch = useDispatch();
    const modalType = useSelector((state: RootState) => state.modal.modalType);

    if(!isOpen) return null;

    const handleClose = () => {
        dispatch(closeModal());
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg relative w-1/2">
            <button onClick={handleClose} className="absolute top-2 right-3 text-blue-500 hover:text-black">
                ✕
            </button>
            
            {modalType === 'signup' && <Form title={"Sign Up"}><SignupForm /></Form>}
            {modalType === 'login' && <Form title={"Log In"}><LoginForm /></Form>}
            {modalType === 'logout' && <LogoutConfirmation />}
            </div>
        </div>
    );
}

export default Modal;
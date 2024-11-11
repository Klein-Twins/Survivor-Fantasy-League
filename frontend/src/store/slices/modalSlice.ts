import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurvivorDetails } from "../../types/survivorTypes";

type ModalType = 'login' | 'signup' | 'logout' | 'notify' | 'createLeague' | 'survivorDetail'  | null;

interface ModalState {
    isOpen: boolean;
    modalType: ModalType;
    modalProps?: any;
}

const initialState: ModalState = { 
    isOpen: false,
    modalType: null
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<{ type: ModalType; props?: any }>) {
            state.isOpen = true;
            state.modalType = action.payload.type;
            state.modalProps = action.payload.props;
        },
        closeModal(state) {
            state.isOpen = false;
            state.modalType = null;
            state.modalProps = undefined;
        }
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
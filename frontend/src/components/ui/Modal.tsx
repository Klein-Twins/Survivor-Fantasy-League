import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store.ts';
import { closeModal } from '../../store/slices/modalSlice.ts';
import SignupForm from '../auth/forms/SignupForm.tsx';
import LoginForm from '../auth/forms/LoginForm.tsx';
import Form from './forms/Form.tsx';
import LogoutConfirmation from '../auth/LogoutConfirmation.tsx';
import SurvivorDetailCard from '../survivorPage/SurvivorDetailCard.tsx';
import Notification from './Notifcation.tsx';
import { ButtonPrimaryTextColor, MainBackgroundColors, ModalColors } from '../../styles/CommonColorClassNames.ts';

interface ModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const dispatch = useDispatch();
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const modalProps = useSelector((state: RootState) => state.modal.modalProps);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div
      className={`fixed inset-0 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center ${MainBackgroundColors}`}>
      <div className={`${ModalColors} p-6 rounded shadow-lg relative w-11/12 sm:w-5/6 md:w-1/2`}>
        <button onClick={handleClose} className={`absolute top-2 right-3 ${ButtonPrimaryTextColor}`}>
          ✕
        </button>

        {modalType === 'signup' && <SignupForm />}
        {modalType === 'login' && <LoginForm />}
        {modalType === 'survivorDetail' && <SurvivorDetailCard survivor={modalProps.survivor} />}
        {modalType === 'notify' && <Notification title={modalProps.title} description={modalProps.description} />}
        {modalType === 'logout' && <LogoutConfirmation />}
      </div>
    </div>
  );
};

export default Modal;

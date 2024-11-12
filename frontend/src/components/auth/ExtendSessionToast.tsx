import React, { useState, useEffect } from 'react';
import { useTokenExpiration } from '../../hooks/auth/useRefreshTokenExpiration';
import { extendSessionService } from '../../services/auth/authService';

interface ToastProps {
}

const ExtendSessionToast: React.FC<ToastProps> = () => {

  const { isExpiringSoon, remainingTime, isLoading, extendSession } = useTokenExpiration();
  const [hasNotified, setHasNotified] = useState<boolean>(false);

  function handleClose() {
    setHasNotified(true);
  }

  function handleExtendSession() {
    if (!isLoading) {
      extendSession();
    }
  }


  return (
    <>
      {isExpiringSoon && remainingTime !== null && !hasNotified && (
        <div
          className="fixed bottom-4 right-4 w-80 max-w-sm p-4 bg-white rounded-lg shadow-lg border border-gray-300"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <strong className="font-semibold mr-2">Torch about to be extinguished</strong>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              type="button"
              className="ml-2 text-xl text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="flex mt-2 space-x-3 items-center text-gray-700">
            <p>Do you want to extend your session?</p>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-3 h-2/3 py-2 bg-stone-100 hover:bg-stone-200 rounded"
            >
              No
            </button>
            <button
              onClick={handleExtendSession}
              className="px-3 h-2/3 py-2 bg-stone-300 hover:bg-stone-400 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Extending..." : "Yes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtendSessionToast;
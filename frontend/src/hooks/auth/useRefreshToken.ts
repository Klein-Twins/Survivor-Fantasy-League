import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { extendSession, logoutUser } from '../../store/slices/authSlice';
import { openModal } from '../../store/slices/modalSlice';

export const useRefreshToken = () => {
  const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const userSessionEndTime = useSelector((state: RootState) => state.auth.sessionEndTime);

  const checkTokenExpiration = useCallback(() => {
    if (!userSessionEndTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = userSessionEndTime - currentTime;
    const fiveMinutesInSeconds = 5 * 60;

    // Check if session has expired
    if (timeUntilExpiration <= 0) {
      dispatch(
        openModal({
          type: 'notify',
          props: {
            title: 'Your torch has been extinguished',
            description:
              "For your security, you've been logged out.\nReady to outwit, outplay, and outlast again? Log in to keep your journey alive!",
          },
        })
      );
      dispatch(logoutUser());
      return;
    }

    // Check if expiring soon
    setIsExpiringSoon(timeUntilExpiration <= fiveMinutesInSeconds);
  }, [userSessionEndTime, dispatch]);

  const extendUserSession = async () => {
    await dispatch(extendSession());
  };

  useEffect(() => {
    checkTokenExpiration(); // Check immediately on mount
    const intervalId = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [checkTokenExpiration]);

  return { isExpiringSoon, extendSession: extendUserSession };
};

export default useRefreshToken;

// const checkTokenExpiration = useCallback(async () => {
//   const timeUntilExpires = userSessionEndTime ? userSessionEndTime - Date.now() / 1000 : 0;
//   let isExpiringSoonTimeoutId: NodeJS.Timeout | undefined = undefined;

//   // console.log(`Date.now() = ${Date.now() / 1000}`);
//   // console.log(`userSessionEndTime = ${userSessionEndTime}`);
//   console.log(`timeUntilExpires = ${timeUntilExpires}`);
//   console.log(`timeUntilExpires < 5 * 60 = ${5 * 60}`);

// //   if (timeUntilExpires > 0 && timeUntilExpires < 5 * 60) {
// //     //isExpiringSoonTimeoutId = setTimeout(() => {}, timeUntilExpires);

// //     // Log out the user if the token has expired
// //     if (timeUntilExpires <= 0) {
// //       dispatch(
// //         openModal({
// //           type: 'notify',
// //           props: {
// //             title: 'Your torch has been extinguished',
// //             description: `For your security, you've been logged out.\nReady to outwit, outplay, and outlast again? Log in to keep your journey alive!`,
// //           },
// //         })
// //       );
// //       dispatch(logoutUser());
// //     }
// //   }
// // }, [dispatch]);

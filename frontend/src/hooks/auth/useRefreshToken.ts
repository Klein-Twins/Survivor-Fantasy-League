import { useState, useEffect, useCallback } from "react";
import { extendSessionService } from "../../services/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser } from "../../store/slices/authSlice";
import { openModal } from "../../store/slices/modalSlice";

export const useRefreshToken = () => {
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false);
    const [sessionUpdated, setSessionUpdated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state
    const dispatch = useDispatch<AppDispatch>();
    const userSessionEndTime = useSelector((state: RootState) => state.auth.sessionEndTime)

    const checkTokenExpiration = useCallback(async () => {
        const timeUntilExpires = userSessionEndTime ? userSessionEndTime - Date.now() / 1000 : 0;
        const isExpiringSoonTimeoutId: number | undefined = undefined;

        console.log(`Date.now() = ${Date.now() / 1000}`);
        console.log(`userSessionEndTime = ${userSessionEndTime}`);
        console.log(`timeUntilExpires = ${timeUntilExpires}`)
        if (timeUntilExpires > 0 && timeUntilExpires < 5 * 1000 * 60) {
            isExpiringSoonTimeoutId = setTimeout(() => {

            }, timeUntilExpires)

            // Log out the user if the token has expired
            if (expiration.remainingTime <= 0) {
                dispatch(openModal({
                    type: 'notify',
                    props: {
                        title: 'Your torch has been extinguished',
                        description: `For your security, you've been logged out.\nReady to outwit, outplay, and outlast again? Log in to keep your journey alive!`
                    }
                }));
                dispatch(logoutUser());
            }
        }
    }, [dispatch]);

    const extendSession = async () => {
        dispatch(extendSession)
    };

    useEffect(() => {
        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [checkTokenExpiration, sessionUpdated]);

    return { remainingTime, isExpiringSoon, isLoading, extendSession };
}
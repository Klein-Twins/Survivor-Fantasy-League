import { useState, useEffect, useCallback } from "react";
import { extendSessionService, getRefreshTokenExpirationService } from "../../services/auth/authService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { logoutUser } from "../../store/slices/authSlice";
import { openModal } from "../../store/slices/modalSlice";

export const useTokenExpiration = () => {
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false);
    const [sessionUpdated, setSessionUpdated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state
    const dispatch = useDispatch<AppDispatch>();

    const checkTokenExpiration = useCallback(async () => {
        const expiration = await getRefreshTokenExpirationService();
        if (expiration) {
            setRemainingTime(expiration.remainingTime);
            setIsExpiringSoon(expiration.remainingTime <= 300);

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
        setIsLoading(true);
        try {
            await extendSessionService();
            setSessionUpdated(prev => !prev); // Toggle to force hook to rerun
        } catch (error) {
            console.error('Failed to extend session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [checkTokenExpiration, sessionUpdated]);

    return { remainingTime, isExpiringSoon, isLoading, extendSession };
}
import { Outlet } from "react-router-dom";  
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshtoken";
import Loader from "../components/utils/Loader";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                // console.error("Token refresh error:", err);
            } finally {
                if (isMounted) {
                    setTimeout(() => setIsLoading(false), 1500); // 3-second delay
                }
            }
        };

        if (!auth?.token && persist) {
            verifyRefreshToken();
        } else {
            setTimeout(() => setIsLoading(false), 1500);
        }

        return () => {
            isMounted = false;
        };
    }, [auth?.token, refresh, persist]);

    if (!persist) {
        return <Outlet />;
    }

    if (isLoading) {
        return <Loader />;
    }

    return <Outlet />;
};

export default PersistLogin;

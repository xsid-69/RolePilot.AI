import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContextShared';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userParam = queryParams.get('user');

        if (userParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userParam));
                login(userData);
                toast.success("Successfully logged in with Google!");
                navigate("/");
            } catch (error) {
                console.error("Error parsing user data", error);
                toast.error("Failed to login with Google.");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [location, login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e] text-white">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p>Authenticating...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;

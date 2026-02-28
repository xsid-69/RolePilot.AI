import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContextShared';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    useEffect(() => {
        const verifySession = async () => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
                    credentials: 'include'
                });
                const data = await resp.json();
                if (data && data.success && data.user) {
                    login(data.user);
                    toast.success("Successfully logged in with Google!");
                    navigate("/");
                } else {
                    toast.error("Failed to validate Google session.");
                    navigate("/login");
                }
            } catch (err) {
                console.error('Error verifying session', err);
                toast.error("Failed to validate Google session.");
                navigate('/login');
            }
        };

        verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

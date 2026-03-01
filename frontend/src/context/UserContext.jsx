import React, { useState, useCallback } from 'react';
import { UserContext } from './UserContextShared';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const login = useCallback((userData, jwtToken) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (jwtToken) {
            setToken(jwtToken);
            localStorage.setItem('token', jwtToken);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }, []);

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

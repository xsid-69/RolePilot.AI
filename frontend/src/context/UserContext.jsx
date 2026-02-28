import React, { useState, useCallback } from 'react';
import { UserContext } from './UserContextShared';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

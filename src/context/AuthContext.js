import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Check local storage for existing session
    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('parfum_admin_session') === 'true';
    });

    const login = (username, password) => {
        // Hardcoded credentials as requested
        if (username === 'admin' && password === 'Kc@123456') {
            setIsAdmin(true);
            localStorage.setItem('parfum_admin_session', 'true');
            return { success: true };
        } else {
            return { success: false, message: 'Kullanıcı adı veya şifre hatalı.' };
        }
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('parfum_admin_session');
    };

    const value = {
        isAdmin,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    // Add a new state for the user's role
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    // Update the login function to accept both token and role
    const login = (newToken, newRole) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', newRole); // Save role to localStorage
        setToken(newToken);
        setUserRole(newRole); // Save role to state
    };

    // Update the logout function to clear the role as well
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); // Remove role from localStorage
        setToken(null);
        setUserRole(null); // Clear role from state
    };

    // This effect ensures all open tabs are in sync
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            setUserRole(localStorage.getItem('userRole'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        // Provide the userRole to the rest of the app
        <AuthContext.Provider value={{ token, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
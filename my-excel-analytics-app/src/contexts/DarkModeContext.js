import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            const savedMode = localStorage.getItem('isDarkMode');
            return savedMode ? JSON.parse(savedMode) : false;
        } catch (error) {
            console.error("Failed to parse isDarkMode from localStorage", error);
            return false;
        }
    });

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
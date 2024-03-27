import React, { createContext, useContext, useState, useCallback } from 'react';

const LocalStorageContext = createContext();

export const useLocalStorageContext = () => useContext(LocalStorageContext);

export const LocalStorageProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(0); // Add a reset trigger

    const ResetNumbers = useCallback(() => {
        setResetTrigger((current) => current + 1); // Update the reset trigger to signal a reset
    }, []);

    const triggerUpdate = () => {
        setUpdateTrigger(current => {
            return current + 1;
        });
    };

    return (
        <LocalStorageContext.Provider value={{ triggerUpdate, ResetNumbers, resetTrigger }}>
            {children}
        </LocalStorageContext.Provider>
    );
};

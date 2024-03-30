import React, { createContext, useContext, useState } from 'react';

const LocalStorageContext = createContext();

export const useLocalStorageContext = () => useContext(LocalStorageContext);

export const LocalStorageProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1); // Default duration
    const [showAnswer, setShowAnswer] = useState(false);

    const ResetNumbers = () => setResetTrigger(current => current + 1);

    const triggerUpdate = () => setUpdateTrigger(current => current + 1);

    const ToggleTimer = (value=null) => setIsTimerActive(current => value==null ? !current : value);

    const setDuration = (duration) => setTimerDuration(duration);

    const ToggleShowAnswer = (value=null) => setShowAnswer(current => value==null ? !current : value);

    return (
        <LocalStorageContext.Provider value={{
            triggerUpdate, 
            ResetNumbers, 
            resetTrigger, 
            isTimerActive, 
            ToggleTimer,
            timerDuration, 
            setDuration, 
            showAnswer, 
            ToggleShowAnswer
        }}>
            {children}
        </LocalStorageContext.Provider>
    );
};

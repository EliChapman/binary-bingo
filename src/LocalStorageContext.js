import React, { createContext, useContext, useState } from 'react';

// Create a context to store the state of the local storage
// At least, that was its initial function, it now just handles the state of literally everything that needs it
const LocalStorageContext = createContext();

// Hook to access the context
export const useLocalStorageContext = () => useContext(LocalStorageContext);


// Provider to provide the context to all components
export const LocalStorageProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState([false, 0]); // A trigger to update the Called Numbers list
    const [resetTrigger, setResetTrigger] = useState(0); // A trigger to reset the Called Numbers list
    const [isTimerActive, setIsTimerActive] = useState(false); // A trigger to activate the timer component, and switch from manual to answer displaying
    const [timerDuration, setTimerDuration] = useState(-1); // The duration of the timer
    const [showAnswer, setShowAnswer] = useState(false); // A trigger to show the answer to the current number

    const ResetNumbers = () => setResetTrigger(current => current + 1); // Incriments the trigger, components just watch to see when it changes

    const triggerUpdate = (showCurrent = false) => setUpdateTrigger(current => [showCurrent, current[1] + 1]); // First value represents if the current number should be shown, second value is the trigger

    const ToggleTimer = (value=null) => setIsTimerActive(current => value==null ? !current : value); // Switches between true or false everytime its called, unless a specific value is specified

    const setDuration = (duration) => setTimerDuration(duration); // Sets the duration of the timer

    const ToggleShowAnswer = (value=null) => setShowAnswer(current => value==null ? !current : value); // Switches between true or false everytime its called, unless a specific value is specified

    // Return the provider with the context
    return (
        <LocalStorageContext.Provider value={{
            triggerUpdate,
            updateTrigger, 
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

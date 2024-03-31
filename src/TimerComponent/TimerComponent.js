import React, { useState, useEffect } from 'react';
import './TimerComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';

const TimerComponent = () => {
    const { ToggleShowAnswer, timerDuration, isTimerActive, ToggleTimer, setDuration, triggerUpdate } = useLocalStorageContext(); // context stuff
    const [timeLeft, setTimeLeft] = useState(timerDuration); // State variable for the time left on the timer, default is the timer duration from the context

    const changeTimerState = () => {
        // Clicked Animation
        const element = document.getElementById('timer-button')
    
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // :(
        element.classList.add('clicked'); // start animation  
        
        ToggleTimer() // Switch the timer state
    }

    // Reset timer when context timer duration changes
    useEffect(() => {
        setTimeLeft(timerDuration);
    }, [timerDuration]);

    // Timer logic
    useEffect(() => {
        // If the timer is not active or the duration is -1, return
        if (!isTimerActive || timerDuration === -1) {
            return;
        }
        // If the time left is 0, show the answer and update the history
        else if (timeLeft === 0) {
            ToggleShowAnswer(true);
            triggerUpdate(true); // Update history (show current number)
            setDuration(-1); // Set duration to -1, signaling that the answer is shown
            return;
        }
    
        // Decrement the time left by 1 every second
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

        // Cleanup
        return () => clearTimeout(timerId);
    }, [timeLeft, isTimerActive, ToggleShowAnswer, setDuration, timerDuration, triggerUpdate]); // Re-run whenever timeLeft, isTimerActive, or timerDuration changes. It does not need to rerun this often but the useEffect hook dependacy law people will yell at me if I don't include them

    // Render the Timer
    return (
        <div id="timer-component">
            <h2 id="timer-header">
                Timer
            </h2> 
            <span id="time-left" style={{opacity: isTimerActive ? 1 : 0}}>
                {Math.max(timeLeft, 0)}
            </span>
            <div id="timer-button-container">
                <button id="timer-button" onClick={() => changeTimerState()}>
                    <span unselectable='on' className='unselectable'>
                        {!isTimerActive ? "Activate" : "Deactivate"}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default TimerComponent;

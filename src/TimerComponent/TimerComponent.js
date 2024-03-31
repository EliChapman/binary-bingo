import React, { useState, useEffect } from 'react';
import './TimerComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';

const TimerComponent = () => {
    const { ToggleShowAnswer, timerDuration, isTimerActive, ToggleTimer, setDuration, triggerUpdate } = useLocalStorageContext();
    const [timeLeft, setTimeLeft] = useState(timerDuration);

    const changeTimerState = () => {
        const element = document.getElementById('timer-button')
    
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('clicked'); // start animation  
        
        ToggleTimer()
    }

    useEffect(() => {
        setTimeLeft(timerDuration); // Reset timer when duration changes
    }, [timerDuration]);

    useEffect(() => {
        if (!isTimerActive || timerDuration === -1) {
            return;
        }
        else if (timeLeft === 0) {
            ToggleShowAnswer(true);
            triggerUpdate(true); // Update history (show current number
            setDuration(-1);
            return;
        }
    
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

        return () => clearTimeout(timerId);
    }, [timeLeft, isTimerActive, ToggleShowAnswer, setDuration, timerDuration, triggerUpdate]);

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

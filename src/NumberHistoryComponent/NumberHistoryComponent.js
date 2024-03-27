import React, { useState, useEffect } from 'react';
import './NumberHistoryComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';

const NumberHistoryComponent = () => {
    const [history, setHistory] = useState([]);
    const { triggerUpdate, ResetNumbers } = useLocalStorageContext();
    const [sortIndex, setSortIndex] = useState(0);
    const sortTypes = ["Recent", "Value"];

    const changeSort = () => {
        const element = document.getElementById('sort-button')
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('clicked'); // start animation

        setSortIndex(value => value === 0 ? 1 : 0);
        triggerUpdate();
    }

    useEffect(() => {
        const fetchHistory = () => {
            const storedHistory = localStorage.getItem('used-numbers');
            let historyArray = storedHistory ? storedHistory.trim().split(" ").filter(num => num !== "") : [];
            if (sortIndex === 0) {
                historyArray.reverse();
            } else {
                historyArray.sort((a, b) => a - b);
            }
            setHistory(historyArray);
        };

        fetchHistory();
    }, [triggerUpdate]); // Re-fetch whenever triggerUpdate changes

    // Step 5: Render History
    return (
        <div id="number-history-container">
            <h2 id="number-history-header">Called Numbers</h2>
            <div id="number-history-sorting">
                <span id="sort-label">Sort by: </span>
                <button unselectable='on' className='unselectable' id="sort-button" onClick={() => changeSort()}> {sortTypes[sortIndex]} </button>
            </div>
            <ul id="number-history-list" >
                {history.map((num, index) => (
                    <li className="number-history-point" key={index}>{num}</li>
                ))}
            </ul>
            <div id="reset-button" className="reset-button" onClick={() => ResetNumbers()}>
                <span unselectable='on' className='unselectable'> Reset </span>
            </div>
        </div>
    );
}

export default NumberHistoryComponent;
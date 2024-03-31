import React, { useState, useEffect } from 'react';
import './NumberHistoryComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';
import { toBingo } from '../BingoComponent/BingoComponent';

const NumberHistoryComponent = () => {
    const [history, setHistory] = useState([]); // State variable tracking the history of called numbers
    const { updateTrigger, ResetNumbers, triggerUpdate } = useLocalStorageContext(); // Get a bunch of stuff from the context
    const [sortIndex, setSortIndex] = useState(0); // State variable tracking the type of sorting, represented by a number
    const sortTypes = ["Recent", "Value"]; // Array of sorting types

    // Change Sorting
    const changeSort = () => {
        const element = document.getElementById('sort-button')
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // ???
        element.classList.add('clicked'); // start animation

        setSortIndex(value => value === 0 ? 1 : 0); // Switch between 0 and 1 for the sorting types
        triggerUpdate(); // trigger an update to the history to reflect the new sorting
    }

    useEffect(() => {
        // Why is this in a function? It is called immeadiatley, and it isn't async so there's no point
        const fetchHistory = () => {
            const storedHistory = localStorage.getItem('used-numbers');
            // Split the stored history into an array, remove any empty strings
            let historyArray = storedHistory ? storedHistory.trim().split(" ").filter(num => num !== "") : [];
            
            // If the current number is not to be shown, remove it from the history
            if (!updateTrigger[0]) {
                historyArray.pop();
            }
            
            // Sort the history based on the sortIndex
            if (sortIndex === 0) {
                historyArray.reverse();
            } else {
                historyArray.sort((a, b) => a - b);
            }

            setHistory(historyArray);
        };

        fetchHistory(); // Call the unnessecarily functional function
    }, [updateTrigger, sortIndex]); // Re-fetch whenever updateTrigger changes

    // Render Called Numbers List
    return (
        <div id="number-history-container">
            <h2 id="number-history-header">Called Numbers</h2>
            <div id="number-history-sorting">
                <span id="sort-label">Sort by: </span>
                <button unselectable='on' className='unselectable' id="sort-button" onClick={() => changeSort()}> {sortTypes[sortIndex]} </button>
            </div>
            <ul id="number-history-list" >
                {history.map((num, index) => (
                    <li className="number-history-point" key={index}> <span>{toBingo(num).substring(0,1).concat((num < 10) ? "\u00A0" : "")}</span> {num}</li>
                ))}
            </ul>
            <div id="reset-button-container">
                <button id="reset-button" onClick={() => ResetNumbers()}>
                    <span unselectable='on' className='unselectable'> Reset </span>
                </button>
            </div>
        </div>
    );
}

export default NumberHistoryComponent;
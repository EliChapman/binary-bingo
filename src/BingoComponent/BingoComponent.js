import { useState, useEffect } from 'react';
import './BingoComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';

// Create a space in local storage to store used numbers if it doesn't exist
if (localStorage.getItem('used-numbers') == null) {
    localStorage.setItem('used-numbers', "");
    
}

// Function to convert a decimal number to a binary number
function dec2bin(dec) {
    var output =  (dec >>> 0).toString(2);
    while (output.length < 7) {
        output = "0" + output
    }
    return output
}

// Function to give a bingo letter to a number
const toBingo = (num) => {
    var bingo_letter = "";

    if (num <= 0) {
        bingo_letter = "?";
    } else if (num <= 15) {
        bingo_letter = "B";
    } else if (num <= 30) {
        bingo_letter = "I";
    } else if (num <= 45) {
        bingo_letter = "N";
    } else if (num <= 60) {
        bingo_letter = "G";
    } else if (num <= 75) {
        bingo_letter = "O";
    } else {
        bingo_letter = "?";
    }
    
    return(bingo_letter + " " + dec2bin(num))
}


// Function to come up with some value to measure the dificulty of a binary number for the timer
// Definitely requires refining and fine tuning
const generateDifficulty = (num) => {
    // These are the only factors to difficulty I could think of
    let difficulty = 1;
    let onesCount = 0;
    let consecutiveOnesCount = 0;
    let onesAreConsecutive = true;
    let middleOnes = 0;

    // Binary numbers are left to right, so reverse it
    num = num.split("").reverse().join("");

    // Count 1s and consecutive 1s
    for (let i = 0; i < num.length; i++) {
        if (num[i] === '1') {
            onesCount++;
            if (onesAreConsecutive && i > 0 && num[i - 1] === '1') {
                consecutiveOnesCount++;
            } else if (i > 0 && num[i - 1] !== '1') {
                onesAreConsecutive = false;
            }
        }
    }

    // Check for middle 1s that aren't consecutive
    if (consecutiveOnesCount <= 2) {
        for (let i of num.slice(2,5)) {
            if (i === '1') {
                middleOnes++;
            }
        }
    }

    // Increment difficulty by 0.05 for each middle 1 if they are not consecutive and not the only digit
    if (onesCount > 1 && consecutiveOnesCount <= 2) {
        difficulty += middleOnes * 0.05;
    }

    // Increment difficulty by 0.1 for each 1
    difficulty += onesCount * 0.1;

    // Decrement difficulty by 0.4 for each consecutive 1
    difficulty -= 0.15 * consecutiveOnesCount;
    
    // Get used numbers from local storage
    const usedNumbers = localStorage.getItem('used-numbers').split(" ");

    // Decrement difficulty by 0.003 for each used number
    difficulty -= usedNumbers.length * 0.01;

    return parseFloat(difficulty.toFixed(1)); // Round to 1 decimal place
}

const BingoComponent = (props) => {
    const [bingo_number, setNumber] = useState(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1))) // State variable for the current number, default is the last number from local storage
    localStorage.setItem('max', props.max); // Set the max number in local storage
    localStorage.setItem('min', props.min); // Set the min number in local storage
    const [answer_text, setAnswer] = useState(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)) // State variable for the answer, default is the last number from local storage
    const { triggerUpdate, resetTrigger, ResetNumbers, ToggleShowAnswer, showAnswer, isTimerActive, setDuration } = useLocalStorageContext(); // Get a bunch of stuff from the context

    useEffect(() => {
        if (resetTrigger >= 1) {
            // Clicked animation
            const element = document.getElementById('reset-button')
            element.classList.remove('clicked'); // reset the clicked animation if its already playing
            void element.offsetWidth; // I have no idea what this does
            element.classList.add('clicked'); // start clicked animation
        
            // Reset the used numbers in local storage
            localStorage.setItem('used-numbers', "")
            triggerUpdate(); // Rerender the history
            setNumber(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
            setAnswer("")
        }
    }, [resetTrigger]); // Re-run whenever resetTrigger changes
    
    // Function to toggle the answer, or set it to a provided value
    const ToggleAnswer = (show = null) => {
        if (show == null) {
            ToggleShowAnswer() 
            // Clicked animation
            const element = document.getElementById('show-answer')
    
            element.classList.remove('clicked'); // reset animation
            void element.offsetWidth; // Still no idea what this part does, I made it like a year ago
            element.classList.add('clicked'); // start animation
            triggerUpdate(true); // Update history (show current number)
        } else {
            if (showAnswer === show) {
                return; // Don't do anything if the answer is already in the desired state
            } else {
                ToggleShowAnswer(show) // Set the answer to the desired state
            }
        }
    }
    
    // Function to generate a number
    const GenerateNumber = async () => {
        var found_number = false;
        // Clicked animation
        const element = document.getElementById('main-button')
    
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // You know the drill
        element.classList.add('clicked'); // start animation

        let selected_number;
        
        // Recursivly search for a number that hasn't been used
        // Now that I look at this, this could've been optimized so much better
        while (!found_number) {
            // Generate a random number between the min and max
            var chosen_number = Math.floor(Math.random() * localStorage.getItem('max')) + parseInt(localStorage.getItem("min"));

            // Check if the number has been used, if not add it to used-numbers, select it, and break the loop
            if (!(localStorage.getItem('used-numbers').split(" ").includes(chosen_number.toString()))) {
                localStorage.setItem('used-numbers', localStorage.getItem('used-numbers') + chosen_number + " ");
                selected_number = toBingo(chosen_number)
                found_number = true;
            } 
            // If all numbers have been used, alert the user and reset the used numbers
            else if (localStorage.getItem('used-numbers').split(" ").length > localStorage.getItem("max")) {
                alert("Finished!");
                ResetNumbers();
                found_number = true;
            }
        }
    
        // Make the answer invisible, if it was previously visible
        ToggleAnswer(false)
    
        // Animate the number typing out
        const loadingDigits = [];
    
        for (let i = 2; i < 9; i++) {
            loadingDigits[i] = selected_number[i]
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation delay
            setNumber(selected_number.substring(0, 2) + loadingDigits.join('') + "_".repeat(8 - i)); // Update typing digits
        }
    
        // Set the number to the selected number and trigger an update
        setAnswer(chosen_number);
        triggerUpdate();
        if (isTimerActive) {
            setDuration(10 * generateDifficulty(dec2bin(chosen_number))); // Set the timer duration to 10 times the difficulty of the number, if the timer mode is active
        }
    }

    return(
        <div id="bingo-container">
            <div id="bingo-text" unselectable="on" className="unselectable">
                <span>{bingo_number[0]}</span>{bingo_number.substring(1)}
            </div>
            <div id="answer-container" unselectable="on" className="unselectable">
                <span id="answer" style={{ opacity: showAnswer ? 1 : 0 }}>{answer_text}</span>
            </div>
            <div id="main-button" className="bingo-button" onClick={() => GenerateNumber()}>
                <span unselectable="on" className="unselectable">Roll Number</span>
            </div>
            <br />
            <div 
                id="show-answer" 
                className='answer-button' 
                onClick={() => ToggleAnswer()}
                style={{ opacity: isTimerActive ? 0 : 1 }}
            >
                <span unselectable='on' className='unselectable'>Show Answer</span>
            </div>
        </div>
    );
}

export default BingoComponent;
export { toBingo };
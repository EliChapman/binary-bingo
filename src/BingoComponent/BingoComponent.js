import { useState, useEffect } from 'react';
import './BingoComponent.css';
import { useLocalStorageContext } from '../LocalStorageContext';

if (localStorage.getItem('used-numbers') == null) {
    localStorage.setItem('used-numbers', "");
    
}

function dec2bin(dec) {
    var output =  (dec >>> 0).toString(2);
    while (output.length < 7) {
        output = "0" + output
    }
    return output
}

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


// Function to come up with some value to measure the dificulty of a binary number
// Definitely requires refining and fine tuning
const generateDifficulty = (num) => {
    let difficulty = 1;
    let onesCount = 0;
    let consecutiveOnesCount = 0;
    let onesAreConsecutive = true;
    let middleOnes = 0;

    num = num.split("").reverse().join("");

    // Count 1s and check for consecutive 1s
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

    console.log(
        "Difficulty: " + parseFloat(difficulty.toFixed(1)) * 10  + '\n' +
        "Consecutive Ones: " + consecutiveOnesCount + '\n' +
        "Middle Ones: " + middleOnes + '\n' +
        "Total Ones: " + onesCount + '\n' +
        "Length: " + localStorage.getItem('used-numbers').split(" ").length)

    return parseFloat(difficulty.toFixed(1));
}

const BingoComponent = (props) => {
    const [bingo_number, setNumber] = useState(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
    localStorage.setItem('max', props.max);
    localStorage.setItem('min', props.min);
    const [answer_text, setAnswer] = useState(localStorage.getItem('used-numbers').split(" ").slice(-2, -1))
    const { triggerUpdate, resetTrigger } = useLocalStorageContext();
    const { ToggleShowAnswer, showAnswer, isTimerActive, setDuration } = useLocalStorageContext();

    useEffect(() => {
        if (resetTrigger >= 1) {
            // This function will be called after ResetNumbers is invoked elsewhere
            const element = document.getElementById('reset-button')
            element.classList.remove('clicked'); // reset animation
            void element.offsetWidth; // trigger reflow
            element.classList.add('clicked'); // start animation
        
            localStorage.setItem('used-numbers', "")
            triggerUpdate();
            setNumber(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
            setAnswer("")
        }
    }, [resetTrigger]); // Re-run whenever resetTrigger changes
    
    const ToggleAnswer = (show = null) => {
        if (show == null) {
            ToggleShowAnswer() 
            const element = document.getElementById('show-answer')
    
            element.classList.remove('clicked'); // reset animation
            void element.offsetWidth; // trigger reflow
            element.classList.add('clicked'); // start animation
            triggerUpdate(true);
        } else {
            if (showAnswer === show) {
                return;
            } else {
                ToggleShowAnswer(show)
            }
        }
    }
    
    const GenerateNumber = async () => {
        var found_number = false;
        const element = document.getElementById('main-button')
    
        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('clicked'); // start animation

        let selected_number
        
        while (!found_number) {
            var chosen_number = Math.floor(Math.random() * localStorage.getItem('max')) + parseInt(localStorage.getItem("min"));

            if (!(localStorage.getItem('used-numbers').split(" ").includes(chosen_number.toString()))) {
                localStorage.setItem('used-numbers', localStorage.getItem('used-numbers') + chosen_number + " ");
                selected_number = toBingo(chosen_number)
                found_number = true;
            } 
            else if (localStorage.getItem('used-numbers').split(" ").length > localStorage.getItem("max")) {
                alert("Finished!");
                localStorage.setItem('used-numbers', "")
                selected_number = toBingo(0)
                found_number = true;
            }
        }
    
        // Make answer invisible
        ToggleAnswer(false)
    
        const loadingDigits = [];
    
        // Simulate typing digits
        for (let i = 2; i < 9; i++) {
            loadingDigits[i] = selected_number[i]
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation delay
            setNumber(selected_number.substring(0, 2) + loadingDigits.join('') + "_".repeat(8 - i)); // Update typing digits
        }
    
        setAnswer(chosen_number);
        triggerUpdate();
        if (isTimerActive) {
            setDuration(10 * generateDifficulty(dec2bin(chosen_number)));
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
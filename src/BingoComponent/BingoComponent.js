import { useState } from 'react';
import './BingoComponent.css';

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

const ResetNumbers = (setNumber, setAnswer) => {
    const element = document.getElementById('reset-button')
    element.classList.remove('clicked'); // reset animation
    void element.offsetWidth; // trigger reflow
    element.classList.add('clicked'); // start animation

    localStorage.setItem('used-numbers', "")
    setNumber(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
    setAnswer("")
}

const ToggleAnswer = (ToggleShowAnswer, show_answer, show = null) => {
    if (show == null) {
        ToggleShowAnswer(!show_answer) 
        const element = document.getElementById('show-answer')

        element.classList.remove('clicked'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('clicked'); // start animation
    } else {
        ToggleShowAnswer(show)
    }
}

const GenerateNumber = async (setNumber, setAnswer, ToggleShowAnswer, show_answer) => {
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
    ToggleAnswer(ToggleShowAnswer, show_answer, false)

    const loadingDigits = [];

    // Simulate typing digits
    for (let i = 2; i < 9; i++) {
        loadingDigits[i] = selected_number[i]
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation delay
        setNumber(selected_number.substring(0, 2) + loadingDigits.join('') + "_".repeat(8 - i)); // Update typing digits
    }

    // Wait 0.1 seconds before setting the answer value
    setTimeout(() => {
        setAnswer(chosen_number);
    }, 150);
}

const BingoComponent = (props) => {
    const [bingo_number, setNumber] = useState(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
    localStorage.setItem('max', props.max);
    localStorage.setItem('min', props.min);
    const [answer_text, setAnswer] = useState(localStorage.getItem('used-numbers').split(" ").slice(-2, -1))
    const [show_answer, ToggleShowAnswer] = useState(false);
    

    return(
        <div className="bingo-container">
            <div id="bingo-text" unselectable="on" className="unselectable">
                <span>{bingo_number[0]}</span>{bingo_number.substring(1)}
            </div>
            <div id="answer-container" unselectable="on" className="unselectable">
                <span id="answer" style={{ opacity: show_answer ? 1 : 0 }}>{answer_text}</span>
            </div>
            <div id="main-button" className="bingo-button" onClick={() => GenerateNumber(setNumber, setAnswer, ToggleShowAnswer, show_answer)}>
                <span unselectable="on" className="unselectable">Roll Number</span>
            </div>
            <br />
            <div id="show-answer" className='answer-button' onClick={() => ToggleAnswer(ToggleShowAnswer, show_answer)}>
                <span unselectable='on' className='unselectable'>Show Answer</span>
            </div>
            <div id="reset-button" className="reset-button" onClick={() => ResetNumbers(setNumber, setAnswer)}>
                <span unselectable='on' className='unselectable'> Reset </span>
            </div>
        </div>
    );
}

export default BingoComponent;
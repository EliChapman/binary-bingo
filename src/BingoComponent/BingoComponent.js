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

const UpdateAnswer = (setAnswer, num) => {
    setAnswer(num)
}

const GenerateNumber = (setNumber, setAnswer) => {
    var found_number = false;
    const element = document.getElementById('main-button')

    element.classList.remove('clicked'); // reset animation
    void element.offsetWidth; // trigger reflow
    element.classList.add('clicked'); // start animation

    while (!found_number) {
        var chosen_number = Math.floor(Math.random() * localStorage.getItem('max')) + parseInt(localStorage.getItem("min"));

        if (!(localStorage.getItem('used-numbers').split(" ").includes(chosen_number.toString()))) {
            localStorage.setItem('used-numbers', localStorage.getItem('used-numbers') + chosen_number + " ");
            setNumber(toBingo(chosen_number))
            found_number = true;
        } 
        else if (localStorage.getItem('used-numbers').split(" ").length > localStorage.getItem("max")) {
            alert("Finished!");
            localStorage.setItem('used-numbers', "")
            setNumber(toBingo(0))
            found_number = true;
        }
    }
    setAnswer(" ")
    var timer = setTimeout(function() {
        UpdateAnswer(setAnswer, chosen_number)
    }, 1000)
}

const BingoComponent = (props) => {
    const [bingo_number, setNumber] = useState(toBingo(localStorage.getItem('used-numbers').split(" ").slice(-2, -1)))
    localStorage.setItem('max', props.max);
    localStorage.setItem('min', props.min);
    const [answer_text, setAnswer] = useState("")

    return(
        <div className="bingo-container">
            <div id="bingo-text" unselectable="on" className="unselectable">
                <span>{bingo_number[0]}</span>{bingo_number.substring(1)}
            </div>
            <div id="main-button" className="bingo-button" onClick={() => GenerateNumber(setNumber, setAnswer)}>
                <span unselectable="on" className="unselectable">Roll Number</span>
            </div>
            <div id="answer" unselectable="on" className="unselectable">
                {answer_text}
            </div>
        </div>
    );
}

export default BingoComponent;
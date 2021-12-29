/**
 * change the span elements color of the typingBox
 * change the scroll position of the typingBox
 */
let WPM = 0;
let currentWordIndex = 0;
let currentWord = "";
let correctWords = 0;
let incorrectWords = 0;
let totalWords = 0;
let inputedWord = "";
/**
 * function to change the classes of the span elements
 * @param word {string} the word user has entered and makes changes accordinng to the word
 *
 */
function changeCharactersColor(word = "") {
    let wordDiv = document.getElementById(`${currentWordIndex}`);
    //console.log(wordDiv);
    let spanChild = wordDiv.children;
    let correctWord = wordArray[currentWordIndex];
    //removing the extra span elements when the user presses backspace
    if (correctWord.length < spanChild.length) {
        for (let i = spanChild.length - 1; i >= correctWord.length; i--) {
            spanChild[i].remove();
            //console.log(spanChild[i]);
        }
    }
    //looping the elements of the word Div element
    for (let i = 0; i < correctWord.length; i++) {
        let currentSpan = (spanChild[i]);
        //checking the element
        //set class correct if its correct
        //set class incorrect if its incorrect
        if (word[i] === undefined) {
            currentSpan.setAttribute("class", "");
        }
        else if (word[i] === correctWord[i]) {
            currentSpan.setAttribute("class", "");
            currentSpan.setAttribute("class", "correct");
        }
        else {
            currentSpan.setAttribute("class", "");
            currentSpan.setAttribute("class", "incorrect");
        }
    }
    if (word.length > correctWord.length) {
        let len = word.length - correctWord.length;
        for (let i = 0; i < len; i++) {
            let index = correctWord.length + i;
            const spanElem = document.createElement("span");
            spanElem.setAttribute("class", "extra");
            spanElem.textContent = word[index];
            wordDiv.appendChild(spanElem);
        }
    }
    //change the cursor position 
    for (let i = 0; i < word.length; i++) {
        if (spanChild[i].classList.contains("right-active"))
            spanChild[i].classList.remove("right-active");
        if (spanChild[i].classList.contains("left-active"))
            spanChild[i].classList.remove("left-active");
    }
    if (word.length == 0)
        spanChild[0].classList.add("left-active");
    else if (word.length > 0)
        spanChild[word.length - 1].classList.add("right-active");
    //console.log(wordDiv.children);
}
/**
 * function to calculate the correct words and incorrect words and the accuracy of the typing
 *
*/
const accuracyElem = document.getElementById("accuracy");
const correctWordElem = document.getElementById("correct-entries");
const incorrectWordElem = document.getElementById("incorrect-entries");
const totalWordElem = document.getElementById("total-entries");
let accuracy = 0;
function updateInfo() {
    if (totalWords !== 0)
        accuracy = Math.floor((correctWords / totalWords) * 100);
    else
        accuracy = 0;
    //update the accuracy counter in the DOM
    accuracyElem.textContent = `${accuracy}%`;
    //update the correct words and incorrect words counter in the DOM
    correctWordElem.textContent = `${correctWords}`;
    incorrectWordElem.textContent = `${incorrectWords}`;
    totalWordElem.textContent = `${totalWords}`;
}
/**
 * function to jump th cursor from one word to another word
 */
function removeCursor() {
    let wordDiv = document.getElementById(`${currentWordIndex}`);
    //setting the cursor to the start of the another word
    wordDiv.children[wordDiv.children.length - 1].classList.remove("right-active");
}
/**
 * function to scroll the words in the typing box element
 */
function scrollText() {
    const wordCoords = document.getElementById(`${currentWordIndex}`).getBoundingClientRect();
    const typingBox = document.getElementById("typing-box");
    const typingBoxCoords = typingBox.getBoundingClientRect();
    let yCoords = Math.abs(wordCoords.y - typingBoxCoords.y);
    console.log(yCoords, wordCoords.height);
    if (yCoords > (typingBoxCoords.height / 2)) {
        typingBox.style.overflow = "scroll";
        typingBox.scrollBy({
            top: yCoords - wordCoords.height,
            left: 0,
            behavior: "smooth"
        });
        typingBox.style.overflow = "hidden";
    }
}
const barContainer = document.getElementById("bar-container"), bar = document.getElementById("bar"), wpmCounter = document.getElementById("wpmCounter");
function updateWpm(time = 0) {
    if (time != 0)
        WPM = Math.floor((correctWords / time) * currentTime);
    //change the status of the wpm counter
    wpmCounter.textContent = `${WPM}`;
    let WPMPercent = Math.min(Math.floor((WPM / 200) * 100), 100);
    bar.style.width = `${WPMPercent}%`;
    chart.addWpmData(WPM, time, incorrectWords);
}
//function to trim the white spaces from the value
function makeChangesInTheBox(e) {
    let value = e.target.value.trimStart();
    inputedWord = value;
    //change the span classes 
    changeCharactersColor(value);
}
function increamentValues(e) {
    //check if the key is space button
    if (e.key === " ") {
        currentWord = wordArray[currentWordIndex];
        if (inputedWord.length >= currentWord.length) {
            //removing the cursor from the last word
            removeCursor();
            currentWordIndex = (currentWordIndex < wordArray.length ? currentWordIndex + 1 : currentWordIndex);
            if (inputedWord === currentWord)
                correctWords++;
            else
                incorrectWords++;
            //making the value of the input element to empty string
            e.target.value = "";
            //increase the total words count by 1
            totalWords++;
            //scroll the element is needed 
            scrollText();
            //update the info 
            updateInfo();
        }
    }
}
const inputElem = document.getElementById("typing_input");
/**
 * fucntion for starting the challenge
 * intialize the event listener on the input element
 */
function startGame() {
    /**adding event Listener to the input element */
    inputElem.addEventListener("input", makeChangesInTheBox, false);
    //adding the ketdown event listener to listen for the event when user presses the space button
    inputElem.addEventListener("keydown", increamentValues, false);
}
//function to End the game 
//removes the event Listener attached to the input element
function endGame() {
    //reseting the variables
    totalWords = 0;
    correctWords = 0;
    incorrectWords = 0;
    accuracy = 0;
    WPM = 0;
    currentWordIndex = 0;
    inputElem.value = "";
    //removing the event listeners form the typing Box
    inputElem.removeEventListener("input", makeChangesInTheBox, false);
    inputElem.removeEventListener("keydown", increamentValues, false);
}

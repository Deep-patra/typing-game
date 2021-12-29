const typingBox = document.getElementById("typing-box");
const playButton = document.getElementById("play_button");
const playerIdElem = document.getElementById("playerId");
const timeUpBanner = document.querySelector(".timeUpWrapper");
const popupWrapper = document.getElementById("popUpWrapper");
let clock = new Clock("countDown");
//console.log(new TypingBox().words);
//function to create a 8-digit random player Id when the page loads
function loadPlayerId() {
    let id = Math.floor(Math.random() * 10000000);
    return id;
}
function getPlayerId() {
    if (localStorage.getItem("typingPlayerId") !== null) {
        //console.log(localStorage.getItem("typingPlayerId"));
        return Number(localStorage.getItem("typingPlayerId"));
    }
    else {
        let id = loadPlayerId();
        localStorage.setItem("typingPlayerId", id.toString());
        return id;
    }
    return 0;
}
function getPlayerName() {
    if (localStorage.getItem("typingPlayerName") !== "undefined") {
        return localStorage.getItem("typingPlayerName");
    }
    return "";
}
const playerId = getPlayerId();
playerIdElem.textContent = playerId.toString();
document.getElementById("playerName").textContent = getPlayerName();
//available time periods for the game
var TimePeriods;
(function (TimePeriods) {
    TimePeriods[TimePeriods["One"] = 60000] = "One";
    TimePeriods[TimePeriods["two"] = 120000] = "two";
    TimePeriods[TimePeriods["three"] = 180000] = "three";
})(TimePeriods || (TimePeriods = {}));
//enum for the status of the game 
var Status;
(function (Status) {
    Status["start"] = "START";
    Status["reset"] = "RESET";
})(Status || (Status = {}));
let runningStatus = Status.start;
//console.log(runningStatus);
let currentTime = TimePeriods.One;
let chart = new TypingChart();
//Initialize the typing paragraph for the test
function InitializeText() {
    const len = wordArray.length;
    for (let i = 0; i < len; i++) {
        //creating a div element to hold the letters
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", `${i}`);
        for (let j = 0; j < wordArray[i].length; j++) {
            const letter = document.createElement("span");
            //setting attributes of the custom elements
            letter.setAttribute("class", "");
            letter.textContent += `${wordArray[i][j]}`;
            //appending the element in the wrapper element
            wrapper.appendChild(letter);
        }
        //appending the wrapper in the typing box element
        typingBox.appendChild(wrapper);
    }
}
InitializeText();
//function to reset the typingBox
function resetTypingbox() {
    let words = typingBox.children;
    for (let i = words.length - 1; i >= 0; i--) {
        words[i].remove();
    }
    //re-initializing the typing box
    InitializeText();
}
//function to the icon and text of the play button
function changeButton() {
    const icon = playButton.firstElementChild;
    const span = playButton.lastElementChild;
    if (runningStatus === Status.reset) {
        playButton.style.color = "#e84118";
        icon.setAttribute("class", "fas fa-stop");
        span.textContent = Status.reset;
    }
    else {
        playButton.style.color = "#9c88ff";
        icon.setAttribute("class", "fas fa-play");
        span.textContent = Status.start;
    }
}
//function to call when the timer is finished 
function finish() {
    endGame();
    //stop the animation in the canvas element by calling the stop render 
    chart.stopRender();
    //adding the hidden class to the timeup banner
    timeUpBanner.classList.remove("hidden");
}
function start_Game(e) {
    //change the running status of the game
    runningStatus = (runningStatus === Status.start) ? Status.reset : Status.start;
    //calling the changeButton to change the visual status of the button
    changeButton();
    //start the clock if clock is running
    //restart the clock if the running status is start
    if (runningStatus !== Status.start) {
        clock.startClock(finish, updateWpm);
        //start the Game and attach the eventlistener
        startGame();
        //start the chart rendering
        chart.startRender();
    }
    else {
        //ending the game
        endGame();
        //reseting the info box
        updateInfo();
        //reseting the typingBox
        resetTypingbox();
        //reseting the clock
        clock.resetClock();
        //update the Wpm progress bar 
        updateWpm();
        //reset the graph
        chart.resetCanvas();
        //scroll the typing box to the top 
        typingBox.style.overflow = "scroll";
        typingBox.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
        typingBox.style.overflow = "hidden";
        //checking if the timeup banner contain the hidden class
        if (!timeUpBanner.classList.contains("hidden"))
            timeUpBanner.classList.add("hidden");
    }
}
//adding the Event listener on the Play button
playButton.addEventListener("click", start_Game, false);
const typingInput = document.getElementById("typing_input");
const outOfFocusBox = document.querySelector(".outOfFocus");
const typingBoxContainer = document.querySelector(".typing-box-container");
window.addEventListener("click", (e) => {
    const path = e.composedPath();
    if (path.includes(typingBoxContainer) || path.includes(playButton)) {
        typingInput.focus();
        if (!outOfFocusBox.classList.contains("hidden"))
            outOfFocusBox.classList.add("hidden");
    }
    else {
        if (outOfFocusBox.classList.contains("hidden"))
            outOfFocusBox.classList.remove("hidden");
    }
}, false);
const chartWrapper = document.querySelector(".chart");
//creating a resize observer to observe the canvas element wrapper
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        if (entry.contentBoxSize && entry.target === chartWrapper) {
            chart.updateDimensions();
        }
    }
});
//telling  the observer to observe the chartWrapper element
resizeObserver.observe(chartWrapper);
var activeButton;
(function (activeButton) {
    activeButton["chart"] = "charts";
    activeButton["setting"] = "settigs";
})(activeButton || (activeButton = {}));
;
//set the active status of the button
let activeStatus = activeButton.chart;
const chartsButton = document.getElementById("chartsButton"), settingsButton = document.getElementById("settingsButton");
//function to toggle between the chart and the settings
function changeButtonStyle(e) {
    if (this == chartsButton) {
        activeStatus = activeButton.chart;
        if (settingsButton.classList.contains("active"))
            settingsButton.classList.remove("active");
        if (!chartsButton.classList.contains("active"))
            chartsButton.classList.add("active");
        if (!document.querySelector(".settings").classList.contains('hidden'))
            document.querySelector(".settings").classList.add("hidden");
        if (document.querySelector(".chartWrapper").classList.contains("hidden"))
            document.querySelector(".chartWrapper").classList.remove("hidden");
    }
    else {
        activeStatus = activeButton.setting;
        if (chartsButton.classList.contains("active"))
            chartsButton.classList.remove("active");
        if (!settingsButton.classList.contains("active"))
            settingsButton.classList.add("active");
        if (!document.querySelector(".chartWrapper").classList.contains('hidden'))
            document.querySelector(".chartWrapper").classList.add("hidden");
        if (document.querySelector(".settings").classList.contains("hidden"))
            document.querySelector(".settings").classList.remove("hidden");
    }
}
chartsButton.addEventListener("click", changeButtonStyle.bind(chartsButton), false);
settingsButton.addEventListener("click", changeButtonStyle.bind(settingsButton), false);
let playerInput = document.getElementById("setPlayerName");
playerInput.value = getPlayerName();
//change the player Name when the input element is focused
playerInput.addEventListener("focus", (e) => {
    this.focus();
    e.target.setSelectionRange(0, e.target.value.length);
}, false);
//set the player name when the input element is blured
playerInput.addEventListener("blur", function (e) {
    //if the value is empty,set the previous value to the input element
    if (this.value === "") {
        this.value = getPlayerName();
        return;
    }
    localStorage.setItem("typingPlayerName", this.value);
    document.getElementById("playerName").textContent = this.value;
}.bind(playerInput), false);
/***
 * change the playing time of the typing
 *
 */
function changeTimeButtonStyle(e) {
    let target = e.target;
    let child = document.querySelector(".buttonsWrapper").children;
    for (let i = 0; i < child.length; i++) {
        if (child[i].classList.contains("active"))
            child[i].classList.remove("active");
    }
    e.target.classList.add("active");
    //change the current Time
    if (target === document.getElementById('1minButton'))
        currentTime = TimePeriods.One;
    else if (target === document.getElementById('2minButton'))
        currentTime = TimePeriods.two;
    else
        currentTime = TimePeriods.three;
    //set the time in the clock
    clock.setTime(currentTime);
}
//attaching event listener to all three time buttons
document.getElementById("1minButton").addEventListener("click", changeTimeButtonStyle, false);
document.getElementById("2minButton").addEventListener("click", changeTimeButtonStyle, false);
document.getElementById("3minButton").addEventListener("click", changeTimeButtonStyle, false);

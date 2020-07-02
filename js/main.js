/**
 * @author: Khuat Duy Quang
 * Date create: Jul 1st 2020
 * Version: 1.0
 */

/**
 * variables
 */
let testContent = document.querySelector(".test-to-show").innerHTML;
const input = document.getElementById("inputText");
const myTime = document.getElementById("myTime");
const btnReset = document.getElementById("btnReset");
const btnNext = document.getElementById("btnContinue");
const word = document.getElementById("word");
const character = document.getElementById("character");
const count = document.getElementById("count");
const average = document.getElementById("average");

var isRunning = false;
var timer = [0, 0, 0, 0]; // min,sec,hundred of sec,thousand of sec (milisecsond)
var runningClock; //for set and clear Interval

/**
 * function
 */

// add pre- 0 to time
function addPreZoro(time) {
  return time <= 9 ? "0" + time : time;
}

//function runClock
function runClock() {
  let currentTime = `
    ${addPreZoro(timer[0])}:${addPreZoro(timer[1])}:${addPreZoro(timer[2])}
  `;
  myTime.innerHTML = currentTime;
  timer[3]++;

  timer[0] = Math.floor(timer[3] / 100 / 60); // min ==  floor(sec/60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}
// function start clock when keypress, only run when first key is pressed
function startClock() {
  let textEnteredLength = input.value.length;
  if (textEnteredLength === 0 && !isRunning) {
    isRunning = true;
    runningClock = setInterval(runClock, 10);
  }
}

// function start clock when keypress
function reset() {
  // clear UI
  input.value = "";
  input.style.borderColor = "#808080";
  myTime.innerHTML = "00:00:00";
  btnNext.setAttribute("disabled", true);

  count.innerHTML = `0 times`;
  word.innerHTML = `0 word`;
  character.innerHTML = `0 character`;
  average.innerHTML = `0 word/min`;

  // clear background variables
  playCount = 0;
  wordOfTest = 0;
  charOfTest = 0;

  clearInterval(runningClock);
  runningClock = null;
  timer = [0, 0, 0, 0];
  isRunning = false;
}

//checkAccuracy every time keyup when keyup
function checkAccuracy() {
  let textEntered = input.value;

  let testContentMatch = testContent.substring(0, textEntered.length);
  if (textEntered.length === 0) {
    //erase all text will make border normal grey
    input.style.borderColor = "#808080";
  }
  //when full length completed is match => color green and stop the clock, show result, lock user click btnNext
  else if (textEntered == testContent) {
    input.style.borderColor = "#1e7e34";
    btnNext.removeAttribute("disabled");
    clearInterval(runningClock);

    showResult();
  }
  //check while typing, if match color:blue, not match color:orange
  else {
    if (textEntered == testContentMatch) {
      //blue
      input.style.borderColor = "#65ccf3";
    } else {
      //orange
      input.style.borderColor = "#e95d0f";
    }
  }
}

/**
 * addEventListener
 */

input.addEventListener("keypress", startClock);
input.addEventListener("keyup", checkAccuracy);
btnReset.addEventListener("click", reset);
btnNext.addEventListener("click", playMore);

/**
 * COUNT WORD
 */

function wordCount(val) {
  var wom = val.match(/\S+/g);
  return {
    charactersNoSpaces: val.replace(/\s+/g, "").length,
    characters: val.length,
    words: wom ? wom.length : 0,
    lines: val.split(/\r*\n/).length,
  };
}

//show result when correct
var wordOfTest = 0;
var charOfTest = 0;
function showResult() {
  let { words, characters } = wordCount(testContent);

  wordOfTest += words;
  charOfTest += characters;

  word.innerHTML = `${wordOfTest} words`;
  character.innerHTML = `${charOfTest} characters`;
  count.innerHTML = `${playCount} times`;

  document.querySelectorAll(".red").forEach((item) => {
    // switch color every click
    item.style.color = item.style.color == "red" ? "orangered" : "red";
  });

  let { charPerSec, wordPerMin } = calculateAverage(charOfTest, wordOfTest);
  //min=0, then show char/s
  if (timer[0] < 1) {
    average.innerHTML = `${charPerSec} char/sec.`;
  } else {
    average.innerHTML = `${wordPerMin} word/min.`;
  }
}

/**
 * Change test to text
 */

let testArr = [
  "Be simple enough to feel the true joy of life.",
  "In this complex modern world, it is impossible to be simple.",
  "The secret of staying young is to be simple and happy like a child",
  "Be simple to fill life with abundance.",
  "Change the world by being yourself.",
  "Aspire to inspire before we expire.",
  "Yes, I am very handsome.",
];

function getRandomIndex(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return randomIndex;
}

var playCount = 1;
function playMore() {
  ////* UI reset
  input.value = "";
  input.style.borderColor = "#808080";
  btnNext.setAttribute("disabled", true);

  // move cursor focus on input
  input.focus();
  //show new text
  document.querySelector(".test-to-show").innerHTML =
    testArr[getRandomIndex(testArr)];

  // reasign the text to compare
  testContent = document.querySelector(".test-to-show").innerHTML;

  ////* background variable change to keep the clock
  isRunning = false;
  // add number of times user play
  playCount++;
  timer = [timer[0], timer[1], timer[2], timer[3]];
}

function calculateAverage(char, word) {
  return {
    charPerSec: (char / (parseInt(timer[3]) * 0.01)).toFixed(2), //char/s
    wordPerMin: (word / ((parseInt(timer[3]) * 0.01) / 60)).toFixed(2), //word/min
  };
}

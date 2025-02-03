/**
 * @fileoverview This file contains the JavaScript code for a memory matching game.
 * It handles game logic, UI updates, and player management.
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} quantity - The number of players in the game.
 * @property {string} size - The size of the game grid (e.g., "4x4", "6x6").
 * @property {string} visualization - The type of visualization (e.g., "Icons", "Numbers").
 */

/**
 * @type {GameConfig}
 */
let obj = { quantity: 1, size: "4x4", visualization: "Numbers" };
let turn = 1;
let players = {};
let moves = document.querySelector('#moves');
let movessum = 0;

/**
 * Creates and manages the game grid.
 *
 * @param {number} numPairs - The number of pairs of items to include in the grid.
 *
 @param {number} totalItems - The total number of items to generate.
 */
function makeGame(numPairs, totalItems) {
  let arr = [];

  // Generate pairs of items and assign them to random positions in the array
  for (let i = 1; i <= numPairs; i++) {
    let random;
    do {
      random = Math.floor(Math.random() * totalItems);
    } while (arr[random]);
    arr[random] = i;

    do {
      random = Math.floor(Math.random() * totalItems);
    } while (arr[random]);
    arr[random] = i;

  }

  /**
   * @type {Object<number, string>}
   */
  let icons = {
    8: "/icons/anchor.png",
    1: "/icons/car.png",
    2: "/icons/futbol.png",
    3: "/icons/hand-spock.png",
    4: "/icons/lira-sign.png",
    5: "/icons/moon.png",
    6: "/icons/snowflake.png",
    7: "/icons/White.png",
  };
  console.log(arr);

  let list = arr.filter((num) => Boolean(num));
  console.log(arr, list);
  let rectangle = document.querySelector(".rectangle");
  rectangle.innerHTML = "";
  let buttons = [];
  list.forEach(function (num) {
    let button = document.createElement("button");
    buttons.push(button);
    button.className = "circle hidden";
    rectangle.append(button);

    button.onclick = function () {
      let alreadyClicked = rectangle.querySelector(".active");
      movessum++;
      moves.innerHTML = movessum;
      console.log(buttons);
      if (alreadyClicked) {
        buttons.forEach((button) => button.setAttribute("disabled", true));
        setTimeout(() => {
          buttons.forEach((button) => button.removeAttribute("disabled"));
          let score = players[turn].querySelector('.score');
          if (obj.visualization === "Icons") {
            if (
              alreadyClicked.querySelector("img").getAttribute("src") ===
              icons[num]
            ) {
              // Match found
              alreadyClicked.classList.remove("active", "hidden");
              alreadyClicked.classList.add("visible");
              button.classList.remove("active", "hidden");
              button.classList.add("visible");
              score.innerText = +score.innerText + 1;
            } else {
              // No match
              alreadyClicked.classList.remove("active", "visible");
              alreadyClicked.classList.add("hidden");
              button.classList.remove("active", "visible");
              button.classList.add("hidden");
              button.innerHTML = "";
              alreadyClicked.innerHTML = "";
              turn = (turn % Object.keys(players).length) + 1; // Cycle through players
              for (let player in players) {
                players[player].classList.remove("turn");
              }
              players[turn].classList.add("turn");
            }
          } else {
            if (+alreadyClicked.innerText === num) {
              // Match found
              alreadyClicked.classList.remove("active", "hidden");
              alreadyClicked
.classList.add("visible");
              button.classList.remove("active", "hidden");
              button.classList.add("visible");
              score.innerText = +score.innerText + 1;
            } else {
              // No match
              alreadyClicked.classList.remove("active", "visible");
              alreadyClicked.classList.add("hidden");
              button.classList.remove("active", "visible");
              button.classList.add("hidden");
              button.innerText = "";
              alreadyClicked.innerText = "";
               turn = (turn % Object.keys(players).length) + 1; // Cycle through players
              for (let player in players) {
                players[player].classList.remove("turn");
              }
              players[turn].classList.add("turn");
            }
          }
        }, 1000);
      }

      button.classList.remove("hidden");
      button.classList.add("active");

      if (obj.visualization == "Icons") {
        button.innerHTML = `<img src="${icons[num]}"/>`;
      } else {
        button.innerText = num;
      }
    };
  });
}

let startbutton = document.querySelector(".startbutton");
startbutton.onclick = generateGame;

let interval = null;

/**
 * Initializes a new game, setting up the grid and player info.
 */
function generateGame() {
  let container = document.querySelector(".container");
  container.classList.add("d-none");
  let startgame = document.querySelector(".game");
  startgame.classList.remove("d-none");
  let gridsize = document.querySelector(".rectangle");

  if (obj.size == "4x4") {
    gridsize.classList.add("rect4x4");
    makeGame(8, 16);
  } else {
    gridsize.classList.add("rect6x6");
    makeGame(18, 36);
  }
  let numberplayers = document.querySelector(".numberplayers");
  numberplayers.innerHTML = '';
  for (let i = 1; i < +obj.quantity + 1; i++) {
    let button = document.createElement("button");
    players[i
] = button;
    button.classList.add("player");
    if (i == turn) {
      button.classList.add("turn");
    }

    let playernumber = document.createElement("div");
    playernumber.classList.add("playernumber");
    playernumber.innerText = `Player ${i}`;

    let score = document.createElement("div");
    score.classList.add("score");
    score.innerText = 0;

    button.append(playernumber, score);
    numberplayers.append(button);
  }
  let timer = document.querySelector('#time');
  clearInterval(interval);
  timer.innerText = '0:00';
  interval = setInterval(() => {
    let [minutes, seconds] = timer.innerText.split(':');
    timer.innerText = parser(minutes * 60 + +seconds + 1);
  }, 1000);
}

let newgame = document.querySelector('#newgame');
newgame.onclick = function () {
  let container = document.querySelector(".container");
  container.classList.remove("d-none");
  let startgame = document.querySelector(".game");
  startgame.classList.add("d-none");
}

let restartgame = document.querySelector("#restart");
restartgame.onclick = generateGame;

// Handles the selection of game settings.
let buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.onclick = function () {
    let row = button.closest(".row");
    let option = row.dataset.option;
    console.log(option);
    let value = button.innerHTML;
    obj[option] = value;
    console.log(obj);
    let neighbors = row.querySelectorAll(".btn");
    neighbors.forEach((button) => {
      button.classList.remove("active");
    });
    button.classList.add("active");
  };
});

/**
 * Converts seconds into a mm:ss format.
 *
 * @param {number} seconds - The total seconds.
 * @returns {string} The formatted time string.
 */
function parser(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secondsLeft = seconds - minutes * 60;
  return `${minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
}

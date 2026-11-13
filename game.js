"use strict";

const columns = 28;
const rows = 18;
const cellSize = 8;
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const keyboard = new Map([
  ["ArrowUp", "up"], ["2", "up"], ["w", "up"],
  ["ArrowDown", "down"], ["8", "down"], ["s", "down"],
  ["ArrowLeft", "left"], ["4", "left"], ["a", "left"],
  ["ArrowRight", "right"], ["6", "right"], ["d", "right"],
]);
const delays = [0, 180, 130, 90, 62];
const storageKey = "nokia-3310-snake.best";

const canvas = document.querySelector("#board");
const context = canvas.getContext("2d");
const maze = document.querySelector("#maze");
const speed = document.querySelector("#speed");
const action = document.querySelector("#action");
const message = document.querySelector("#message");
const messageTitle = document.querySelector("#message-title");
const messageDetail = document.querySelector("#message-detail");
const scoreDisplay = document.querySelector("#score");
const bestDisplay = document.querySelector("#best");

let snake;
let food;
let walls;
let direction;
let nextDirection;
let score;
let timer;
let state = "ready";
let best = 0;
try {
  const storedBest = Number(localStorage.getItem(storageKey));
  if (Number.isSafeInteger(storedBest) && storedBest >= 0) best = storedBest;
} catch {
  // Keep the best score in memory when storage is unavailable.
}

function cellId({ x, y }) {
  return y * columns + x;
}

function makeWalls() {
  const result = new Set();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const edge = x === 0 || x === columns - 1 || y === 0 || y === rows - 1;
      const obstacle = (x === 9 || x === 18) && y >= 5 && y <= 12 && y !== 8 && y !== 9;
      if ((maze.value !== "classic" && edge) || (maze.value === "cross" && obstacle)) {
        result.add(cellId({ x, y }));
      }
    }
  }
  return result;
}

function placeFood() {
  const occupied = new Set(snake.map(cellId));
  const open = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const cell = { x, y };
      const id = cellId(cell);
      if (!walls.has(id) && !occupied.has(id)) open.push(cell);
    }
  }
  return open[Math.floor(Math.random() * open.length)];
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const id of walls) {
    const x = (id % columns) * cellSize;
    const y = Math.floor(id / columns) * cellSize;
    context.fillStyle = "#607643";
    context.fillRect(x, y, 8, 8);
    context.clearRect(x + 3, y + 3, 2, 2);
  }
  context.fillStyle = "#293d1a";
  for (const { x, y } of snake) {
    context.fillRect(x * cellSize, y * cellSize, 8, 8);
  }
  const head = snake[0];
  context.clearRect(
    head.x * cellSize + 3 + direction.x * 2,
    head.y * cellSize + 3 + direction.y * 2,
    2, 2,
  );
  if (food) {
    const x = food.x * cellSize;
    const y = food.y * cellSize;
    context.fillRect(x + 2, y + 1, 4, 6);
    context.fillRect(x + 1, y + 2, 6, 4);
    context.clearRect(x + 3, y + 3, 2, 2);
  }
  scoreDisplay.textContent = String(score).padStart(3, "0");
  bestDisplay.textContent = String(best).padStart(3, "0");
}

function setState(nextState, title = "", detail = "") {
  clearInterval(timer);
  state = nextState;
  message.hidden = state === "playing";
  messageTitle.textContent = title;
  messageDetail.textContent = detail;
  action.textContent = {
    ready: "Start", playing: "Pause", paused: "Resume", ended: "Play again",
  }[state];
  maze.disabled = speed.disabled = state === "playing" || state === "paused";
  if (state === "playing") timer = setInterval(tick, delays[Number(speed.value)]);
}

function reset() {
  snake = [{ x: 7, y: 9 }, { x: 6, y: 9 }, { x: 5, y: 9 }];
  direction = directions.right;
  nextDirection = null;
  walls = makeWalls();
  score = 0;
  food = { x: 13, y: 9 };
  draw();
}

function tick() {
  if (nextDirection) direction = nextDirection;
  nextDirection = null;
  const head = {
    x: (snake[0].x + direction.x + columns) % columns,
    y: (snake[0].y + direction.y + rows) % rows,
  };
  const id = cellId(head);
  const eating = id === cellId(food);
  const body = eating ? snake : snake.slice(0, -1);
  if (walls.has(id) || body.some(cell => cellId(cell) === id)) {
    setState("ended", "GAME OVER", "SCORE " + score);
    return;
  }
  snake.unshift(head);
  if (eating) {
    score += 10;
    if (score > best) {
      best = score;
      try {
        localStorage.setItem(storageKey, String(best));
      } catch {
        // The game can continue without persistent storage.
      }
    }
    food = placeFood();
    if (!food) setState("ended", "YOU WIN", "SCORE " + score);
  } else {
    snake.pop();
  }
  draw();
}

function toggle() {
  if (state === "playing") {
    setState("paused", "PAUSED", "PRESS RESUME");
    return;
  }
  if (state !== "paused") reset();
  setState("playing");
}

function steer(name) {
  const turn = directions[name];
  if (state !== "playing" || nextDirection) return;
  if (turn === direction || turn.x + direction.x === 0 && turn.y + direction.y === 0) return;
  nextDirection = turn;
}

action.addEventListener("click", toggle);
for (const key of document.querySelectorAll("[data-direction]")) {
  key.addEventListener("click", () => steer(key.dataset.direction));
}
maze.addEventListener("change", () => {
  reset();
  setState("ready", "SNAKE II", "PRESS START");
});
document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLSelectElement) return;
  const name = keyboard.get(event.key.toLowerCase()) || keyboard.get(event.key);
  if (name) {
    event.preventDefault();
    if (!event.repeat) steer(name);
  } else if (event.code === "Space") {
    event.preventDefault();
    if (!event.repeat) toggle();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state === "playing") toggle();
});

reset();

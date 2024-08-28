const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let obstacle = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameInterval;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const difficultySelect = document.getElementById('difficultySelect');

function initGame() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    generateFood();
    generateObstacle();
    dx = 1;
    dy = 0;
    score = 0;
    updateScore();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some(segment => segment.x === food.x && segment.y === food.y) ||
           (obstacle.x === food.x && obstacle.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

function generateObstacle() {
    obstacle = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
           (food.x === obstacle.x && food.y === obstacle.y)) {
        obstacle = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

function drawGame() {
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.arc(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            // Snake body
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        }
    });

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw obstacle
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        generateFood();
        if (score % 5 === 0) {
            generateObstacle();
        }
    } else {
        snake.pop();
    }
}

function updateScore() {
    scoreElement.textContent = `分数: ${score}`;
}

function isGameOver() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
        (head.x === obstacle.x && head.y === obstacle.y)
    );
}

function gameLoop() {
    moveSnake();
    if (isGameOver()) {
        clearInterval(gameInterval);
        alert('游戏结束！你的得分是: ' + score);
        startButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        return;
    }
    drawGame();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function startGame() {
    clearInterval(gameInterval);
    initGame();
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            gameSpeed = 150;
            break;
        case 'medium':
            gameSpeed = 100;
            break;
        case 'hard':
            gameSpeed = 50;
            break;
    }
    gameInterval = setInterval(gameLoop, gameSpeed);
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

initGame();
drawGame();
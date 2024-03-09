const canvas = document.getElementById("snake-board")
const ctx = canvas.getContext("2d");
const score = document.getElementById("current-score");
const highest = document.getElementById("highest-score")

const gridSize = 40;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = localStorage.getItem("highScore") ? localStorage.getItem("highScore") : 0;
highest.innerHTML = "Highest Score: " + highScore
let direction = "right"
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function draw() {
    canvas.innerHTML = "";
    clearCanvas();
    drawSnake();
    drawFood();
    //updateScore();
}

function clearCanvas() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 600, 600 )
}

function drawSnake() {
    snake.forEach((segment) => {
        ctx.fillStyle = "green"
        ctx.fillRect(segment.x * 15, segment.y * 15, 15, 15)
    })
}

function drawFood() {
    if (gameStarted) {
        //ctx.fillStyle = "red";
        //ctx.fillRect(food.x * 15, food.y * 15, 15, 15)
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(food.x * 15 + 7.5, food.y * 15 + 7.5, 7.5, 0, Math.PI * 2, true)
        ctx.fillStyle = 'red'; // Change color here
        ctx.fill();
        ctx.stroke();
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return { x, y };
}

function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score.innerHTML = "Score: " + snake.length
        if (highScore < snake.length) {
            highScore = snake.length
            localStorage.setItem("highScore", highScore)
            highest.innerHTML = "Highest Score: " + highScore
        }
        food = generateFood()
        increaseSpeed()
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            move()
            checkCollision();
            draw()
        }, gameSpeedDelay)
    } else {
        snake.pop()
    }
}

function startGame() {
    gameStarted = true;
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === "Space") || 
        (!gameStarted && event.key === " ") 
    ) {
        startGame()
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction === "down") {
                    break;
                }
                direction = 'up'
                break;
            case 'ArrowDown':
                if (direction === "up") {
                    break;
                }
                direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction === "right") {
                    break;
                }
                direction = 'left'
                break;
            case 'ArrowRight':
                if (direction === "left") {
                    break;
                }
                direction = 'right'
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress)

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
}

function resetGame() {
    stopGame();
    snake = [{ x:10, y:10 }]
    food = generateFood()
    direction = "left"
    gameSpeedDelay = 200
    updateScore()
}


function stopGame() {
    //alert("Game Over")
    drawGameOver()
    score.innerHTML = "Score: 1"
    clearInterval(gameInterval)
    gameStarted = false
}

function drawGameOver() {
    ctx.font = '50px Segoe UI';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

}
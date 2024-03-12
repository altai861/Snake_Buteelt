const canvas = document.getElementById("snake-board")
const ctx = canvas.getContext("2d");
const score = document.getElementById("current-score");
const highest = document.getElementById("highest-score")
const hanaNevtreh = document.getElementById("hanaNevtreh")

const gridSize = 40;
let snake = [{ x: 10, y: 10 }];
let food = generateFood(snake); // food[2] is food genre; regular friut = 0; slower buff friut = 1; extra point friut = 2;
let highScore = localStorage.getItem("highScore") ? localStorage.getItem("highScore") : 0;
highest.innerHTML = "Авсан хамгийн өндөр оноо: " + highScore
let direction = "right"
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let scoreGame = 1;
let start = true;
let speedSlowerDuration;
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
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.arc(food.x * 15 + 7.5, food.y * 15 + 7.5, 7.5, 0, Math.PI * 2, true)
        if(food.genre === 0) ctx.fillStyle = 'red';
        else if (food.genre === 1) ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'purple';
        ctx.fill();
        ctx.stroke();
    }
}

function inSnake(x, y, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true
        }
    }
    return false;
}

function generateFood(snake) {
    const genreChance = Math.floor(Math.random() * 100);
    let genre = 0;
    if (genreChance < 70) {
        genre = 0;
    } else if (genreChance < 85) {
        genre = 1;
    } else {
        genre = 2;
    }
    // console.log("Generated Food Genre:", genre);
    let x, y
    while (true) {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);

        if (inSnake(x, y, snake)) {
            continue
        } else {
            break
        }
    }
    return { x, y, genre };
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
        switch(food.genre){
            case 0:
                scoreGame += 1;
                break;
            case 1:
                scoreGame += 1;
                slowSpeed();
                break;
            case 2:
                scoreGame += 2;
                break;
            default:
                scoreGame += 1
                break;
        }
        score.innerHTML = "Оноо: " + scoreGame
        if (highScore < scoreGame) {
            highScore = scoreGame
            localStorage.setItem("highScore", highScore)
            highest.innerHTML = "Авсан хамгийн өндөр оноо: " + highScore
        }
        food = generateFood(snake)
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
    scoreGame = 0;
    gameStarted = true;
    start = false;
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
        startGame();
    } else if (start) {
        drawStartWindow();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== "down") {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== "up") {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (direction !== "right") {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== "left") {
                    direction = 'right';
                }
                break;
        }
    }
}
drawStartWindow();

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

function slowSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay += 15
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay += 9
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay += 6
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay += 3
    }
}
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        if (hanaNevtreh.checked === true) {
            hanaNevter()
        } else {
            resetGame();
        }
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
}

function hanaNevter() {
    let head = snake[0]

    if (head.x === -1 && (head.y >= 0 || head.y < gridSize)) {
        snake[0] = { x: gridSize - 1, y: head.y }
    } else if (head.y === -1 && (head.x >= 0 || head.x < gridSize)) {
        snake[0] = { x: head.x, y: gridSize - 1 }
    } else if (head.x === gridSize && (head.y >= 0 || head.y < gridSize)) {
        snake[0] = { x: 0, y: head.y }
    } else if (head.y === gridSize && (head.x >=0 || head.x < gridSize)) {
        snake[0] = { x: head.x, y: 0 }
    }
}

function resetGame() {
    stopGame();
    snake = [{ x:10, y:10 }]
    food = generateFood(snake)
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
    let snake_background = [[14, 27], [14, 26], [14, 25], [14, 24], [14, 23], [15, 23], [16, 23], [17, 23], [18, 23], [19, 23], [20, 23], [21, 23], [21, 24], [21, 25], [21, 26],[21,26],[21,27],[21,28],[21,29],[22,29],[23,29],[24,29],[25,29],[26,29],[27,29],[27,28],[27,27],[27,26],[28,26],[29,26]];
    snake_background.forEach((segment) => {
        ctx.fillStyle = "green"
        ctx.fillRect(segment[0] * 15, segment[1] * 15, 15, 15)
    })
    ctx.fillStyle = "red"
    ctx.fillRect(14 * 15, 29 * 15, 15, 15)

    ctx.font = '50px Segoe UI';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Тоглоом дууслаа', canvas.width / 2, canvas.height / 24 * 6 + 50 );
    ctx.font = '25px Segoe UI';
<<<<<<< Updated upstream
    ctx.fillText('Space товчийг дарж дахин тоглоно уу', canvas.width / 2, canvas.height / 8 * 3 + 20 );

=======
    ctx.fillText('Space товчийг дарж тоглоомыг эхлүүлнэ үү', canvas.width / 2, canvas.height / 8 * 4 );
    
>>>>>>> Stashed changes
}

function drawStartWindow() {
    let snake_background = [[14, 27], [14, 26], [14, 25], [14, 24], [14, 23], [15, 23], [16, 23], [17, 23], [18, 23], [19, 23], [20, 23], [21, 23], [21, 24], [21, 25], [21, 26],[21,26],[21,27],[21,28],[21,29],[22,29],[23,29],[24,29],[25,29],[26,29],[27,29],[27,28],[27,27],[27,26],[28,26],[29,26]];
    snake_background.forEach((segment) => {
        ctx.fillStyle = "green"
        ctx.fillRect(segment[0] * 15, segment[1] * 15, 15, 15)
    })
    ctx.fillStyle = "red"
    ctx.fillRect(14 * 15, 29 * 15, 15, 15)

    ctx.font = '50px Segoe UI';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Могой тоглоомд', canvas.width / 2, canvas.height / 24 * 6 );
    ctx.fillText('тавтай морил', canvas.width / 2, canvas.height / 24 * 6 + 50 );
    ctx.font = '25px Segoe UI';
    ctx.fillText('Space товчийг дарж тоглоомыг эхлүүлнэ үү', canvas.width / 2, canvas.height / 8 * 3 + 20 );

}
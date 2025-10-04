// Récupération du canvas et du contexte
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Variables du jeu
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 5;
let dy = 5;

// Raquettes
const paddleHeight = 80;
const paddleWidth = 10;
let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let computerPaddleY = canvas.height / 2 - paddleHeight / 2;

// Scores
let playerScore = 0;
let computerScore = 0;

// Contrôles
let upPressed = false;
let downPressed = false;

// Écouteurs d'événements pour les touches
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "z" || e.key === "Z") upPressed = true;
    if (e.key === "s" || e.key === "S") downPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "z" || e.key === "Z") upPressed = false;
    if (e.key === "s" || e.key === "S") downPressed = false;
}

// Dessin de la balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Dessin des raquettes
function drawPaddles() {
    // Raquette du joueur
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);

    // Raquette de l'ordinateur
    ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);
}

// Mise à jour des scores
function updateScore() {
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;
}

// Logique de l'ordinateur
function computerAI() {
    const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
    if (computerPaddleCenter < y - 10) {
        computerPaddleY += 4;
    } else if (computerPaddleCenter > y + 10) {
        computerPaddleY -= 4;
    }
}

// Détection des collisions
function collisionDetection() {
    // Collision avec les bords haut et bas
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    // Collision avec la raquette du joueur
    if (x + dx < paddleWidth && y > playerPaddleY && y < playerPaddleY + paddleHeight) {
        dx = -dx;
    }

    // Collision avec la raquette de l'ordinateur
    if (x + dx > canvas.width - paddleWidth - ballRadius &&
        y > computerPaddleY && y < computerPaddleY + paddleHeight) {
        dx = -dx;
    }

    // Point pour l'ordinateur
    if (x + dx < 0) {
        computerScore++;
        resetBall();
    }

    // Point pour le joueur
    if (x + dx > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Réinitialisation de la balle
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = -dx;
    dy = Math.random() * 6 - 3;
}

// Mise à jour de la position de la balle
function updateBall() {
    x += dx;
    y += dy;
}

// Mise à jour de la position de la raquette du joueur
function updatePlayerPaddle() {
    if (upPressed && playerPaddleY > 0) {
        playerPaddleY -= 7;
    }
    if (downPressed && playerPaddleY < canvas.height - paddleHeight) {
        playerPaddleY += 7;
    }
}

// Boucle principale du jeu
function draw() {
    // Nettoyage du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessin des éléments
    drawBall();
    drawPaddles();

    // Mise à jour de la logique
    collisionDetection();
    computerAI();
    updateBall();
    updatePlayerPaddle();
    updateScore();

    // Appel récursif pour l'animation
    requestAnimationFrame(draw);
}

// Lancement du jeu
draw();


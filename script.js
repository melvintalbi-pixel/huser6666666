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

// Contrôle de la raquette avec la souris/tactile
canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("touchmove", movePaddle);

function movePaddle(e) {
    const rect = canvas.getBoundingClientRect();
    const yPos = (e.clientY || e.touches[0].clientY) - rect.top - paddleHeight / 2;
    playerPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, yPos));
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
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight); // Raquette du joueur
    ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight); // Raquette de l'ordinateur
}

// Mise à jour des scores
function updateScore() {
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;
}

// Logique de l'ordinateur
function computerAI() {
    const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
    if (computerPaddleCenter < y - 10) computerPaddleY += 4;
    else if (computerPaddleCenter > y + 10) computerPaddleY -= 4;
}

// Détection des collisions
function collisionDetection() {
    // Collision avec les bords haut et bas
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) dy = -dy;

    // Collision avec la raquette du joueur
    if (x + dx < paddleWidth && y > playerPaddleY && y < playerPaddleY + paddleHeight) dx = -dx;

    // Collision avec la raquette de l'ordinateur
    if (x + dx > canvas.width - paddleWidth - ballRadius && y > computerPaddleY && y < computerPaddleY + paddleHeight) dx = -dx;

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

// Boucle principale du jeu
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    collisionDetection();
    computerAI();
    updateBall();
    updateScore();
    requestAnimationFrame(draw);
}

// Lancement du jeu
draw();

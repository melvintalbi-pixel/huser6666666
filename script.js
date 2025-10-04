// Récupération des éléments
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const levelSelect = document.getElementById("levelSelect");
const weakPopup = document.getElementById("weakPopup");
const fragilePopup = document.getElementById("fragilePopup");
const winPopup = document.getElementById("winPopup");
const losePopup = document.getElementById("losePopup");
const gameContainer = document.getElementById("gameContainer");
const passwordInput = document.getElementById("passwordInput");

// Variables du jeu
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 7; // Vitesse équilibrée
let dy = 7;
const ballColor = "#e74c3c";

// Raquettes
const paddleHeight = 120;
const paddleWidth = 15;
let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let computerPaddleY = canvas.height / 2 - paddleHeight / 2;

// Scores
let playerScore = 0;
let computerScore = 0;
const maxScore = 3;
let gameActive = false;
let pointCooldown = false;

// Affichage des pop-ups
function showWeakPopup() {
    levelSelect.style.display = "none";
    weakPopup.style.display = "block";
}

function showFragilePopup() {
    levelSelect.style.display = "none";
    fragilePopup.style.display = "block";
}

function closePopup() {
    weakPopup.style.display = "none";
    fragilePopup.style.display = "none";
    gameContainer.style.display = "block";
    startGame();
}

// Contrôle de la raquette avec la souris/tactile
canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("touchmove", movePaddle);

function movePaddle(e) {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const yPos = (e.clientY || e.touches[0].clientY) - rect.top - paddleHeight / 2;
    playerPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, yPos));
}

// Dessin de la balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

// Dessin des raquettes
function drawPaddles() {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);
}

// Mise à jour des scores
function updateScore() {
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;
}

// Logique de l'ordinateur (nul mais pas trop)
function computerAI() {
    if (!gameActive) return;

    // Le bot a 50% de chances de rater la balle
    if (Math.random() < 0.5) {
        // Il bouge aléatoirement
        computerPaddleY += (Math.random() - 0.5) * 10;
    } else {
        // Sinon il suit la balle avec une latence raisonnable
        const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
        if (computerPaddleCenter < y - 20) {
            computerPaddleY += 4;
        } else if (computerPaddleCenter > y + 20) {
            computerPaddleY -= 4;
        }
    }
    computerPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, computerPaddleY));
}

// Détection des collisions et gestion des points
function checkPoint() {
    if (pointCooldown) return;

    // Collision avec les bords haut et bas
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    // Collision avec la raquette du joueur
    if (x + dx < paddleWidth && y > playerPaddleY && y < playerPaddleY + paddleHeight) {
        dx = -dx;
        // Légère variation aléatoire pour éviter les trajectoires prévisibles
        dy += (Math.random() - 0.5) * 2;
    }

    // Collision avec la raquette de l'ordinateur
    if (x + dx > canvas.width - paddleWidth - ballRadius && y > computerPaddleY && y < computerPaddleY + paddleHeight) {
        dx = -dx;
        // Légère variation aléatoire
        dy += (Math.random() - 0.5) * 2;
    }

    // Point pour l'ordinateur
    if (x + dx < 0) {
        pointCooldown = true;
        computerScore++;
        updateScore();
        if (computerScore >= maxScore) {
            setTimeout(() => endGame(false), 500);
        } else {
            setTimeout(() => {
                resetBall();
                pointCooldown = false;
            }, 500);
        }
    }

    // Point pour le joueur
    if (x + dx > canvas.width) {
        pointCooldown = true;
        playerScore++;
        updateScore();
        if (playerScore >= maxScore) {
            setTimeout(() => endGame(true), 500);
        } else {
            setTimeout(() => {
                resetBall();
                pointCooldown = false;
            }, 500);
        }
    }
}

// Réinitialisation de la balle
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    // Direction aléatoire mais vitesse constante
    dx = Math.random() > 0.5 ? 7 : -7;
    dy = (Math.random() * 5) - 2.5;
}

// Fin du jeu
function endGame(playerWon) {
    gameActive = false;
    gameContainer.style.display = "none";
    if (playerWon) {
        winPopup.style.display = "block";
    } else {
        losePopup.style.display = "block";
    }
}

// Vérification du mot de passe
function checkPassword() {
    if (passwordInput.value === "TEST") {
        window.location.href = "pfc.html";
    } else {
        alert("Mot de passe incorrect !");
    }
}

// Redémarrer le jeu
function restartGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    winPopup.style.display = "none";
    losePopup.style.display = "none";
    levelSelect.style.display = "block";
    passwordInput.value = "";
}

// Boucle principale du jeu
function draw() {
    if (!gameActive) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    computerAI();
    updateBall();
    checkPoint();
    requestAnimationFrame(draw);
}

// Mise à jour de la position de la balle
function updateBall() {
    x += dx;
    y += dy;
}

// Lancement du jeu
function startGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    gameActive = true;
    pointCooldown = false;
    resetBall();
    draw();
}

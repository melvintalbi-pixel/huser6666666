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
let dx = 5;
let dy = 5;
const ballColor = "#e74c3c";

// Raquettes
const paddleHeight = 80;
const paddleWidth = 10;
let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let computerPaddleY = canvas.height / 2 - paddleHeight / 2;

// Scores
let playerScore = 0;
let computerScore = 0;
const maxScore = 3; // Premier à 3 points gagne
let gameActive = false; // Pour contrôler l'état du jeu

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

// Logique de l'ordinateur (niveau difficile)
function computerAI() {
    if (!gameActive) return;
    const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
    if (computerPaddleCenter < y - 10) {
        computerPaddleY += 5;
    } else if (computerPaddleCenter > y + 10) {
        computerPaddleY -= 5;
    }
    computerPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, computerPaddleY));
}

// Détection des collisions
function collisionDetection() {
    if (!gameActive) return;

    // Collision avec les bords haut et bas
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    // Collision avec la raquette du joueur
    if (x + dx < paddleWidth && y > playerPaddleY && y < playerPaddleY + paddleHeight) {
        dx = -dx;
        const hitPosition = (y - playerPaddleY) / paddleHeight;
        dy = -1 * (8 - (hitPosition * 12));
    }

    // Collision avec la raquette de l'ordinateur
    if (x + dx > canvas.width - paddleWidth - ballRadius && y > computerPaddleY && y < computerPaddleY + paddleHeight) {
        dx = -dx;
        const hitPosition = (y - computerPaddleY) / paddleHeight;
        dy = -1 * (8 - (hitPosition * 12));
    }
}

// Gestion des points
function checkPoint() {
    if (x + dx < 0) {
        computerScore++;
        updateScore();
        if (computerScore >= maxScore) {
            endGame(false); // Défaite
        } else {
            resetBall();
        }
    } else if (x + dx > canvas.width) {
        playerScore++;
        updateScore();
        if (playerScore >= maxScore) {
            endGame(true); // Victoire
        } else {
            resetBall();
        }
    }
}

// Réinitialisation de la balle
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = -dx * (1 + (Math.random() * 0.3 - 0.15));
    dy = Math.random() * 6 - 3;
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
        alert("Mot de passe correct !");
        restartGame();
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
    resetBall();
    draw();
}

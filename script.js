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
let dx = 12; // Vitesse constante et rapide
let dy = 12;
const ballColor = "#e74c3c";

// Raquettes (larges)
const paddleHeight = 150;
const paddleWidth = 20;
let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let computerPaddleY = canvas.height / 2 - paddleHeight / 2;

// Scores
let playerScore = 0;
let computerScore = 0;
const maxScore = 3;
let gameActive = false;

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

// Logique de l'ordinateur très nulle
function computerAI() {
    if (!gameActive) return;

    // Le bot est très mauvais et ne suit pas bien la balle
    if (Math.random() < 0.7) { // 70% de chances de ne pas suivre la balle
        // Il bouge aléatoirement
        computerPaddleY += (Math.random() - 0.5) * 10;
    } else {
        // Parfois il essaie de suivre la balle, mais mal
        const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
        if (computerPaddleCenter < y - 50) { // Grande latence
            computerPaddleY += 3;
        } else if (computerPaddleCenter > y + 50) {
            computerPaddleY -= 3;
        }
    }
    computerPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, computerPaddleY));
}

// Détection des collisions et gestion des points
function checkPoint() {
    // Collision avec les bords haut et bas
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    // Collision avec la raquette du joueur
    if (x + dx < paddleWidth && y > playerPaddleY && y < playerPaddleY + paddleHeight) {
        dx = -dx;
    }

    // Collision avec la raquette de l'ordinateur
    if (x + dx > canvas.width - paddleWidth - ballRadius && y > computerPaddleY && y < computerPaddleY + paddleHeight) {
        dx = -dx;
    }

    // Point pour l'ordinateur
    if (x + dx < 0) {
        computerScore++;
        updateScore();
        if (computerScore >= maxScore) {
            endGame(false);
        } else {
            resetBall();
        }
    }

    // Point pour le joueur
    if (x + dx > canvas.width) {
        playerScore++;
        updateScore();
        if (playerScore >= maxScore) {
            endGame(true);
        } else {
            resetBall();
        }
    }
}

// Réinitialisation de la balle
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    // Direction aléatoire mais toujours rapide
    dx = Math.random() > 0.5 ? 12 : -12;
    dy = (Math.random() * 8) - 4;
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
    resetBall();
    draw();
}

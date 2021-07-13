new WOW().init();

/* Set game levels */
let levelOptions = ["easy", "medium", "hard"];

/* Get URL of window */
let windowUrl = new URL(window.location);

/* Get level paramater */
let selectedLevel = windowUrl.searchParams.get("level");

/* check if level parameter exist and if is valid, else go back to select level page */
if (selectedLevel == null || levelOptions.indexOf(selectedLevel.toLowerCase()) < 0) {
    window.location.href = "level.html";
}

/* Set peek time - 5 seconds */
let peekTime = 5000;

/* Set game time limit - 30 seconds */
let timeLimit = 30000;

/* Set starting score */
let score = 0;

let firstCardSelected = null;
let secondCardSelected = null;

/* This function returns the number of cards based on selected level */
function getNumberOfCards(level) {
    if (level.toLowerCase() == "easy") {
        return 8;
    } else if (level.toLowerCase() == "medium") {
        return 12;
    } else if (level.toLowerCase() == "hard") {
        return 16;
    } else {
        return 0;
    }
}

/* This function capitalizes first letter of a string input */
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

/* This function returns number of occurences in a given array */
function getNumOfOccurences(needle, haystack) {
    let count = 0;
    for (let i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle) {
            count++;
        }
    }
    return count;
}

/* This function randomly generates cards to be used in the game*/
function getCardCollection(level) {
    let numOfCards = getNumberOfCards(level);
    let cardTypeOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

    /* Select Random Card Types to be used */
    let numOfCardType = numOfCards / 2;
    let gameCardTypes = [];
    let y = 0;
    while (gameCardTypes.length != numOfCardType && y < 100) {
        let temp = Math.random();
        let randPos = Math.floor(temp * cardTypeOptions.length);

        if (gameCardTypes.indexOf(cardTypeOptions[randPos]) < 0) {
            gameCardTypes.push(cardTypeOptions[randPos]);
        } else {
            cardTypeOptions.splice(randPos, 1);
        }
        y++;
    }

    /* Generate game cards to be used based on randomly selected card types */
    let x = 0;
    let gameCards = [];
    while (gameCards.length != numOfCards && x < 100) {
        let cardTypePos = Math.floor(Math.random() * gameCardTypes.length);
        if (getNumOfOccurences(gameCardTypes[cardTypePos], gameCards) < 2) {
            gameCards.push(gameCardTypes[cardTypePos]);
        } else {
            gameCardTypes.splice(cardTypePos, 1);
        }
        x++;
    }
    return gameCards;
}

/* This function shows content of all card */
function showAllCards() {
    let gameCard = document.querySelectorAll(".gameCard");
    for (let i = 0; i < gameCard.length; i++) {
        //gameCard[i].textContent = gameCard[i].getAttribute("data-card"
        let imgCard = document.createElement("img");
        imgCard.setAttribute("src", "assets/images/" + gameCard[i].getAttribute("data-card") + ".png");
        imgCard.classList.add("img-responsive");
        gameCard[i].appendChild(imgCard);
    }
}

/* This function hides content of all cards */
function hideAllCards() {
    let gameCard = document.querySelectorAll(".gameCard");
    for (let i = 0; i < gameCard.length; i++) {
        gameCard[i].textContent = "";
        gameCard[i].classList.remove("opened");
    }
}

/* This function shows content of selected card */
function showCard(gameCard) {
    let imgCard = document.createElement("img");
    imgCard.setAttribute("src", "assets/images/" + gameCard.getAttribute("data-card") + ".png");
    imgCard.classList.add("img-responsive");
    gameCard.appendChild(imgCard);
}

/* This function enables card click */
function enableCardClick() {
    let gameCard = document.querySelectorAll(".gameCard");
    for (let i = 0; i < gameCard.length; i++) {
        gameCard[i].classList.add("clickEnabled");
    }
}

/* This function disables card click */
function disableCardClick() {
    let gameCard = document.querySelectorAll(".gameCard");
    for (let i = 0; i < gameCard.length; i++) {
        gameCard[i].classList.remove("clickEnabled");
    }
}

/* This function removes card selection if selected pair of cards does not matched */
function removeCardSelection() {
    let gameCard = document.querySelectorAll(".cardSelected");
    for (let i = 0; i < gameCard.length; i++) {
        gameCard[i].classList.remove("cardSelected");

        if (gameCard[i].classList.contains("opened") == false) {
            gameCard[i].textContent = "";
        }
    }
    firstCardSelected = null;
    secondCardSelected = null;
}

/* This function tags pair of cards that matched */
function openSelectedCards() {
    let gameCard = document.querySelectorAll(".cardSelected");
    for (let i = 0; i < gameCard.length; i++) {
        gameCard[i].classList.add("opened");
    }
}

/* This function checks if all pair of cards are matched */
function checkIfAllCardsAreOpened() {
    let openedCards = document.querySelectorAll(".opened");
    let gameCards = document.querySelectorAll(".gameCard");
    if (openedCards.length < gameCards.length) {
        return false;
    } else {
        return true;
    }
}

/* This function prints all cards that are randomly generated */
function printCards(cardCollection, targetDiv) {
    let t = 0.1;
    targetDiv.innerHTML = "";
    for (let i = 0; i < cardCollection.length; i++) {
        let col = document.createElement("div");

        col.setAttribute("class", `col-3`);

        targetDiv.appendChild(col);
        let card = document.createElement("div");
        card.setAttribute("class", `gameCard wow bounceIn`);
        card.setAttribute("data-wow-delay", `${t}s`);
        card.setAttribute("data-card", cardCollection[i]);
        t += 0.1;
        col.appendChild(card);

        card.addEventListener("click", function () {
            if (this.classList.contains("opened") == false && this.classList.contains("clickEnabled") == true) {
                let cardValue = this.getAttribute("data-card");
                if (firstCardSelected == null) {
                    firstCardSelected = cardValue;
                    this.classList.remove("clickEnabled");
                    this.classList.add("cardSelected");
                    showCard(this);
                } else if (firstCardSelected != null && secondCardSelected == null) {
                    secondCardSelected = cardValue;
                    showCard(this);
                    this.classList.remove("clickEnabled");
                    this.classList.add("cardSelected");
                    if (firstCardSelected == secondCardSelected) {
                        openSelectedCards();
                        increaseScore();
                        let checkRemCards = checkIfAllCardsAreOpened();
                        if (checkRemCards == true) {
                            stopGameTimer();
                            let remTime = 30 - timeLimitInSeconds;
                            let now = new Date();
                            now = now.toLocaleString();
                            showMessage("Well Done!<br>You've opened all the cards.", "<br>Time: " + remTime + " seconds");
                            let currentPlayerName = localStorage.getItem("playerName");
                            updateLeaderboard(selectedLevel, [currentPlayerName, remTime, now]);
                        } else {
                            removeCardSelection();
                            enableCardClick();
                        }
                    } else {
                        setTimeout(function () {
                            removeCardSelection();
                            enableCardClick();
                        }, 500);
                    }
                }
            }
        });
    }
}

/* This function show system message when game is over */
function showMessage(message1 = "", message2 = "", message3 = "") {
    gameMessage1.innerHTML = message1;
    gameMessage2.innerHTML = message2;
    gameMessage3.innerHTML = message3;
    gameModal.show();
}

/* This function starts the peek timer */
function startCountdown() {
    gameStartTime = setInterval(function () {
        peekTimeInSeconds--;
        countdownContainerText.textContent = peekTimeInSeconds;
        if (peekTimeInSeconds <= 0) clearInterval(gameStartTime);
    }, 1000);
}

/* This function starts the game timer */
function startGameTimer() {
    gameTime = setInterval(function () {
        timeLimitInSeconds--;
        timeContainerText.textContent = timeLimitInSeconds;
        if (timeLimitInSeconds <= 0) {
            clearInterval(gameTime);
            disableCardClick();
            showMessage("Oops!<br>You ran out of time.", "<br>Score: " + score);
        }
    }, 1000);
}

/* This function stops the game timer */
function stopGameTimer() {
    clearInterval(gameTime);
}

/* This function increments current score by 1 */
function increaseScore() {
    score++;
    scoreContainer.textContent = score;
}

/* This function resets the game score to 0 */
function resetScore() {
    score = 0;
    scoreContainer.textContent = score;
}
/*This functions resets the game */
function resetGame() {
    resetButton.classList.add("hidden");
    countdownContainer.classList.add("hidden");
    startButton.classList.remove("hidden");
    timeContainer.classList.add("hidden");
    stopGameTimer();
    resetScore();
    hideAllCards();
    disableCardClick();
    removeCardSelection();
    peekTimeInSeconds = peekTime / 1000;
    timeLimitInSeconds = timeLimit / 1000;
    countdownContainerText.textContent = peekTimeInSeconds;
    timeContainerText.textContent = timeLimitInSeconds;
    let cardCollection = getCardCollection(selectedLevel);
    printCards(cardCollection, cardContainer);
    firstCardSelected = null;
    secondCardSelected = null;
}

let levelContainerText = document.querySelector("#infoContainerLevel > span");
let timeContainer = document.querySelector("#infoContainerTime");
let timeContainerText = document.querySelector("#infoContainerTime > span");
let scoreContainer = document.querySelector("#infoContainerScore > span");
let countdownContainer = document.querySelector("#infoContainerStartCountDown");
let countdownContainerText = document.querySelector("#infoContainerStartCountDown > span");
let startButton = document.querySelector("#startButton");
let resetButton = document.querySelector("#resetButton");
let cardContainer = document.querySelector("#cardContainer");

let gameModal = new bootstrap.Modal(document.getElementById("gameMessageModal"));
let gameMessage1 = document.querySelector("#gameMessageModal-message1");
let gameMessage2 = document.querySelector("#gameMessageModal-message2");
let gameMessage3 = document.querySelector("#gameMessageModal-message3");
let newGameButton = document.querySelector("#newGameButton");

let peekTimeInSeconds = peekTime / 1000;
let timeLimitInSeconds = timeLimit / 1000;

levelContainerText.textContent = capitalize(selectedLevel);
scoreContainer.textContent = score;

let cardCollection = getCardCollection(selectedLevel);
printCards(cardCollection, cardContainer);

/* Game Buttons */
startButton.addEventListener("click", function () {
    this.classList.add("hidden");
    countdownContainerText.textContent = peekTimeInSeconds;
    countdownContainer.classList.remove("hidden");
    showAllCards();
    startCountdown();
    setTimeout(function () {
        hideAllCards();
        enableCardClick();
        countdownContainer.classList.add("hidden");
        resetButton.classList.remove("hidden");
        timeContainer.classList.remove("hidden");
        timeContainerText.textContent = timeLimitInSeconds;
        startGameTimer();
    }, peekTime);
});

resetButton.addEventListener("click", function () {
    resetGame();
});

newGameButton.addEventListener("click", function () {
    gameModal.hide();
    document.getElementById("gameMessageModal").addEventListener("hidden.bs.modal", function (event) {
        resetGame();
        document.getElementById("gameMessageModal").removeEventListener("hidden.bs.modal", function () {});
    });
});

let renamePlayerModal = document.getElementById("renamePlayerModal");
let renameModal = new bootstrap.Modal(renamePlayerModal);
let playerNameInput = document.getElementById("renamePlayerModal-nameField");
let savePlayerNameButton = document.getElementById("renamePlayerModal-saveButton");
let playerNameText = document.querySelector(".playerNameTextContainer>span");
let assignedPlayerName = localStorage.getItem("playerName");
if (assignedPlayerName == null) {
    localStorage.setItem("playerName", "Player 1");
    assignedPlayerName = "Player 1";
    playerNameText.textContent = assignedPlayerName;
}

/* Gets current player name */
playerNameText.textContent = assignedPlayerName;
renamePlayerModal.addEventListener("shown.bs.modal", function (event) {
    assignedPlayerName = localStorage.getItem("playerName");
    playerNameInput.value = assignedPlayerName;
    playerNameInput.select();
});

/* Removes validation when key is pressed */
playerNameInput.addEventListener("keypress", function () {
    this.closest("div").classList.remove("was-validated");
});

/* Saves new player name */
savePlayerNameButton.addEventListener("click", function () {
    let playerName = playerNameInput.value;
    if (playerName.trim() == "") {
        playerNameInput.closest("div").classList.add("was-validated");
        playerNameInput.focus();
    } else {
        playerNameInput.closest("div").classList.remove("was-validated");
        localStorage.setItem("playerName", playerName);
        playerNameText.textContent = playerName;
        renameModal.hide();
    }
});

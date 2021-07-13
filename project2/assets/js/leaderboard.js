let easyContainer = document.getElementById("pills-levelRanking");
let mediumContainer = document.getElementById("pills-mediumRanking");
let hardContainer = document.getElementById("pills-hardRanking");

/* This function populates leaderboard modal based on provided level */
function populateLeaderboard(levelLeaderboard) {
    let targetElement;
    if (levelLeaderboard.toLowerCase() == "easy") {
        targetElement = document.getElementById("pills-easyRanking");
    } else if (levelLeaderboard.toLowerCase() == "medium") {
        targetElement = document.getElementById("pills-mediumRanking");
    } else if (levelLeaderboard.toLowerCase() == "hard") {
        targetElement = document.getElementById("pills-hardRanking");
    }
    targetElement.innerHTML = "";
    let levelRanking = localStorage.getItem(levelLeaderboard.toLowerCase());
    if (levelRanking != null) {
        let levelRankingArray = JSON.parse(levelRanking);
        for (let i = 0; i < levelRankingArray.length; i++) {
            let tblRow = document.createElement("tr");
            targetElement.appendChild(tblRow);
            let tblCol = document.createElement("td");
            tblCol.textContent = i + 1;
            tblRow.appendChild(tblCol);
            for (let x = 0; x < levelRankingArray[i].length; x++) {
                let tblCol = document.createElement("td");
                if (x == 1) {
                    tblCol.textContent = levelRankingArray[i][x] + " seconds";
                } else {
                    tblCol.textContent = levelRankingArray[i][x];
                }
                tblRow.appendChild(tblCol);
            }
        }
    } else {
        let tblRow = document.createElement("tr");
        targetElement.appendChild(tblRow);
        let tblCol = document.createElement("td");
        tblCol.textContent = "No Records Found";
        tblCol.setAttribute("colspan", "4");
        tblCol.setAttribute("class", "text-center");
        tblRow.appendChild(tblCol);
    }
}

/* This function sorts array */
function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return a[1] < b[1] ? -1 : 1;
    }
}

/* This function checks/updates the leaderboard after player has succesfully opened all cards in a game */
function updateLeaderboard(levelLeaderboard, playerNameTimeArray) {
    let levelRanking = localStorage.getItem(levelLeaderboard.toLowerCase());
    if (levelRanking != null) {
        let levelRankingArray = JSON.parse(levelRanking);
        if (levelRankingArray.length < 3) {
            levelRankingArray.push(playerNameTimeArray);
            levelRankingArray = levelRankingArray.sort(sortFunction);
            localStorage.setItem(levelLeaderboard.toLowerCase(), JSON.stringify(levelRankingArray));
        } else {
            levelRankingArray.push(playerNameTimeArray);
            levelRankingArray = levelRankingArray.sort(sortFunction);
            let temp = levelRankingArray.pop();
            localStorage.setItem(levelLeaderboard.toLowerCase(), JSON.stringify(levelRankingArray));
        }
    } else {
        let tempArray = [];
        tempArray.push(playerNameTimeArray);
        localStorage.setItem(levelLeaderboard.toLowerCase(), JSON.stringify(tempArray));
    }
    populateLeaderboard(levelLeaderboard);
}

/* Populate leaderboard modal */
populateLeaderboard("easy");
populateLeaderboard("medium");
populateLeaderboard("hard");

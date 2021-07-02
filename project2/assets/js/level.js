new WOW().init();

/* Set game levels */
let levelOptions = ["Easy", "Medium", "Hard"];

/* Get DOM elements */
let mainContainer = document.getElementById("mainContainer");
let buttonContainer = document.getElementById("buttonContainer");

let secDelay = 0.2;
/* Create level buttons */
for (let i = 0; i < levelOptions.length; i++) {
    let button = document.createElement("a");
    button.setAttribute("class", "gameButton wow fadeInUp");
    button.setAttribute("data-wow-delay", secDelay + "s");
    button.setAttribute("data-wow-duration", "1s");
    button.href = "game.html?level=" + levelOptions[i];
    button.textContent = levelOptions[i];
    buttonContainer.appendChild(button);
    secDelay += 0.1;
}

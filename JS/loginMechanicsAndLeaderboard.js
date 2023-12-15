document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem("checked")) { }
    else {
        if (localStorage.getItem("checked") === "false") localStorage.setItem("currentUser", "");
    }

    if (document.getElementById('otherPlayers')) updateLeaderboardDisplay();

    logInOut();
});

function logInOut() {
    if(!localStorage.getItem("currentUser"))localStorage.setItem("currentUser","")
    if (localStorage.currentUser === "") {
    } else {
        const navButton = document.getElementById('logInOut');
        if (navButton) {
            navButton.innerHTML = 'Log Out';
            navButton.addEventListener('click', () => {
                localStorage.setItem("currentUser", "");
                logInOut();
            });
        }

        const button = document.getElementById('logInOutButton');
        if (button) {
            button.textContent = 'Log Out';
            button.addEventListener('click', () => {
                localStorage.setItem("currentUser", "");
                logInOut();
            });
        }
    }
}

function updateLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboards')) || [];

    updateTopPlacement('firstPlace', leaderboard, 0);
    updateTopPlacement('secondPlace', leaderboard, 1);
    updateTopPlacement('thirdPlace', leaderboard, 2);

    // Clear existing entries in 'otherPlayers'
    const otherPlayersDiv = document.getElementById('otherPlayers');
    otherPlayersDiv.innerHTML = '';

    // Start from the 4th place
    for (let i = 3; i < leaderboard.length; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-box';
        playerDiv.innerHTML = `
            <span class="position">${i + 1}.</span>
            <span class="name">${leaderboard[i].user}</span>
            <span class="score">${leaderboard[i].score}</span>
        `;
        otherPlayersDiv.appendChild(playerDiv);
    }
}


function updateTopPlacement(placeId, leaderboard, index) {
    const placeElement = document.getElementById(placeId);
    if (leaderboard[index]) {
        placeElement.innerHTML = `${leaderboard[index].user}<br>${leaderboard[index].score}`;
    } else {
        placeElement.innerHTML = '';
    }
}


function updateOtherPlacement(nameId, scoreId, leaderboard, index) {
    const nameElement = document.getElementById(nameId);
    const scoreElement = document.getElementById(scoreId);

    if (leaderboard[index]) {
        nameElement.textContent = leaderboard[index].user;
        scoreElement.textContent = leaderboard[index].score;
    } else {
        nameElement.textContent = '';
        scoreElement.textContent = '';
    }
}
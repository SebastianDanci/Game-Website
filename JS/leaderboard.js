document.addEventListener('DOMContentLoaded', function () {
    updateLeaderboardDisplay();
});

function updateLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    updateTopPlacement('firstPlace', leaderboard, 0);
    updateTopPlacement('secondPlace', leaderboard, 1);
    updateTopPlacement('thirdPlace', leaderboard, 2);

    for (let i = 3; i < 7; i++) {
        updateOtherPlacement(`player${i + 1}Name`, `player${i + 1}Score`, leaderboard, i);
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

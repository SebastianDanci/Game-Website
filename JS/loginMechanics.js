document.addEventListener('DOMContentLoaded', () => {

    function logInOut() {
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
    logInOut();

    window.addEventListener("beforeunload", function(event) {
        if(localStorage.checked === "true"){}
        else {
            this.localStorage.currentUser=""
        }
    });
    
    
});
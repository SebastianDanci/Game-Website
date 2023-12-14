document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.currentUser === "") {

    const logbox = document.querySelector('.logbox');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const loginButton = document.querySelector('.login-move');
    const registerButton = document.querySelector('.register-move');
    const firstChildButton = document.querySelector('.menu ul li:nth-child(4) a');
    const secondChildButton = document.querySelector('.menu ul li:nth-child(5) a');

    // Function to hide the buttons
    function hideButtons() {
      firstChildButton.style.opacity = '0';
      secondChildButton.style.opacity = '0';
      firstChildButton.style.zIndex = '0';
      secondChildButton.style.zIndex = '0';
    }

    // Function to show the login button
    function showRegisterButton() {
      firstChildButton.style.opacity = '1';
      firstChildButton.style.zIndex = '1';
    }

    // Function to show the register button
    function showLoginButton() {
      secondChildButton.style.opacity = '1';
      secondChildButton.style.zIndex = '1';
    }

    // Initial setup: Hide both buttons
    hideButtons();
    showRegisterButton();

    registerLink.addEventListener('click', () => {
      logbox.classList.add('active');
      hideButtons();
      showLoginButton();
    });

    loginLink.addEventListener('click', () => {
      logbox.classList.remove('active');
      hideButtons();
      showRegisterButton();
    });

    loginButton.addEventListener('click', () => {
      console.log('Login button clicked');
      logbox.classList.remove('active');
      hideButtons();
      showRegisterButton();
    });

    registerButton.addEventListener('click', () => {
      console.log('Register button clicked');
      logbox.classList.add('active');
      hideButtons();
      showLoginButton();
    });

    class User {
      constructor(name, email, phone, password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
      }
    }

    localStorage.setItem("currentUser", "");

    // Regular expression patterns
    const namePattern = /^[a-zA-Z ]+$/;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const phonePattern = /^(?:(?:0(?:0|11)[\s-]?|\+)44[\s-]?(?:0[\s-]?)?|0)(?:\d{2}[\s-]?\d{4}[\s-]?\d{4}|\d{3}[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    // Register form and input elements
    const regForm = document.getElementById('registrationForm');
    const regEmail = document.getElementById('regEmail');
    const regPhone = document.getElementById('regPhone');
    const regName = document.getElementById('regName');
    const regPassword = document.getElementById('regPassword');
const termsCheckbox = document.getElementById('termsCheckbox')

    // Function to validate inputs
    function validateInput(inputElement, pattern) {
      return pattern.test(inputElement.value);
    }

    // Event listener for form submission
    regForm.addEventListener('submit', function (event) {

      // Check each input against its pattern
      if(localStorage.getItem(regName.value)){
      if (!validateInput(regName, namePattern)) {
        alert('Please enter a valid name.');
        event.preventDefault();
      } else if (!validateInput(regEmail, emailPattern)) {
        alert('Please enter a valid email address.');
        event.preventDefault();
      } else if (!validateInput(regPhone, phonePattern)) {
        alert('Please enter a valid phone number.');
        event.preventDefault();
      } else if (!validateInput(regPassword, passwordPattern)) {
        alert('Please enter a valid Password\nMinimum 8 characters, at least one letter, one number, and one special character: @$!%*#?&');
        event.preventDefault();
      } else if (!termsCheckbox.checked) {
        // If checkbox is not checked, set custom validity and prevent form submission
        alert('You have to agree to the Terms and Conditions to proceed!');
        event.preventDefault();
      } else {
        // Checkbox is checked, proceed with form submission (if other validations are also successful)
        let user = new User(regName.value, regEmail.value, regPhone.value, regPassword.value);
        localStorage.setItem(user.name, JSON.stringify(user));
        localStorage.setItem("currentUser", user.name);
        setTimeout(function () {
          window.location.href = 'game.html';
        }, 500);
      }}else{
        alert("This username has been already taken")
      }
    });



    const logForm = document.getElementById('loginForm');
    const logName = document.getElementById('logName');
    const logPassword = document.getElementById('logPassword');

    logForm.addEventListener('submit', function (event) {
      const logUser = localStorage.getItem(logName.value)
      if (logUser)
        if (JSON.parse(logUser).password === logPassword.value) {
          setTimeout(function () {
            var rememberMeCheckbox = document.getElementById('remember');
            if (rememberMeCheckbox.checked) {
              // Checkbox is checked
              localStorage.setItem("checked", "true")
            } else {
              // Checkbox is not checked
              localStorage.setItem("checked", "false")
            }

            localStorage.setItem("currentUser", logName.value);
            window.location.href = 'game.html';
          }, 500);
          event.preventDefault();
        }
        else {
          alert('Incorrect password!');
          event.preventDefault();
        }
      else {
        alert('No account found with username: ' + logName.value + '!');
        event.preventDefault();
      }
    });
  } else window.location.href = 'game.html';
});

document.addEventListener('DOMContentLoaded', () => {
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
    constructor( name, email, phone, password ) {
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
  const phonePattern = /^\d{11}$/;
  const passwordPattern =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;



  // Form and input elements
  const form = document.getElementById('registrationForm');
  const regEmail = document.getElementById('regEmail');
  const regPhone = document.getElementById('regPhone');
  const regName = document.getElementById('regName');
  const regPassword = document.getElementById('regPassword');


  // Function to validate inputs
  function validateInput(inputElement, pattern) {
    return pattern.test(inputElement.value);
  }

  // Event listener for form submission
  form.addEventListener('submit', function (event) {
    // Check each input against its pattern
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
    } else {
      let user = new User(regName.value, regEmail.value, regPhone.value, regPassword.value);
      localStorage.setItem(user.email, JSON.stringify(user));
      localStorage.setItem("currentUser", user.name);
      window.location.replace = '../HTML/game.html';
    }
  });

});

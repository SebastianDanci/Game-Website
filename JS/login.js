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
    function showLoginButton(){
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
  });
  
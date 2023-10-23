const logbox = document.querySelector('.logbox');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', () =>{
    logbox.classList.add('active');
});
loginLink.addEventListener('click', () =>{
    logbox.classList.remove('active');
});
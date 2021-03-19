// import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// * Creating some DOM elements to check if its available.
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('form');
const logoutbtn = document.querySelector('.nav__el--logout');

console.log('Hello From Client!');
if (mapbox) {
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password);
    });
}

if (logoutbtn) {
    logoutbtn.addEventListener('click', logout);
}

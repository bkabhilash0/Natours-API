// import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// * Creating some DOM elements to check if its available.
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutbtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

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

if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const passwordCurrent = document.getElementById('password-current')
            .value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm')
            .value;

        updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );
        document.querySelector('.btn--save-password').textContent =
            'Save Password';

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

// import '@babel/polyfill';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout, signup } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// * Creating some DOM elements to check if its available.
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
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

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm')
            .value;
        const data = { name, email, password, passwordConfirm };
        document.getElementById('signUp-Text').textContent = 'Signing Up...';
        await signup(data);
        document.getElementById('signUp-Text').textContent = 'Sign Up';
    });
}

if (logoutbtn) {
    logoutbtn.addEventListener('click', logout);
}

if (userDataForm) {
    document.getElementById('photo').addEventListener('change', (e) => {
        const file = e.target.files;
        console.log(file[0].name);
        document.getElementById('photo--label').textContent = file[0].name;
    });
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
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

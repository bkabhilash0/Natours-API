import axios from 'axios';
import { showAlerts } from './alerts';
console.log('Login Script is Running!');

export const signup = async (data) => {
    try {
        const response = await axios.post(
            'http://127.0.0.1:3000/api/v1/users/signup',
            data
        );
        if (response.data.status === 'success') {
            showAlerts('success', 'Signed Up Successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        console.log(error.response.data);
        showAlerts('error', error.response.data.message);
    }
};

export const login = async (email, password) => {
    axios
        .post('http://127.0.0.1:3000/api/v1/users/login', { email, password })
        .then((response) => {
            if (response.data.status === 'success') {
                showAlerts('success', 'Logged In Successfully!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }
        })
        .catch((error) => {
            console.log(error.response.data);
            showAlerts('error', error.response.data.message);
        });
};

export const logout = () => {
    axios
        .get('http://127.0.0.1:3000/api/v1/users/logout')
        .then((response) => {
            if (response.data.status == 'success') {
                showAlerts('success', 'Logged Out Successfully!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }
        })
        .catch((error) => {
            console.log(error.response);
            showAlerts('error', 'Error Logging Out! Try Again.');
        });
};

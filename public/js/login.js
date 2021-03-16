import axios from 'axios';
console.log('Login Script is Running!');

export const login = (email, password) => {
    axios
        .post('http://127.0.0.1:3000/api/v1/users/login', { email, password })
        .then((response) => {
            console.log(response);
            if (response.data.status === 'success') {
                alert('Logged In Successfully!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }
        })
        .catch((error) => {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
};
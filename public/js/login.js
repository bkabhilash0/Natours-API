console.log('Login Script is Running!');

const login = (email, password) => {
    console.log({ email, password });
    axios
        .post('http://127.0.0.1:3000/api/v1/users/login', { email, password })
        .then((response) => console.log(response))
        .catch((error) => console.log(error.response.data));
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

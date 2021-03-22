import axios from 'axios';
import { showAlerts } from './alerts';

export const updateSettings = (data, type) => {
    const url = type === 'password' ? 'updateMyPassword' : 'updateMe';
    axios
        .patch(`http://127.0.0.1:3000/api/v1/users/${url}`, data)
        .then((response) => {
            if (response.data.status === 'success') {
                showAlerts(
                    'success',
                    `${type.toUpperCase()} Updated Successfully!`
                );
                setTimeout(() => {
                    window.location.reload(); 
                }, 1500); 
            }
        })
        .catch((err) => {
            showAlerts('error', err.response.data.message);
        });
};

import express from 'express';
import {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
} from '../controllers/userController';
import {
    signUp,
    login,
    forgetPassword,
    resetPassword,
} from '../controllers/authController';

const router = new express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', resetPassword);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

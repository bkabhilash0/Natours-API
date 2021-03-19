import express from 'express';
import {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
} from '../controllers/userController';
import {
    auth,
    signUp,
    login,
    forgetPassword,
    resetPassword,
    updatePassword,
    restrictTo,
    logout,
} from '../controllers/authController';

const router = new express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', resetPassword);

router.use(auth);
router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

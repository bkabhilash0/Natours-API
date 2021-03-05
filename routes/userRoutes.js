import express from 'express';
import {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateMe,
    deleteMe,
} from '../controllers/userController';
import {
    auth,
    signUp,
    login,
    forgetPassword,
    resetPassword,
    updatePassword,
    myProfile
} from '../controllers/authController';

const router = new express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', resetPassword);
router.get('/myProfile', auth, myProfile);
router.patch('/updateMyPassword', auth, updatePassword);
router.patch('/updateMe', auth, updateMe);
router.delete('/deleteMe', auth, deleteMe);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

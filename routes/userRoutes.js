import express from 'express';
import {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
} from '../controllers/userController';
import { signUp } from '../controllers/authController';

const router = new express.Router();

router.post('/signup', signUp);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

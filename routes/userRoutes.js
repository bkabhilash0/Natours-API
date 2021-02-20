import express from 'express';
import {createUser, updateUser, getUser, getAllUsers, deleteUser} from '../controllers/userController';

const router = new express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

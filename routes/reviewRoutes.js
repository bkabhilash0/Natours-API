import express from 'express';
import {
    createReview,
    getAllReviews,
    deleteReview,
    updateReview,
    setTourandUser,
} from '../controllers/reviewController';
import { auth, restrictTo } from '../controllers/authController';

const router = new express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(auth, restrictTo('user'), setTourandUser, createReview);

router.route('/:id').delete(deleteReview).patch(updateReview);

export default router;

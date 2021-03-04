import express from 'express';
import { createReview, getAllReviews } from '../controllers/reviewController';
import { auth, restrictTo } from '../controllers/authController';

const router = new express.Router();

router
    .route('/')
    .get(getAllReviews)
    .post(auth, restrictTo('user'), createReview);

export default router;

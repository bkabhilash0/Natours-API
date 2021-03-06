import express from 'express';
import {
    createReview,
    getAllReviews,
    deleteReview,
    updateReview,
    setTourandUser,
    getAReview,
} from '../controllers/reviewController';
import { auth, restrictTo } from '../controllers/authController';

const router = new express.Router({ mergeParams: true });

router.use(auth);
router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourandUser, createReview);

router
    .route('/:id')
    .get(getAReview)
    .delete(restrictTo('user', 'admin'), deleteReview)
    .patch(restrictTo('user', 'admin'), updateReview);

export default router;

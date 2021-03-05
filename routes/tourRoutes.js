import express from 'express';
import { auth, restrictTo } from '../controllers/authController';
import reviewRouter from './reviewRoutes';
import {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    aliasTours,
    getToursData,
    getMonthlyPlan,
} from '../controllers/tourController';

const router = new express.Router();

// * Nested Routes. - /tours/id/reviews
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTours, getAllTours);
router.route('/tour-stats').get(getToursData);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(auth, getAllTours).post(createTour);
router
    .route('/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(auth, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;

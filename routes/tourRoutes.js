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
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages,
} from '../controllers/tourController';

const router = new express.Router();

// * Nested Routes. - /tours/id/reviews
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTours, getAllTours);
router.route('/tour-stats').get(getToursData);
router
    .route('/monthly-plan/:year')
    .get(auth, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router
    .route('/tours-within/:distance/center/:latlong/unit/:unit')
    .get(getToursWithin);
router.route('/distances/:latlong/unit/:unit').get(getDistances);
router
    .route('/')
    .get(getAllTours)
    .post(auth, restrictTo('admin', 'lead-guide'), createTour);
router
    .route('/:id')
    .get(getSingleTour)
    .patch(
        auth,
        restrictTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(auth, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;

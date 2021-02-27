import express from 'express';
import {auth} from '../controllers/authController';
import {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    aliasTours,
    getToursData,
    getMonthlyPlan
} from '../controllers/tourController';

const router = new express.Router();

router.route('/top-5-cheap').get(aliasTours, getAllTours);
router.route('/tour-stats').get(getToursData);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(auth,getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

export default router;

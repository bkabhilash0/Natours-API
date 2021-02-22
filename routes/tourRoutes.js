import express from 'express';
import {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    aliasTours,
} from '../controllers/tourController';

const router = new express.Router();

router.route('/top-5-cheap').get(aliasTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

export default router;

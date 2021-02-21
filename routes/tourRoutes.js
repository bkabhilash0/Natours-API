import express from 'express';
import {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
} from '../controllers/tourController';

const router = new express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

export default router;

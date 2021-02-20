import express from 'express';
import {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody
} from '../controllers/tourController';

const router = new express.Router();
console.log(`${__dirname}/../dev-data/data/tours-simple.json`);

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody,createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

export default router;

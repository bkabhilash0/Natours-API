import express from 'express';
import { getOverview, getTour } from '../controllers/viewsController';

const router = new express.Router();

router.get('/', getOverview);
router.get('/tours/:slug', getTour);

export default router;

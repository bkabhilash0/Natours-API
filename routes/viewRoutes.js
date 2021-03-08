import express from 'express';
import { getOverview, getTour } from '../controllers/viewsController';

const router = new express.Router();

router.get('/', getOverview);
router.get('/tour', getTour);

export default router;

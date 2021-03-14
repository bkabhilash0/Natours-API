import express from 'express';
import { getOverview, getTour, login} from '../controllers/viewsController';

const router = new express.Router();

router.get('/', getOverview);
router.get('/login',login)
router.get('/tours/:slug', getTour);

export default router;

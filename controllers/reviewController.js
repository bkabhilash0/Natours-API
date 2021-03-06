import Review from '../models/reviewModel';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';
// import catchAsync from '../utils/catchAsync';


const setTourandUser = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    next();
};

const getAllReviews = getAll(Review);
const getAReview = getOne(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourandUser,
    getAReview
};

import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';
import { createOne, deleteOne, updateOne } from './handlerFactory';

const getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

const setTourandUser = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    next();
};

const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourandUser,
};

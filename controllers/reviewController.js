import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

const createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review,
        },
    });
});

export { getAllReviews, createReview };

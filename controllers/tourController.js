import Tour from '../models/tourModel';
import { createOne, deleteOne, updateOne } from './handlerFactory';
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/ApiFeatures';
import AppError from '../utils/AppError';

const aliasTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours,
        },
    });
});

const getSingleTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

const getToursData = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgPrice: 1, //* 1 for Asscending
            },
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } },
        // },
    ]);

    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: { _id: 0 },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);
    res.status(200).json({
        status: 'success',
        length: plan.length,
        data: { plan },
    });
});

export {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    aliasTours,
    getToursData,
    getMonthlyPlan,
};

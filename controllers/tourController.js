import Tour from '../models/tourModel';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handlerFactory';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const getAllTours = getAll(Tour);
const getSingleTour = getOne(Tour, { path: 'reviews' });
const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

//* '/tours-within/:distance/center/:lat,long/unit/:unit'
const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlong, unit } = req.params;
    const [lat, long] = latlong.split(',');
    if (!lat || !long) {
        return next(
            new AppError(
                'Please provide the lat and long in the formate lat,long',
                400
            )
        );
    }
    const radius = unit == 'mi' ? distance / 3963.2 : distance / 6378.1; // * Conver the distance to radiants.
    console.log(distance, lat, long, unit, radius);
    const filter = {
        startLocation: {
            $geoWithin: {
                $centerSphere: [[long, lat], radius],
            },
        },
    };
    const tours = await Tour.find(filter);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

const getDistances = catchAsync(async (req, res, next) => {
    const { latlong, unit } = req.params;
    const [lat, long] = latlong.split(',');
    if (!lat || !long) {
        return next(
            new AppError(
                'Please provide the lat and long in the formate lat,long',
                400
            )
        );
    }
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [long * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    });
});

const aliasTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

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
    getToursWithin,
    getDistances,
};

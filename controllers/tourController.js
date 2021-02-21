import Tour from '../models/tourModel';

const getAllTours = async (req, res) => {
    try {
        const queryObjects = { ...req.query };
        const excludedField = ['page', 'sort', 'limit', 'fields'];
        excludedField.forEach((field) => delete queryObjects[field]);
        console.log(req.query, queryObjects);

        const tours = await Tour.find(queryObjects);
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'Server Error',
        });
    }
};

const getSingleTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tour Found!',
        });
    }
};

const createTour = async (req, res) => {
    try {
        const result = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: result,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data Sent!',
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data Sent!',
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

export { createTour, getAllTours, getSingleTour, updateTour, deleteTour };

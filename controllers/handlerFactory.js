import APIFeatures from '../utils/ApiFeatures';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

const deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('No doc found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

const updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

const createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const result = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data: result,
            },
        });
    });

const getOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        const query = Model.findById(req.params.id);
        if (populateOptions) {
            query.populate(populateOptions);
        }
        const doc = await query;
        if (!doc) {
            return next(new AppError('No doc found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

const getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        // * To allow Nested Routed for Tour Reviews.
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // const docs = await features.query.explain();
        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: docs.length,
            data: {
                data: docs,
            },
        });
    });

export { deleteOne, updateOne, createOne, getOne, getAll };

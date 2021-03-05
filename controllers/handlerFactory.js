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

export { deleteOne, updateOne, createOne };

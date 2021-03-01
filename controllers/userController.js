import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const filterObj = (obj, ...allowed) => {
    const newObj = {};
    Object.keys(obj).map((key) => {
        if (allowed.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
    const query = User.find();
    const users = await query;
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        length: users.length,
        data: {
            users,
        },
    });
});

const updateMe = catchAsync(async (req, res, next) => {
    // * 1. Throw Error if user posts Password Data.
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for Password Updates.', 400)
        );
    }
    // * 2. Update User Document.
    const filteredBody = filterObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

export {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateMe,
    deleteMe,
};

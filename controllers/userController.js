import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

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

export { createUser, updateUser, getUser, getAllUsers, deleteUser };

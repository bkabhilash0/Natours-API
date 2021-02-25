import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';

const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const userData = { name, email, password, passwordConfirm };
    const newUser = await User.create(userData);

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
        expiresIn: '90d',
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

export { signUp };

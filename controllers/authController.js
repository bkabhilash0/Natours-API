import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const signUpToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '90d' });
};

const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const userData = { name, email, password, passwordConfirm };
    const newUser = await User.create(userData);

    const token = signUpToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please enter your email and password!', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(
            new AppError('The email or the Password is incorrect!', 401)
        );
    }
    res.status(200).json({
        status: 'success',
        token: signUpToken(user._id),
    });
});

export { signUp, login };

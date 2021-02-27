import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { promisify } from 'util';

const signUpToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '90d' });
};

const signUp = catchAsync(async (req, res, next) => {
    const {
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt,
    } = req.body;
    const userData = {
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt,
    };
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

const auth = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError("You aren't logged in. Please Login in Continue!", 401)
        );
    }
    // * 2. Verify the Token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // * 3. Check if the User still exists.
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The user belonging to the token no longer exists!',
                401
            )
        );
    }

    // * 4. Check if User Changed the Password after issuing token.
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User  recently changed the password! Please Login Again',
                401
            )
        );
    }

    // * 5. Grant Access to the Protected Route.
    req.user = freshUser;
    next();
});

export { signUp, login, auth };

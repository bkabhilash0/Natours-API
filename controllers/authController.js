import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import Email from '../utils/email';
import { promisify } from 'util';
import crypto from 'crypto';

const signUpToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '90d' });
};

const createSendToken = (user, statusCode, res) => {
    const token = signUpToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

const signUp = catchAsync(async (req, res, next) => {
    const {
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt,
        role,
    } = req.body;
    const userData = {
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt,
        role,
    };
    const newUser = await User.create(userData);
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res);
});

const logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).send({ status: 'success' });
};

const auth = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    res.locals.user = freshUser;
    next();
});

const isLoggedIn = async (req, res, next) => {
    let token;
    try {
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            // * 2. Verify the Token
            const decoded = await promisify(jwt.verify)(
                token,
                process.env.SECRET_KEY
            );

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
                return next();
            }

            // * 5. Grant Access to the Protected Route - A user is Logged in.
            res.locals.user = freshUser;
            return next();
        }
    } catch (err) {
        return next();
    }
    next();
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perfrom this action!',
                    403
                )
            );
        }
        next();
    };
};

const forgetPassword = catchAsync(async (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError('Provide a Valid Email Address', 400));
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('There is no user with this email address!', 404)
        );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    try {
        await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token sent to Email',
        });
    } catch (error) {
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the Mail! Please try again later',
                500
            )
        );
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    // * 1. Get the user based on the Token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError('Token is Invalid or Has Expired', 400));
    }

    // * 2. Set the New Password if token hasn't expired.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // * 3. Update the Changed Password.
    await user.save();
    const token = signUpToken(user._id);

    // * 4. Log the User In
    createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
    // * 1. Get the User from the DB.
    const user = await User.findOne({ _id: req.user._id }).select('+password');

    // * 2. Check if the Current Password entered by the User matches.
    if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
        return next(
            new AppError('The Current Password you entered is invalid', 401)
        );
    }
    // * 3. Now Update the Password and Save it to the DB.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // ? We use save rather than findByIDandUpdate coz only save and create triggers the middleware & Validators.
    await user.save();

    // * 4. Login the User and sent back the token.
    createSendToken(user, 200, res);
});

export {
    signUp,
    login,
    auth,
    restrictTo,
    forgetPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logout,
};

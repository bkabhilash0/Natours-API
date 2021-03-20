import Tour from '../models/tourModel';
import User from '../models/userModel';
import moment from 'moment';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
        moment,
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const tour = await Tour.findOne({ slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    if (!tour) {
        return next(new AppError('There is no Tour with the given name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
        moment,
    });
});

const login = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login',
    });
});

const me = catchAsync(async (req, res, next) => {
    res.status(200).render('profile', {
        title: 'My Profile',
    });
});

const updateUserData = catchAsync(async (req, res, next) => {
    const upDatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).render('profile', {
        title: 'My Profile',
        user: upDatedUser,
    });
});

export { getOverview, getTour, login, me, updateUserData };

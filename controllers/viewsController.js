import Tour from '../models/tourModel';
import moment from 'moment';
import catchAsync from '../utils/catchAsync';

const getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
        moment,
    });
});

const getTour = catchAsync(async (req, res) => {
    const slug = req.params.slug;
    const tour = await Tour.findOne({ slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    res.status(200).render('tour', {
        title: 'All Tours',
        tour,
        moment
    });
});

export { getOverview, getTour };

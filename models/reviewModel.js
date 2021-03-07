import mongoose from 'mongoose';
import Tour from './tourModel';

const schema = {
    review: {
        type: String,
        required: [true, "Review can't be empty"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must Belong to a Tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must Belong to a User'],
    },
};

const reviewSchema = new mongoose.Schema(schema, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    const query = this;
    // query.populate({ path: 'tour', select: 'name' });
    // query.populate({ path: 'user', select: 'name photo' });
    query.populate({ path: 'user', select: 'name photo' });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const Review = this;
    const stats = await Review.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 0,
        });
    }
};

reviewSchema.post('save', function () {
    const Review = this.constructor;
    const review = this; // * Current Review
    Review.calcAverageRatings(review.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    const query = this;
    this.r = await query.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    const Review = this.r.constructor;
    Review.calcAverageRatings(this.r.tour);
});

const model = mongoose.model('Review', reviewSchema);

export default model;

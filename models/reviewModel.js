import mongoose from 'mongoose';

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

reviewSchema.pre(/^find/, function (next) {
    const query = this;
    // query.populate({ path: 'tour', select: 'name' });
    // query.populate({ path: 'user', select: 'name photo' });
    query.populate({ path: 'user', select: 'name photo' });
    next();
});

const model = mongoose.model('Review', reviewSchema);

export default model;

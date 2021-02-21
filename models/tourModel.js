import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must Have a Name!'],
            unique: true,
        },
        duration: {
            type: Number,
            required: [true, 'A Tour must Have a Duration!'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A Tour must Have a Group Size!'],
        },
        difficulty: {
            type: String,
            required: [true, 'A Tour must Have a Difficulty!'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A Tour must Have a Price!'],
        },
        discount: {
            type: Number,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A Tour must Have a Summary!'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A Tour must Have a cover Image!'],
        },
        images: [String],
        startDates: [Date]
    },
    { timestamps: true }
);

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;

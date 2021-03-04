import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must Have a Name!'],
            unique: true,
            minLength: [10, 'Name must be minimum of 10 characters'],
            maxLength: [40, 'Name must be maximum of 40 characters'],
        },
        slug: String,
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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message:
                    'Difficulty should only be either of : easy or medium or difficult',
            },
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
            validate: {
                validator: function (value) {
                    return value < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below the regular price.',
            },
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
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {
    const query = this;
    query.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
    next();
});

// tourSchema.pre('save', async function (next) {
//     const tour = this;
//     const guidesPromises = tour.guides.map(
//         async (id) => await User.findById(id)
//     );
//     tour.guides = await Promise.all(guidesPromises);
//     next();
// });

// * Query Middleware - this keyword points to the current query. Note: Works only for save and create.
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

// * Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;

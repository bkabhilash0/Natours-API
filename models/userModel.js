import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your Name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email-ID'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'guide', 'lead-guide', 'user'],
            message: 'Please provide a Valid role!',
        },
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Kindly provide a Valid Password'],
        minLength: [8, 'Password Must minimum be of 8 characters!'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please re-enter your password to confirm'],
        // * This only works on save and create only and not update.
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords don't Match",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000; //* The JWT Might get created 1s before this happens.
    next();
});

userSchema.methods.checkPassword = async (provided, original) => {
    return await bcrypt.compare(provided, original);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    const user = this;
    if (user.passwordChangedAt) {
        const timeStamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        console.log(timeStamp, JWTTimeStamp);
        return JWTTimeStamp < timeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    this.passwordResetExpires = moment().add(10, 'm');
    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;

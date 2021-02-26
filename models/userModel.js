import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

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
    password: {
        type: String,
        required: [true, 'Kindly provide a Valid Password'],
        minLength: [8, 'Password Must minimum be of 8 characters!'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your Password!'],
        // * This only works on save and create only and not update.
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords don't Match",
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.checkPassword = async(provided,original) => {
    return await bcrypt.compare(provided,original);
}

const User = mongoose.model('User', userSchema);

export default User;

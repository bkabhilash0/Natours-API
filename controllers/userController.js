import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory';
import multer from 'multer';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        // * Filename format => user-id-timestamp.extensions
        const extension = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-${Date.now()}.${extension}`);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an Image! Please Upload a Valid Image', 400),
            false
        );
    }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowed) => {
    const newObj = {};
    Object.keys(obj).map((key) => {
        if (allowed.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
    // * 1. Throw Error if user posts Password Data.
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for Password Updates.', 400)
        );
    }
    // * 2. Update User Document.
    const filteredBody = filterObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

// * Deactivate an User.
const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use Signup Instead.',
    });
};

const getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
};

const getAllUsers = getAll(User);
const getUser = getOne(User);
// * Do not use this to Update Passwords.
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

export {
    createUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
};

import fs from 'fs';
import path from 'path';
import Tour from '../../models/tourModel';
import User from '../../models/userModel';
import Review from '../../models/reviewModel';
import mongoose from 'mongoose';
import config from 'dotenv';

config.config({ path: './config.env' });

const tours = JSON.parse(
    fs.readFileSync(path.join(__dirname, './tours.json'), 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, './users.json'), 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(path.join(__dirname, './reviews.json'), 'utf-8')
);
const DB = process.env.DATABASE_LOCAL;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to Database Successfully!'))
    .catch((err) => console.log(err.message));

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data Successfully Loaded into the DataBase');
        process.exit();
    } catch (error) {
        console.log(error.message);
    }
};

const deleteAllData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Cleared the DB!');
        process.exit();
    } catch (error) {
        console.log('Unable to Delete the Data!');
    }
};

if (process.argv[2] === '--delete') {
    deleteAllData();
} else if (process.argv[2] === '--import') {
    importData();
}

console.log(process.argv);

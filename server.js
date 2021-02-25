import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import mongoose from 'mongoose';
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION - App is Shutting Down...😌');
    process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE_LOCAL;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to Database Successfully!'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log('Server listening on PORT', PORT);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDELED REJECTION - App is Shutting Down...😥');
    server.close(() => process.exit(1)); //* Code 1 is for Unhandled-Exception!
});


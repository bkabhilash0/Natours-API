import mongoose from 'mongoose';
import app from './app';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server listening on PORT', PORT);
});

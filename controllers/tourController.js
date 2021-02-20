import fs from 'fs';

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const checkID = (_req, res, next, val) => {
    if (val >= tours.length && val >= 0) {
        return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
    }
    next();
};

const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price!',
        });
    }
    next();
};

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours,
        },
    });
};

const getSingleTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((item) => item.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};

const createTour = (req, res) => {
    const new_id = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: new_id }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const updateTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((item) => item.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated Tour Here>',
        },
    });
};

const deleteTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((item) => item.id === id);
    res.status(204).json({ status: 'success', data: null });
};

export {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
};

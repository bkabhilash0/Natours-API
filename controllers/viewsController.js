const getOverview = (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours',
    });
};

const getTour = (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours',
    });
};

export { getOverview, getTour };

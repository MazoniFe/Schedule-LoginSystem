exports.homePage = (req, res) => {
    res.render('index');
};

exports.homePost = (req, res) => {
    res.send(req.body);
};
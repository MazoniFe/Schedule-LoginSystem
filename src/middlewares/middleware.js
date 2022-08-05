exports.middlewareGlobal = (req, res, next) => {
    next();
};
exports.checkCsrfError = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
        return res.render('csrferror');
    }
};
exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();

};
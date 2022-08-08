const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if (req.session.user) return res.render('logged');
    return res.render('login');
};

exports.register = async(req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('index');
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso!');
        req.session.save(function() {
            return res.redirect('index');
        });
    } catch (e) {
        console.log(e);
        return res.render('csrferror');
    }
};

exports.login = async(req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('index');
            });
            return;
        }

        req.flash('success', 'Seja bem vindo!');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('index');
        });
    } catch (e) {
        console.log(e);
        return res.render('csrferror');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');

}
const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact');
};

exports.register = async(req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {

            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }
        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => res.redirect('back'));
        return;
    } catch (e) {
        console.log(e);
        res.render('csrferror');
    }
};

exports.editIndex = async function(req, res) {
    if (!req.params.id) return res.render('SEM PARAMETRO');
    const contato = await Contact.findId(req.params.id);
    if (!contato) return res.render('csrferror');
    res.render('contact', { contact })


};
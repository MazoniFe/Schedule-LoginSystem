const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact', {
        contato: []
    });
};
exports.register = async(req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return;
        }
        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => res.redirect('back'));
        return;
    } catch (e) {
        console.log(e);
        return res.render('csrferror');
    }
};

exports.editIndex = async function(req, res) {
    if (!req.params.id) return;
    const contact = await Contact.findId(req.params.id);
    if (!contact) return;
    res.render('contact', {
        contato: contact
    });
};

exports.edit = async function(req, res) {
    try {
        if (!req.params.id) return;
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);


        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return;
        }
        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => res.redirect('back'));
        return;
    } catch (e) {
        console.log(e);
    }
};

exports.delete = async function(req, res) {
    if (!req.params.id) return;
    const contact = await Contact.delete(req.params.id);
    if (!contact) return;
    req.flash('success', 'Contato apagado com sucesso!');
    req.session.save(() => res.redirect('back'));
    return;
};
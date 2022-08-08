const mongoose = require('mongoose');
const { register } = require('../controllers/loginController');
const validator = require('validator');


const ContactoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    createdIn: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contato', ContactoSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype.register = async function() {
    this.valid();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);

};

Contact.prototype.valid = function() {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido!');
    if (!this.body.nome) this.errors.push('Campo obrigatório: nome');
    if (!this.body.email && !this.body.telefone) this.errors.push('Campos obrigatóros: email ou telefone');

}

Contact.prototype.cleanUp = function() {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
};

Contact.prototype.edit = async function(id) {
    if (typeof id !== 'string') return;
    this.valid();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
};


//STATIC METHODS
Contact.findId = async function(id) {
    if (typeof id !== 'string') return;
    const contact = await (ContactModel.findById(id));
    return contact;
}

Contact.findContacts = async function() {
    const contacts = await ContactModel.find().sort({ createdIn: -1 });
    return contacts;
}

Contact.delete = async function(id) {
    if (typeof id !== 'string') return;
    const contact = await ContactModel.findOneAndDelete({ _id: id });
    return contact;
}




module.exports = Contact;
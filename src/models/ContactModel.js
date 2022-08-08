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

Contact.findId = async function(id) {
    if (typeof id !== 'string') return;
    const contato = await ContactModel.findById(id);
    return contato;
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

}





module.exports = Contact;
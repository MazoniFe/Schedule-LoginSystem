const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valid();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Email ou senha inválida.');
            this.user = null;
            return;
        }

    }

    async register() {
        this.valid();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }


    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já existe');


    }

    valid() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido!');

        if (this.body.password.length < 4 || this.body.password.length > 12) {
            this.errors.push('A senha precisa ter entre 4 e 12 caracteres');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            password: this.body.password
        }

    }

}

module.exports = Login;
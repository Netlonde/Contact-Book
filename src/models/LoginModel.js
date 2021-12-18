const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            senha: this.body.password
        }

    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já existe!');
    }

    valida() {
        this.cleanUp();
        // O e-mail precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('O e-mail não é válido!');

        // A senha precisa ter entre 3 e 20 caracteres
        if (this.body.senha.length < 3 || this.body.senha.length > 20)
            this.errors.push('A senha precisa ter entre 3 e 20 caracteres.');

    }

    async registrar() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;


        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.user = await LoginModel.create(this.body);

    }

    async login(){
        this.valida();
        if (this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user){
            this.errors.push('Usuário ou senha inválidos.');
            return;
        } 

        if(!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.errors.push('Usuário ou senha inválidos.');
            this.user = null;
            return;
        }
    }
}

module.exports = Login;
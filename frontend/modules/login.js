import validator from "validator";

export default class Login{
    constructor(formClass){
        this.form = document.querySelector(formClass);
        this.div = document.createElement('div');
        this.div.classList.add('text-danger');
        this.div.classList.add('my-2');
    }

    init() {
        this.events();
    }

    events(){
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
            // console.log(e.target);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const senhaInput = el.querySelector('input[name="password"]');
        let error = false;

        if(!validator.isEmail(emailInput.value)) {
            this.div.innerHTML = 'E-mail inválido';
            this.form.appendChild(this.div);
            error = true;
        }

        if(senhaInput.value.length < 3 || senhaInput.value.length > 20) {
            this.div.innerHTML = '';
            this.div.innerHTML = 'O campo "senha" precisa ter entre 3 e 20 caracteres';
            this.form.appendChild(this.div);
            error = true;
        }

        if(!error) el.submit();
    }

}
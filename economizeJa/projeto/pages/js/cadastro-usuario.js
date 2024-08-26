function validarLogin() {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let cpf = document.getElementById('cpf').value;
    let telefone = document.getElementById('telefone').value;

    document.getElementById('campoObrigatorio').style.display = 'none';
    document.getElementById('senhaTamanho').style.display = 'none';

    if (!nome || !email || !senha || !cpf || !telefone) {
        document.getElementById('campoObrigatorio').style.display = 'block';
    }
    
    if (senha && senha.length < 8 || senha.length > 16) {
       document.getElementById('senhaTamanho').style.display = 'block';
    }
}

function validarPadraoSenha(event) {
    let senha = event.target.value;
    let regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;

    if (!regex.test(senha)) {
        document.getElementById('senhaPadrao').style.display = 'block';
    } else {
        document.getElementById('senhaPadrao').style.display = 'none';
    }
}

function validarEmail(event) {
    let email = event.target.value;
    let regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/;

    if (!regex.test(email)) {
        document.getElementById('emailInvalido').style.display = 'block';
    } else {
        document.getElementById('emailInvalido').style.display = 'none';
    }
}
function validarLogin() {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let cpf = document.getElementById('cpf').value;
    let telefone = document.getElementById('telefone').value;

    document.getElementById('campoObrigatorio').style.display = 'none';
    document.getElementById('senhaTamanho').style.display = 'none';
    document.getElementById('senhaPadrao').style.display = 'none';

    if (!nome || !email || !senha || !cpf || !telefone) {
        document.getElementById('campoObrigatorio').style.display = 'block';
        return;
    }
    
    if (senha.length < 8 || senha.length > 16) {
       document.getElementById('senhaTamanho').style.display = 'block';
       return;
    }

    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/;
    if (!regexEmail.test(email)) {
        document.getElementById('emailInvalido').style.display = 'block';
        return;
    }

    criarUsuario();
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

function criarUsuario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;

    const usuario = {
        nome,
        email,
        senha,
        cpf,
        telefone
    };

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuário cadastrado com sucesso!');
    document.getElementById('form-cadastro').reset();
    window.location.href = 'index.html';
}

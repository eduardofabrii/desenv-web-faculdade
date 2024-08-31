function mostrarFormulario(tipo) {
    document.getElementById('opcoes-cadastro').style.display = 'none';
    
    document.getElementById('form-usuario').style.display = 'none';
    document.getElementById('form-motoboy').style.display = 'none';
    document.getElementById('form-restaurante').style.display = 'none';
    
    document.getElementById(`form-${tipo}`).style.display = 'block';

    document.getElementById('escolha-cadastro').style.display = 'none';
}

function validarLogin() {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let cpf = document.getElementById('cpf').value;
    let telefone = document.getElementById('telefone').value;

    document.getElementById('campoObrigatorio').style.display = 'none';
    document.getElementById('senhaTamanho').style.display = 'none';
    document.getElementById('senhaPadrao').style.display = 'none';
    document.getElementById('emailInvalido').style.display = 'none';

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


function criarUsuario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    const telefone = document.getElementById('telefone').value;
    
    const usuario = {
        nome,
        email,
        senha,
        cpf,
        endereco,
        cidade,
        telefone
    };
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Usuário cadastrado com sucesso!');
    document.getElementById('form-cadastro').reset();
    window.location.href = 'index.html';
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

function validarCadastroMotoboy() {
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;
    const senha = document.getElementById('senha-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;

    document.getElementById('campoObrigatorio').style.display = 'none';
    document.getElementById('senhaTamanho').style.display = 'none';
    document.getElementById('senhaPadrao').style.display = 'none';
    document.getElementById('emailInvalido').style.display = 'none';
    document.getElementById('telefoneInvalido').style.display = 'none';
    document.getElementById('cpfInvalido').style.display = 'none';
    document.getElementById('placaInvalida').style.display = 'none';
    document.getElementById('cnhInvalida').style.display = 'none';


    if (!nome || !email || !telefone || !senha || !cpf || !placa || !cnh) {
        document.getElementById('campoObrigatorio').style.display = 'block';
        return;
    }

    if (senha.length < 8 || senha.length > 16) {
        document.getElementById('senhaTamanho').style.display = 'block';
        return;
    }

    const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
    if (!regexSenha.test(senha)) {
        document.getElementById('senhaPadrao').style.display = 'block';
        return;
    }

    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/;
    if (!regexEmail.test(email)) {
        document.getElementById('emailInvalido').style.display = 'block';
        return;
    }

    const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/; 
    if (!regexTelefone.test(telefone)) {
        document.getElementById('telefoneInvalido').style.display = 'block';
        return;
    }

    
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; 
    if (!regexCPF.test(cpf)) {
        document.getElementById('cpfInvalido').style.display = 'block';
        return;
    }


    const regexPlaca = /^[A-Z]{3}-\d{4}$/; 
    if (!regexPlaca.test(placa)) {
        document.getElementById('placaInvalida').style.display = 'block';
        return;
    }

    const regexCNH = /^\d{11}$/; 
    if (!regexCNH.test(cnh)) {
        document.getElementById('cnhInvalida').style.display = 'block';
        return;
    }

    criarMotoboy();
}

function criarMotoboy() {
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;
    const senha = document.getElementById('senha-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;

    const motoboy = {
        nome,
        email,
        telefone,
        senha,
        cpf,
        placa,
        cnh
    };

    let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
    motoboys.push(motoboy);
    localStorage.setItem('motoboys', JSON.stringify(motoboys));

    alert('Motoboy cadastrado com sucesso!');
    document.getElementById('form-motoboy').reset();
    window.location.href = 'index.html';
}
function validarCadastroRestaurante() {
    const nome = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;

    document.getElementById('campoObrigatorio').style.display = 'none';
    document.getElementById('senhaTamanho').style.display = 'none';
    document.getElementById('senhaPadrao').style.display = 'none';
    document.getElementById('emailInvalido').style.display = 'none';
    document.getElementById('cnpjInvalido').style.display = 'none';
    document.getElementById('telefoneInvalido').style.display = 'none';


    if (!nome || !email || !senha || !cnpj || !endereco || !cidade || !telefone) {
        document.getElementById('campoObrigatorio').style.display = 'block';
        return;
    }

    if (senha.length < 8 || senha.length > 16) {
        document.getElementById('senhaTamanho').style.display = 'block';
        return;
    }

    const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
    if (!regexSenha.test(senha)) {
        document.getElementById('senhaPadrao').style.display = 'block';
        return;
    }

    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/;
    if (!regexEmail.test(email)) {
        document.getElementById('emailInvalido').style.display = 'block';
        return;
    }

    const regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!regexCNPJ.test(cnpj)) {
        document.getElementById('cnpjInvalido').style.display = 'block';
        return;
    }

    // Verificar formato do telefone
    const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!regexTelefone.test(telefone)) {
        document.getElementById('telefoneInvalido').style.display = 'block';
        return;
    }

    criarRestaurante();
}

function criarRestaurante() {
    const nome = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;

    const restaurante = {
        nome,
        email,
        senha,
        cnpj,
        endereco,
        cidade,
        telefone
    };

    let restaurantes = JSON.parse(localStorage.getItem('restaurantes')) || [];
    restaurantes.push(restaurante);
    localStorage.setItem('restaurantes', JSON.stringify(restaurantes));

    alert('Restaurante cadastrado com sucesso!');
    document.getElementById('form-restaurante').reset();
    window.location.href = 'index.html';
}

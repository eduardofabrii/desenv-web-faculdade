// Função para validar e cadastrar o motoboy
function cadastrarMotoboy() {
    // Captura os valores dos campos
    const nome = document.getElementById('nome-motoboy').value.trim();
    const email = document.getElementById('email-motoboy').value.trim();
    const senha = document.getElementById('senha-motoboy').value.trim();
    const cpf = document.getElementById('cpf-motoboy').value.trim();
    const placa = document.getElementById('placa-motoboy').value.trim();
    const cnh = document.getElementById('cnh-motoboy').value.trim();
    const telefone = document.getElementById('telefone-motoboy').value.trim();

    // Referências aos alertas
    const alertaCamposObrigatorios = document.getElementById('campoObrigatorio-motoboy');
    const alertaSenhaTamanho = document.getElementById('senhaTamanho-motoboy');
    const alertaSenhaPadrao = document.getElementById('senhaPadrao-motoboy');
    const alertaEmailInvalido = document.getElementById('emailInvalido-motoboy');
    const alertaTelefoneInvalido = document.getElementById('telefoneInvalido-motoboy');
    const alertaCpfInvalido = document.getElementById('cpfInvalido-motoboy');
    const alertaPlacaInvalida = document.getElementById('placaInvalida-motoboy');
    const alertaCnhInvalida = document.getElementById('cnhInvalida-motoboy');

    // Funções de validação
    function validarCPF(cpf) { return cpf.length === 11; }
    function validarPlaca(placa) { const regexPlaca = /^[A-Z]{3}[0-9][A-Z][0-9]{2}|[A-Z]{3}[0-9]{4}$/; return regexPlaca.test(placa.toUpperCase()); }
    function validarCNH(cnh) { return cnh.length === 11; }
    function validarEmail(email) { const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regexEmail.test(email); }
    function validarTelefone(telefone) { const regexTelefone = /^\d{10,11}$/; return regexTelefone.test(telefone); }

    // Resetar alertas
    alertaCamposObrigatorios.style.display = 'none';
    alertaSenhaTamanho.style.display = 'none';
    alertaSenhaPadrao.style.display = 'none';
    alertaEmailInvalido.style.display = 'none';
    alertaTelefoneInvalido.style.display = 'none';
    alertaCpfInvalido.style.display = 'none';
    alertaPlacaInvalida.style.display = 'none';
    alertaCnhInvalida.style.display = 'none';

    // Validações
    if (!nome || !email || !senha || !cpf || !placa || !cnh || !telefone) {
        alertaCamposObrigatorios.style.display = 'block';
        return;
    }
    if (senha.length < 8 || senha.length > 16) {
        alertaSenhaTamanho.style.display = 'block';
        return;
    }
    if (!/[A-Z]/.test(senha) || !/[!@#$%^&*]/.test(senha)) {
        alertaSenhaPadrao.style.display = 'block';
        return;
    }
    if (!validarEmail(email)) {
        alertaEmailInvalido.style.display = 'block';
        return;
    }
    if (!validarCPF(cpf)) {
        alertaCpfInvalido.style.display = 'block';
        return;
    }
    if (!validarPlaca(placa)) {
        alertaPlacaInvalida.style.display = 'block';
        return;
    }
    if (!validarCNH(cnh)) {
        alertaCnhInvalida.style.display = 'block';
        return;
    }
    if (!validarTelefone(telefone)) {
        alertaTelefoneInvalido.style.display = 'block';
        return;
    }

    // Se tudo estiver válido, armazenar os dados no localStorage
    const motoboy = { nome, email, senha, cpf, placa, cnh, telefone };
    let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
    motoboys.push(motoboy);
    localStorage.setItem('motoboys', JSON.stringify(motoboys));

    alert('Motoboy cadastrado com sucesso!');
}

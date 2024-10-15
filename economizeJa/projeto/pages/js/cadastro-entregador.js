// Função para validar e cadastrar o motoboy
function cadastrarMotoboy() {
    // Captura os valores dos campos
    const nome = document.getElementById('nome-motoboy').value.trim();
    const email = document.getElementById('email-motoboy').value.trim();
    const senha = document.getElementById('senha-motoboy').value.trim();
    const cpf = limparCPF(document.getElementById('cpf-motoboy').value.trim());
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
    function limparCPF(cpf) { return cpf.replace(/\D/g, ''); }
    function validarCPF(cpf) { return cpf.length === 11; }
    function validarPlaca(placa) {
        const regexPlaca = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/;
        return regexPlaca.test(placa.toUpperCase());
    }
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



    // Se tudo estiver válido, enviar os dados para o servidor via POST
    const motoboy = { nome, email, senha, cpf, placa, cnh, telefone };
    
    fetch('/api/motoboys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(motoboy),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Erro: ${data.error}`);
        } else {
            alert('Motoboy cadastrado com sucesso!');
            // Limpar campos após o cadastro
            document.getElementById('nome-motoboy').value = '';
            document.getElementById('email-motoboy').value = '';
            document.getElementById('senha-motoboy').value = '';
            document.getElementById('cpf-motoboy').value = '';
            document.getElementById('placa-motoboy').value = '';
            document.getElementById('cnh-motoboy').value = '';
            document.getElementById('telefone-motoboy').value = '';
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar motoboy:', error);
        alert('Ocorreu um erro ao cadastrar o motoboy. Tente novamente mais tarde.');
    });
}
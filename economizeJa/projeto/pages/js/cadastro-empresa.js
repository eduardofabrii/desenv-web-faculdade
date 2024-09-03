// Função para cadastrar empresa/restaurante
function cadastrarEmpresa() {
    const nome = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;

    // Verificar se todos os campos estão preenchidos
    if (nome && email && cnpj && endereco && cidade && telefone && senha) {
        // Imprimir no console para verificar os dados
        console.log({ nome, email, cnpj, endereco, cidade, telefone, senha });

        // Armazenar os dados no localStorage
        const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
        empresas.push({ nome, email, cnpj, endereco, cidade, telefone, senha });
        localStorage.setItem('empresas', JSON.stringify(empresas));

        // Redirecionar para a página de lista de empresas
        window.open('lista-empresas.html', '_blank');
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para carregar as empresas armazenadas na tabela
function carregarEmpresas() {
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const tabelaEmpresas = document.getElementById('form-cadastro-restaurante').getElementsByTagName('tbody')[0];
    
    tabelaEmpresas.innerHTML = ''; // Limpar a tabela antes de carregar os dados
    
    empresas.forEach(empresa => {
        const row = tabelaEmpresas.insertRow();
        row.insertCell(0).textContent = empresa.nome;
        row.insertCell(1).textContent = empresa.email;
        row.insertCell(2).textContent = empresa.cnpj;
        row.insertCell(3).textContent = empresa.endereco;
        row.insertCell(4).textContent = empresa.cidade;
        row.insertCell(5).textContent = empresa.telefone;

        // Criando a célula de Ações com os botões de Editar e Excluir
        const acoesCell = row.insertCell(6);
        acoesCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="editarEmpresa(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirEmpresa(this)">Excluir</button>
        `;
    });
}

// Função para editar empresa/restaurante
function editarEmpresa(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');
    
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { // Não editar a coluna de ações
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        salvarEdicaoEmpresa(linha);
    };
}

// Função para salvar as edições da empresa/restaurante
function salvarEdicaoEmpresa(linha) {
    const inputs = linha.querySelectorAll('input');
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];

    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    const nomeEditado = linha.cells[0].innerText;

    // Atualizar o localStorage com os valores editados
    const empresaIndex = empresas.findIndex(empresa => empresa.nome === nomeEditado);
    if (empresaIndex > -1) {
        empresas[empresaIndex] = {
            nome: linha.cells[0].innerText,
            email: linha.cells[1].innerText,
            cnpj: linha.cells[2].innerText,
            endereco: linha.cells[3].innerText,
            cidade: linha.cells[4].innerText,
            telefone: linha.cells[5].innerText,
            senha: empresas[empresaIndex].senha // Manter a senha original
        };
        localStorage.setItem('empresas', JSON.stringify(empresas));
    }

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarEmpresa(this);
    };
}

// Função para excluir empresa/restaurante
function excluirEmpresa(botao) {
    const linha = botao.parentNode.parentNode;
    const nome = linha.cells[0].innerText;
    linha.remove();

    let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    empresas = empresas.filter(empresa => empresa.nome !== nome);

    localStorage.setItem('empresas', JSON.stringify(empresas));
}

// Função para buscar empresas na tabela
function buscarEmpresas() {
    const searchInput = document.getElementById('searchInputEmpresa');
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#tabela-empresas tbody tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let i = 0; i < cells.length - 1; i++) { 
            if (cells[i].textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }

        if (match) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para validar o cadastro da empresa/restaurante
function validarCadastroEmpresa() {
    let camposValidos = true;
    const alertas = document.querySelectorAll('#alertas-restaurante .labelValidacao');
    
    // Limpar alertas anteriores
    alertas.forEach(alerta => alerta.style.display = 'none');

    const nome = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;

    if (!nome || !email || !senha || !cnpj || !telefone) {
        document.getElementById('campoObrigatorio-restaurante').style.display = 'block';
        camposValidos = false;
    }

    // Validar senha
    if (senha.length < 8 || senha.length > 16) {
        document.getElementById('senhaTamanho-restaurante').style.display = 'block';
        camposValidos = false;
    }
    // Adicione mais validações conforme necessário

    return camposValidos;
}

function cadastrarRestaurante() {
    if (validarCadastroEmpresa()) {
        cadastrarEmpresa();
    }
}

// Adicionar o evento de busca no input de pesquisa
document.getElementById('searchInputEmpresa').addEventListener('input', buscarEmpresas);

// Carregar empresas ao abrir a página
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('lista-empresas.html')) {
        carregarEmpresas();
    }
});

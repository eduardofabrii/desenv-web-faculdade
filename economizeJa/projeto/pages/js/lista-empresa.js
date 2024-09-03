// Função para carregar e exibir as empresas na tabela
function carregarEmpresas() {
    const tabela = document.getElementById('tabela-empresas');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    // Recupera os dados do localStorage
    let empresas = JSON.parse(localStorage.getItem('empresas')) || [];

    // Adiciona uma linha na tabela para cada empresa
    empresas.forEach(empresa => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${empresa.nome}</td>
            <td>${empresa.email}</td>
            <td>${empresa.cnpj}</td>
            <td>${empresa.endereco}</td>
            <td>${empresa.cidade}</td>
            <td>${empresa.telefone}</td>
            <td>${empresa.acoes}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarEmpresa(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirEmpresa(this)">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para editar uma empresa
function editarEmpresa(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');
    
    // Permite edição in-line
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { // Não permite edição da última coluna (Ações)
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        salvarEdicaoEmpresa(linha);
    };
}

// Função para salvar a edição de uma empresa
function salvarEdicaoEmpresa(linha) {
    const inputs = linha.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarEmpresa(this);
    };

    // Atualiza o localStorage
    atualizarEmpresas();
}

// Função para excluir uma empresa
function excluirEmpresa(botao) {
    const linha = botao.parentNode.parentNode;
    const email = linha.cells[1].innerText;  // Usando o email como identificador único
    linha.remove();

    // Atualizar o localStorage
    let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    empresas = empresas.filter(empresa => empresa.email !== email);
    localStorage.setItem('empresas', JSON.stringify(empresas));
}

// Função para atualizar os dados das empresas no localStorage
function atualizarEmpresas() {
    const tabela = document.getElementById('tabela-empresas');
    const linhas = tabela.getElementsByTagName('tr');
    let empresas = [];

    Array.from(linhas).forEach(linha => {
        const cells = linha.getElementsByTagName('td');
        if (cells.length > 0) { // Verifica se a linha tem células
            const empresa = {
                nome: cells[0].innerText,
                email: cells[1].innerText,
                cnpj: cells[2].innerText,
                endereco: cells[3].innerText,
                telefone: cells[4].innerText,
            };
            empresas.push(empresa);
        }
    });

    localStorage.setItem('empresas', JSON.stringify(empresas));
}

// Chama a função para carregar as empresas quando a página é carregada
window.onload = carregarEmpresas;

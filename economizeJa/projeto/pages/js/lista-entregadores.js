// Função para carregar e exibir os motoboys na tabela
function carregarMotoboys() {
    const tabela = document.getElementById('tabela-motoboys');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    // Recupera os dados do localStorage
    let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];

    // Adiciona uma linha na tabela para cada motoboy
    motoboys.forEach(motoboy => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${motoboy.nome}</td>
            <td>${motoboy.email}</td>
            <td>${motoboy.senha}</td>
            <td>${motoboy.cpf}</td>
            <td>${motoboy.placa}</td>
            <td>${motoboy.cnh}</td>
            <td>${motoboy.telefone}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarMotoboy(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirMotoboy(this)">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para editar um motoboy
function editarMotoboy(botao) {
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
        salvarEdicao(linha);
    };
}

// Função para salvar a edição de um motoboy
function salvarEdicao(linha) {
    const inputs = linha.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarMotoboy(this);
    };

    // Atualiza o localStorage
    atualizarMotoboys();
}

// Função para excluir um motoboy
function excluirMotoboy(botao) {
    const linha = botao.parentNode.parentNode;
    const email = linha.cells[1].innerText;  // Usando o email como identificador único
    linha.remove();

    // Atualizar o localStorage
    let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
    motoboys = motoboys.filter(motoboy => motoboy.email !== email);
    localStorage.setItem('motoboys', JSON.stringify(motoboys));
}

// Função para atualizar os dados dos motoboys no localStorage
function atualizarMotoboys() {
    const tabela = document.getElementById('tabela-motoboys');
    const linhas = tabela.getElementsByTagName('tr');
    let motoboys = [];

    Array.from(linhas).forEach(linha => {
        const cells = linha.getElementsByTagName('td');
        if (cells.length > 0) { // Verifica se a linha tem células
            const motoboy = {
                nome: cells[0].innerText,
                email: cells[1].innerText,
                senha: cells[2].innerText,
                cpf: cells[3].innerText,
                placa: cells[4].innerText,
                cnh: cells[5].innerText,
                telefone: cells[6].innerText,
            };
            motoboys.push(motoboy);
        }
    });

    localStorage.setItem('motoboys', JSON.stringify(motoboys));
}

// Chama a função para carregar os motoboys quando a página é carregada
window.onload = carregarMotoboys;

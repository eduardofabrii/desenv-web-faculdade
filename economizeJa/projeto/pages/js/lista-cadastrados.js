// Função para carregar e exibir os usuários na tabela
function carregarUsuarios() {
    const tabela = document.getElementById('tabela-usuarios');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    // Recupera os dados do localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Adiciona uma linha na tabela para cada usuário
    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.cpf}</td>
            <td>${usuario.telefone}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarUsuario(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirUsuario(this)">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para editar um usuário
function editarUsuario(botao) {
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
        salvarEdicaoUsuario(linha);
    };
}

// Função para salvar a edição de um usuário
function salvarEdicaoUsuario(linha) {
    const inputs = linha.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarUsuario(this);
    };

    // Atualiza o localStorage
    atualizarUsuarios();
}

// Função para excluir um usuário
function excluirUsuario(botao) {
    const linha = botao.parentNode.parentNode;
    const email = linha.cells[1].innerText;  // Usando o email como identificador único
    linha.remove();

    // Atualizar o localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.filter(usuario => usuario.email !== email);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Função para atualizar os dados dos usuários no localStorage
function atualizarUsuarios() {
    const tabela = document.getElementById('tabela-usuarios');
    const linhas = tabela.getElementsByTagName('tr');
    let usuarios = [];

    Array.from(linhas).forEach(linha => {
        const cells = linha.getElementsByTagName('td');
        if (cells.length > 0) { // Verifica se a linha tem células
            const usuario = {
                nome: cells[0].innerText,
                email: cells[1].innerText,
                cpf: cells[2].innerText,
                telefone: cells[3].innerText,
            };
            usuarios.push(usuario);
        }
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Chama a função para carregar os usuários quando a página é carregada
window.onload = carregarUsuarios;

function obterValorInput() {
    // Obter os valores dos inputs
    const nome1 = document.getElementById('nome-usuario').value;
    const email1 = document.getElementById('email-usuario').value;
    const cpf1= document.getElementById('cpf-usuario').value;
    const endereco1 = document.getElementById('endereco-usuario').value;
    const cidade1 = document.getElementById('cidade-usuario').value;
    const telefone1 = document.getElementById('telefone-usuario').value;
    const senha1 = document.getElementById('senha-usuario').value;
  
    // Verificar se todos os campos estão preenchidos
    if (nome1 && email1 && cpf1 && endereco1 && cidade1 && telefone1 && senha1) {
        
        // Armazenar os dados no localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push({ nome1, email1, cpf1, endereco1, cidade1, telefone1, senha1 });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
        //Direcionar para a pagina perfil, mas sem abrir a pagina 
        window.open('perfil.html', '_self');
    } 
}

  // Função para carregar os dados armazenados na tabela
  function carregarUsuariosPerfil() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const tabelaUsuarios = document.getElementById('tabela-usuarios');
    
    tabelaUsuarios.innerHTML = '';
    
  
    usuarios.forEach(usuario => {
        const row = tabelaUsuarios.insertRow();
        row.insertCell(0).textContent = usuario.nome;
        row.insertCell(1).textContent = usuario.email;
        row.insertCell(2).textContent = usuario.cpf;
        row.insertCell(3).textContent = usuario.endereco;
        row.insertCell(4).textContent = usuario.cidade;
        row.insertCell(5).textContent = usuario.telefone;

        // Criando a célula de Ações com os botões de Editar e Excluir
        const acoesCell = row.insertCell(6);
        acoesCell.innerHTML = `
            <td class="Botoes">
            <button class="btn btn-warning btn-sm" onclick="editarUsuario(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirUsuario(this)">Sair Conta</button>
            </td>
        `;
    });
}

  function editarUsuario(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');
    
    // Exemplo simples: permite edição in-line
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


function salvarEdicao(linha) {
    const inputs = linha.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarUsuario(this);
    };
}


function excluirUsuario(botao) {
    alert('Tem certeza que deseja excluir sua conta?');
    // Remove a linha da tabela
    const linha = botao.parentNode.parentNode;
    const nome = linha.cells[0].innerText;  // Ou use outro identificador único, como CPF ou email
    linha.remove();

    // Carregar os dados do localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Filtrar para remover o usuário excluído
    usuarios = usuarios.filter(usuario => usuario.nome !== nome);

    // Atualizar o localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    window.open('home.html');
}

carregarUsuariosPerfil();
function mostrarFormulario(tipo) {
    const formularios = document.querySelectorAll('.form-container');
    formularios.forEach(form => form.style.display = 'none');
    
    document.getElementById(`form-${tipo}`).style.display = 'block';
  }

  function cadastrarUsuario() {
    // Obter os valores dos inputs
    const nome = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const cpf = document.getElementById('cpf-usuario').value;
    const endereco = document.getElementById('endereco-usuario').value;
    const cidade = document.getElementById('cidade-usuario').value;
    const telefone = document.getElementById('telefone-usuario').value;
    const senha = document.getElementById('senha-usuario').value;

    // Verificar se todos os campos estão preenchidos
    if (nome && email && cpf && endereco && cidade && telefone && senha) {
        
        // Montar o objeto para enviar à API
        const usuario = { nome, email, cpf, endereco, cidade, telefone, senha };

        // Fazer a requisição POST à API
        fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Usuário cadastrado com sucesso:', data);
            // Redirecionar para a página de lista de usuários
            window.open('lista-usuarios.html', '_blank');
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
        });

    } else {
        alert('Por favor, preencha todos os campos.');
    }
}
  
  // Função para carregar os dados armazenados na tabela
  function carregarUsuarios() {
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
            <button class="btn btn-warning btn-sm" onclick="editarUsuario(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirUsuario(this)">Excluir</button>
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
}

function buscarUsuarios() {
  const searchInput = document.getElementById('searchInput');
  const filter = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll('#tabela-usuarios tr');

  rows.forEach(row => {
      const cells = row.getElementsByTagName('td');
      let match = false;

      for (let i = 0; i < cells.length - 1; i++) { // Excluir a última coluna (ações)
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

document.getElementById('searchInput').addEventListener('input', buscarUsuarios);

carregarUsuarios();
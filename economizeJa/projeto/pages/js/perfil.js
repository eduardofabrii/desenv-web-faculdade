function obterValorInput() {
    const nome = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const cpf = document.getElementById('cpf-usuario').value;
    const telefone = document.getElementById('telefone-usuario').value;
    const senha = document.getElementById('senha-usuario').value;

    if (nome && email && cpf && telefone && senha) {
        const novoUsuario = { nome, email, cpf, telefone, senha };
        
        // Enviar dados para o backend usando Fetch API
        fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoUsuario),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                window.open('perfil.html', '_self'); // Redirecionar para a página de perfil
            }
        })
        .catch(error => {
            console.error('Erro ao adicionar usuário:', error);
        });
    }
}


  // Função para carregar os dados armazenados na tabela
  function carregarUsuariosPerfil() {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const tabelaUsuarios = document.getElementById('tabela-usuarios');
            tabelaUsuarios.innerHTML = '';
    
            usuarios.forEach(usuario => {
                const row = tabelaUsuarios.insertRow();
                row.insertCell(0).textContent = usuario.Nome;
                row.insertCell(1).textContent = usuario.Email;
                row.insertCell(2).textContent = usuario.CPF;
                row.insertCell(3).textContent = usuario.Telefone;
    
                const acoesCell = row.insertCell(4);
                acoesCell.innerHTML = `
                    <td class="Botoes">
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(this, '${usuario.CPF}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuario.CPF}')">Excluir Conta</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Erro ao carregar usuários:', error));
}


function editarUsuario(botao, cpf) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');
    
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { 
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        const inputs = linha.querySelectorAll('input');
        const nome = inputs[0].value;
        const email = inputs[1].value;
        const telefone = inputs[2].value;

        fetch(`/api/usuarios/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, telefone, senha: 'senhaNova' }) // Mude 'senhaNova' conforme necessário
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                carregarUsuariosPerfil(); // Recarregar a tabela após a edição
            }
        })
        .catch(error => console.error('Erro ao editar usuário:', error));
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


function excluirUsuario(cpf) {
    if (confirm('Tem certeza que deseja excluir sua conta?')) {
        fetch(`/api/usuarios/${cpf}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                carregarUsuariosPerfil(); // Recarregar a tabela após a exclusão
            }
        })
        .catch(error => console.error('Erro ao excluir usuário:', error));
    }
}


carregarUsuariosPerfil();
// Função para carregar os dados do usuário logado
function carregarUsuarioLogado(cpfUsuario) {
    fetch(`/api/usuarios/${cpfUsuario}`) // Buscar os dados do usuário pelo CPF
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuário não encontrado.');
            }
            return response.json();
        })
        .then(usuarioLogado => {
            const tabelaUsuarios = document.getElementById('tabela-usuarios');
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

            if (usuarioLogado) {
                const row = tabelaUsuarios.insertRow();
                row.insertCell(0).textContent = usuarioLogado.Nome;
                row.insertCell(1).textContent = usuarioLogado.Email;
                row.insertCell(2).textContent = usuarioLogado.CPF;
                row.insertCell(3).textContent = usuarioLogado.Telefone;

                const acoesCell = row.insertCell(4);
                acoesCell.innerHTML = `
                    <td class="Botoes">
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(this, '${usuarioLogado.CPF}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuarioLogado.CPF}')">Excluir Conta</button>
                    </td>
                `;
            } else {
                alert('Usuário não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar usuário:', error);
            alert(error.message); // Mostra a mensagem de erro
            window.location.href = 'login.html'; // Redireciona para a página de login se houver erro
        });
}

function editarUsuario(botao, cpf) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');

    if (!linha || colunas.length === 0) {
        console.error("Linha ou colunas não encontradas");
        return; // Impede que o código continue se a linha ou colunas não existirem
    }

    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { 
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        const inputs = linha.querySelectorAll('input');
        const nome = inputs[0].value.trim(); // .trim() para remover espaços em branco
        const email = inputs[1].value.trim();
        const telefone = inputs[2].value.trim();
        const senha = 'senhaNova'; // Mude 'senhaNova' conforme necessário

        // Verifica se todos os campos estão preenchidos
        if (!nome || !email || !telefone || !senha) {
            alert('Nome, email, telefone e senha são obrigatórios!');
            return; // Impede o envio se os campos estiverem vazios
        }

        fetch(`/api/usuarios/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, telefone, senha })
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


// Função para excluir usuário
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
                // Reinicializa a sessão
                fetch('/api/sessao/reiniciar', {
                    method: 'POST', // ou 'GET', dependendo do seu endpoint
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao reinicializar a sessão.');
                    }
                    // Redireciona para a página de login
                    window.location.href = 'login.html'; // Ou a página que você preferir
                })
                .catch(error => {
                    console.error('Erro ao reinicializar sessão:', error);
                });
            }
        })
        .catch(error => console.error('Erro ao excluir usuário:', error));
    }
}



// Carregar os dados do usuário na sessão ao carregar a página
window.onload = function() {
    fetch('/api/sessao')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Adicione este log
            if (data.usuarioLogado && data.usuarioLogado.CPF) {
                carregarUsuarioLogado(data.usuarioLogado.CPF);
            }
        })
        .catch(error => {
            console.error('Erro ao verificar sessão:', error);
            alert('Erro ao verificar sessão.');
            window.location.href = 'login.html';
        });
};

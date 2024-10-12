// Função para carregar os dados dos usuários
function carregarUsuarios(filtro = '') {
    fetch('/api/usuarios') // Ajuste a URL conforme sua API
        .then(response => response.json())
        .then(usuarios => {
            const tabelaUsuarios = document.getElementById('tabela-usuarios');
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

            usuarios.forEach(usuario => {
                // Filtra os usuários com base na seleção
                if (filtro === '' || usuario.tipo === filtro) {
                    const row = tabelaUsuarios.insertRow();
                    row.insertCell(0).textContent = usuario.nome;
                    row.insertCell(1).textContent = usuario.email;
                    row.insertCell(2).textContent = usuario.cpf;
                    row.insertCell(3).textContent = usuario.endereco;
                    row.insertCell(4).textContent = usuario.cidade;
                    row.insertCell(5).textContent = usuario.telefone;

                    const acoesCell = row.insertCell(6);
                    acoesCell.innerHTML = `
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${usuario.cpf}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuario.cpf}')">Excluir</button>
                    `;
                }
            });
        })
        .catch(error => console.error('Erro ao carregar usuários:', error));
}

// Filtra usuários conforme seleção
document.getElementById('filterSelect').addEventListener('change', function() {
    const filtro = this.value;
    carregarUsuarios(filtro);
});

// Carrega todos os usuários ao iniciar
window.onload = function() {
    carregarUsuarios();
};

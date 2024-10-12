// Essa funcao so funciona para TODOS OS TIPOS - ja que no BD nao tem como filtrar por TIPO 
function carregarUsuarios(filtro = '') {
    fetch('/api/usuarios') // Ajuste a URL conforme sua API
        .then(response => response.json())
        .then(usuarios => {
            const tabelaUsuarios = document.getElementById('tabela-usuarios');
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

            usuarios.forEach(usuario => {
                // Filtra os usuários com base na seleção
                if (filtro === '' || usuario.Tipo === filtro) { // Assumindo que você tem um campo 'Tipo'
                    const row = tabelaUsuarios.insertRow();
                    row.insertCell(0).textContent = usuario.Nome; // Usando "Nome" com N maiúsculo
                    row.insertCell(1).textContent = usuario.Email; // Usando "Email" com E maiúsculo
                    row.insertCell(2).textContent = usuario.CPF; // Usando "CPF" com C maiúsculo
                    row.insertCell(3).textContent = usuario.Telefone; // Usando "Telefone" com T maiúsculo

                    const acoesCell = row.insertCell(4);
                    acoesCell.innerHTML = `
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${usuario.CPF}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuario.CPF}')">Excluir</button>
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
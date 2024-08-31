document.addEventListener('DOMContentLoaded', function() {
    function carregarUsuarios() {
        const tabela = document.getElementById('tabela-usuarios');
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Limpar a tabela antes de adicionar novos dados
        tabela.innerHTML = '';

        // Adicionar cada usuário à tabela
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cpf}</td>
                <td>${usuario.endereco}</td>
                <td>${usuario.cidade}</td>
                <td>${usuario.telefone}</td>
                <td class="action-icons">
                    <i class="fas fa-edit" title="Editar" onclick="editarUsuario('${usuario.email}')"></i>
                    <i class="fas fa-trash" title="Apagar" onclick="apagarUsuario('${usuario.email}')"></i>
                </td>
            `;

            tabela.appendChild(row);
        });
    }

    window.editarUsuario = function(email) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email);
        
        if (usuario) {
            document.getElementById('email-editar').value = usuario.email;
            document.getElementById('nome-editar').value = usuario.nome;
            document.getElementById('cpf-editar').value = usuario.cpf;
            document.getElementById('endereco-editar').value = usuario.endereco;
            document.getElementById('cidade-editar').value = usuario.cidade;
            document.getElementById('telefone-editar').value = usuario.telefone;

            document.getElementById('formulario-edicao').style.display = 'block';
        }
    }

    window.apagarUsuario = function(email) {
        if (confirm(`Tem certeza que deseja apagar o usuário com email: ${email}?`)) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios = usuarios.filter(usuario => usuario.email !== email);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            carregarUsuarios();
        }
    }

    function salvarEdicao(event) {
        event.preventDefault();

        const email = document.getElementById('email-editar').value;
        const nome = document.getElementById('nome-editar').value;
        const cpf = document.getElementById('cpf-editar').value;
        const endereco = document.getElementById('endereco-editar').value;
        const cidade = document.getElementById('cidade-editar').value;
        const telefone = document.getElementById('telefone-editar').value;

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        usuarios = usuarios.map(usuario => {
            if (usuario.email === email) {
                return {
                    nome: nome,
                    email: email,
                    cpf: cpf,
                    endereco: endereco,
                    cidade: cidade,
                    telefone: telefone
                };
            }
            return usuario;
        });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        carregarUsuarios();
        document.getElementById('formulario-edicao').style.display = 'none';
    }

    document.getElementById('form-editar').addEventListener('submit', salvarEdicao);

    document.getElementById('cancelar-edicao').addEventListener('click', function() {
        document.getElementById('formulario-edicao').style.display = 'none';
    });

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
});
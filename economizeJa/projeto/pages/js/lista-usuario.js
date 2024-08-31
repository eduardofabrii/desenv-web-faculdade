document.addEventListener("DOMContentLoaded", function () {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const tabelaUsuarios = document.getElementById('tabela-usuarios');

    if (usuarios.length === 0) {
        const row = tabelaUsuarios.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = "Nenhum usuário cadastrado.";
    } else {
        usuarios.forEach(function (usuario) {
            const row = tabelaUsuarios.insertRow();

            const nomeCell = row.insertCell(0);
            const emailCell = row.insertCell(1);
            const cpfCell = row.insertCell(2);
            const telefoneCell = row.insertCell(3);

            nomeCell.textContent = usuario.nome;
            emailCell.textContent = usuario.email;
            cpfCell.textContent = usuario.cpf;
            telefoneCell.textContent = usuario.telefone;
        });
    }
});

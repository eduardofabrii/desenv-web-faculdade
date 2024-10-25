// Frontend - Código de login atualizado
document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const cpf = document.getElementById('cpf').value.trim(); // Trim para remover espaços
    const senha = document.getElementById('senha').value;

    // Validação dos campos
    if (!tipoUsuario || !cpf || !senha) {
        document.getElementById('campoObrigatorio').style.display = 'block';
        return;
    } else {
        document.getElementById('campoObrigatorio').style.display = 'none';
    }

    const endpoint = tipoUsuario === 'usuario' ? '/api/login/usuario' : '/api/login/motoboy'; // Definindo a rota

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, senha }), // Enviando CPF e senha
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao fazer login.');
        }

        const data = await response.json();
        console.log('Login bem-sucedido:', data);

        // Verifica se o CPF é o do administrador
        const adminCpf = '123.456.789'; // Substitua pelo CPF do admin
        if (cpf === adminCpf) {
            // Redireciona para a página do administrador
            window.location.href = 'paginaAdmin.html';
            return;
        }

        // Armazena os dados no Local Storage de acordo com o tipo de usuário
        localStorage.setItem(tipoUsuario === 'usuario' ? 'usuarioLogado' : 'motoboyLogado', JSON.stringify(data));

        // Redireciona para a página de perfil após o login bem-sucedido
        window.location.href = tipoUsuario === 'usuario' ? 'home-logado.html' : 'homeEntregador.html';
    } catch (error) {
        console.error('Erro:', error.message);
        alert('CPF ou senha inválidos!'); // Mensagem de erro
    }
});

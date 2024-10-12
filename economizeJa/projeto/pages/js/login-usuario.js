document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const cpf = document.getElementById('cpf-usuario').value;
    const senha = document.getElementById('senha-usuario').value;

    if (!cpf || !senha) {
        document.getElementById('campoObrigatorio').style.display = 'block';
        return;
    } else {
        document.getElementById('campoObrigatorio').style.display = 'none';
    }

    console.log('Dados do login:', { cpf, senha }); // Log dos dados enviados

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, senha }),
        });

        // Verifique se a resposta é OK
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro de resposta:', errorData); // Log da resposta de erro
            throw new Error(errorData.message || 'Erro ao fazer login.');
        }

        const data = await response.json();
        console.log('Login bem-sucedido:', data);
        
        // Armazena o CPF e o nome do usuário no Local Storage
        localStorage.setItem('usuarioLogado', JSON.stringify(data));

        // Redireciona para a página de perfil após o login bem-sucedido
        window.location.href = 'perfil.html';
    } catch (error) {
        console.error('Erro:', error.message);
        alert('CPF ou senha inválidos!');
    }
});
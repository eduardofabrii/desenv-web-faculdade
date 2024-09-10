const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());



app.use(express.static('./pages'));



const USERS_FILE = path.join(__dirname, 'usuarios.json');

// Função para ler usuários do arquivo JSON
const readUsersFromFile = () => {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
};

// Função para escrever usuários no arquivo JSON
const writeUsersToFile = (usuarios) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2), 'utf8');
};

// Rota POST para adicionar um novo usuário
app.post('/api/usuarios', (req, res) => {
    const usuario = req.body;

    if (!usuario.nome || !usuario.email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios!' });
    }

    const usuarios = readUsersFromFile();
    usuario.id = usuarios.length + 1; // Atribuir um ID único ao novo usuário
    usuarios.push(usuario);
    writeUsersToFile(usuarios);

    res.status(201).json(usuarios);
});

// Rota GET para listar todos os usuários
app.get('/api/usuarios', (req, res) => {
    const usuarios = readUsersFromFile();
    res.status(200).json(usuarios);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Rota DELETE para excluir um usuário pelo CPF
app.delete('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    let usuarios = readUsersFromFile();

    // Filtrar para remover o usuário cujo CPF corresponde ao enviado na requisição
    const novosUsuarios = usuarios.filter(usuario => usuario.cpf !== cpf);

    if (usuarios.length === novosUsuarios.length) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Escrever a nova lista de usuários no arquivo JSON
    writeUsersToFile(novosUsuarios);

    res.status(200).json({ message: 'Usuário excluído com sucesso!' });
});

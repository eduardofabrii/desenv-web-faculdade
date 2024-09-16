const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('./pages'));

const USERS_FILE = path.join(__dirname, 'usuarios.json');
const SUGESTIONS_FILE = path.join(__dirname, 'sugestions.json');

// Função para ler usuários do arquivo JSON
const readUsersFromFile = () => {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
};

// Função para ler sugestões do arquivo JSON
const readSugestionsFromFile = () => {
    if (fs.existsSync(SUGESTIONS_FILE)) {
        const data = fs.readFileSync(SUGESTIONS_FILE, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
};

// Função para escrever sugestões no arquivo JSON
const writeSugestionsToFile = (sugestions) => {
    fs.writeFileSync(SUGESTIONS_FILE, JSON.stringify(sugestions, null, 2), 'utf8'); // Corrigido: SUGESTIONS_FILE em vez de USERS_FILE
};

// Função para escrever usuários no arquivo JSON
const writeUsersToFile = (usuarios) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2), 'utf8');
};

// Rota POST para adicionar uma nova sugestão
app.post('/api/sugestoes', (req, res) => {
    const { sugestion } = req.body; // Recebe a sugestão do body

    if (!sugestion) {
        return res.status(400).json({ error: 'Sugestão é obrigatória!' });
    }

    const sugestionlist = readSugestionsFromFile(); // Lê o arquivo de sugestões existente
    sugestionlist.push({ sugestion, date: new Date().toISOString() }); // Adiciona a nova sugestão com uma data

    writeSugestionsToFile(sugestionlist); // Escreve a nova lista de sugestões no arquivo

    res.status(201).json(sugestionlist); // Retorna a lista atualizada de sugestões
});

// Rota GET para listar todas as sugestões
app.get('/api/sugestoes', (req, res) => {
    const sugestionlist = readSugestionsFromFile();
    res.status(200).json(sugestionlist);
});

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

// Rota PUT para atualizar um usuário pelo CPF
app.put('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const usuarioAtualizado = req.body;

    if (!usuarioAtualizado.nome || !usuarioAtualizado.email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios!' });
    }

    let usuarios = readUsersFromFile();

    // Encontrar o índice do usuário a ser atualizado
    const index = usuarios.findIndex(usuario => usuario.cpf === cpf);

    if (index === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Atualizar o usuário
    usuarios[index] = usuarioAtualizado;
    writeUsersToFile(usuarios);

    res.status(200).json(usuarios[index]);
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
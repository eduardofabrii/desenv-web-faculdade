const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use(express.json());

app.use(express.static('./pages'));

<<<<<<< HEAD
const produtos = [];

const router = express.Router();
router.get('/api/produtos', (req, res) => {  
    console.log('entrou no get');
    res.status(200).json(produtos);
});
router.post('/api/produtos', (req, res) => {  
    console.log('entrou no post');
    console.log(req.body);

    var produto = req.body;
    produto.id = 1;

    produtos.push(produto);
    res.status(201).json(produto);
});

app.use(router);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
=======
// Caminho para o arquivo JSON onde os usuários serão armazenados
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
>>>>>>> 40e0a043a69686b6090b5cb7ed8a76078b6b8983

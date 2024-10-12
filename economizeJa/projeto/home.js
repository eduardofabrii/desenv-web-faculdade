const express = require('express');
const mysql = require('mysql');
const session = require('express-session'); // Adicionando o middleware de sessão
const cookieParser = require('cookie-parser'); // Adicionando o cookie-parser

const app = express();

app.use(express.json());
app.use(express.static('./pages'));
app.use(cookieParser()); // Usando o middleware de cookies

// Configuração da sessão
app.use(session({
    secret: 'seu-segredo', // Substitua por uma chave secreta forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Altere para true se usar HTTPS
}));

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'economizeja'
});

// Conexão com o banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// ROTA DE LOGIN
app.post('/api/login', (req, res) => {
    const { cpf, senha } = req.body;
    console.log('Tentativa de login:', cpf, senha); // Log do CPF e senha recebidos

    if (!cpf || !senha) {
        return res.status(400).json({ error: 'CPF e senha são obrigatórios!' });
    }

    // Consultar o banco de dados para verificar as credenciais
    connection.query('SELECT * FROM Usuario WHERE CPF = ? AND Senha = ?', [cpf, senha], (error, results) => {
        if (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: 'Erro ao tentar fazer login.' });
        }

        console.log('Resultados da consulta:', results); // Log dos resultados da consulta

        if (results.length > 0) {
            req.session.usuarioLogado = results[0]; // Armazena o usuário na sessão
            return res.status(200).json({ success: true, message: 'Login bem-sucedido' });
        } else {
            return res.status(401).json({ success: false, message: 'CPF ou senha inválidos!' });
        }
    });
});

// ROTA DE LOGOUT
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Erro ao tentar sair.' });
        }
        res.clearCookie('cpf'); // Remove o cookie de CPF ao sair
        res.json({ message: 'Logout bem-sucedido.' });
    });
});

// ROTAS DE USUÁRIOS

// ADICIONAR USUÁRIO
app.post('/api/usuarios', (req, res) => {
    const { nome, email, cpf, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
        return res.status(400).json({ error: 'Nome, email, cpf, telefone e senha são obrigatórios!' });
    }

    // Verificar se já existe um usuário com o mesmo CPF
    connection.query('SELECT * FROM Usuario WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Error checking CPF:', error);
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Já existe um usuário com o mesmo CPF!' });
        }

        // Inserir o novo usuário no banco de dados
        const query = 'INSERT INTO Usuario (Nome, Email, Senha, CPF, Telefone) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [nome, email, senha, cpf, telefone], (insertError, insertResults) => {
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).json({ error: 'Erro ao inserir usuário.' });
            }

            res.status(201).json({ message: 'Usuário adicionado com sucesso!', id: insertResults.insertId });
        });
    });
});

// GET para listar todos os usuários
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM Usuario';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }

        res.status(200).json(results);
    });
});

// GET para consultar usuário pelo CPF
app.get('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    if (!cpf) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }

    // Consultar o banco de dados
    connection.query('SELECT * FROM Usuario WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error); // Log do erro no console
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Retorna o primeiro resultado
        return res.json(results[0]);
    });
});

// Rota DELETE para excluir um usuário pelo CPF
app.delete('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    connection.query('DELETE FROM Usuario WHERE CPF = ?', [cpf], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    });
});

// ATUALIZAR UM USUÁRIO PELO CPF
app.put('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ error: 'Nome, email, telefone e senha são obrigatórios!' });
    }

    const query = 'UPDATE Usuario SET Nome = ?, Email = ?, Telefone = ?, Senha = ? WHERE CPF = ?';
    connection.query(query, [nome, email, telefone, senha, cpf], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    });
});

// ROTAS DE RESTAURANTES

// ADICIONAR RESTAURANTE
app.post('/api/restaurantes', (req, res) => {
    const { cnpj, nome_empresa, email, telefone, senha, nicho } = req.body;

    if (!cnpj || !nome_empresa || !email || !telefone || !senha || !nicho) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const query = 'INSERT INTO Restaurante (CNPJ, Nome_Empresa, Email, Telefone, Senha, Nicho) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [cnpj, nome_empresa, email, telefone, senha, nicho], (err, results) => {
        if (err) {
            console.error('Error inserting restaurant:', err);
            return res.status(500).json({ error: 'Erro ao adicionar restaurante.' });
        }

        res.status(201).json({ message: 'Restaurante adicionado com sucesso!', id: results.insertId });
    });
});

// ROTA DE LOGIN DO RESTAURANTE
app.post('/api/login-restaurante', (req, res) => {
    const { cnpj, senha } = req.body;

    if (!cnpj || !senha) {
        return res.status(400).json({ error: 'CNPJ e senha são obrigatórios!' });
    }

    connection.query('SELECT * FROM Restaurante WHERE CNPJ = ? AND Senha = ?', [cnpj, senha], (error, results) => {
        if (error) {
            console.error('Error during restaurant login:', error);
            return res.status(500).json({ error: 'Erro ao tentar fazer login.' });
        }

        if (results.length > 0) {
            req.session.restauranteLogado = results[0];
            return res.status(200).json({ success: true, message: 'Login bem-sucedido' });
        } else {
            return res.status(401).json({ success: false, message: 'CNPJ ou senha inválidos!' });
        }
    });
});

// GET para listar todos os restaurantes
app.get('/api/restaurantes', (req, res) => {
    const query = 'SELECT * FROM Restaurante';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching restaurants:', err);
            return res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
        }

        res.status(200).json(results);
    });
});

// ATUALIZAR UM RESTAURANTE PELO CNPJ
app.put('/api/restaurantes/:cnpj', (req, res) => {
    const cnpj = req.params.cnpj;
    const { nome_empresa, email, telefone, senha, nicho } = req.body;

    const query = 'UPDATE Restaurante SET Nome_Empresa = ?, Email = ?, Telefone = ?, Senha = ?, Nicho = ? WHERE CNPJ = ?';
    connection.query(query, [nome_empresa, email, telefone, senha, nicho, cnpj], (err, results) => {
        if (err) {
            console.error('Error updating restaurant:', err);
            return res.status(500).json({ error: 'Erro ao atualizar restaurante.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurante não encontrado!' });
        }

        res.status(200).json({ message: 'Restaurante atualizado com sucesso!' });
    });
});

// DELETE para excluir um restaurante pelo CNPJ
app.delete('/api/restaurantes/:cnpj', (req, res) => {
    const cnpj = req.params.cnpj;

    connection.query('DELETE FROM Restaurante WHERE CNPJ = ?', [cnpj], (err, results) => {
        if (err) {
            console.error('Error deleting restaurant:', err);
            return res.status(500).json({ error: 'Erro ao excluir restaurante.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurante não encontrado!' });
        }

        res.status(200).json({ message: 'Restaurante excluído com sucesso!' });
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

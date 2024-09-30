const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.static('./pages'));

// Configurar a conexão com o MySQL
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'economizeja'
});

// Conectar ao MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// Rota POST para adicionar uma nova sugestão
app.post('/api/sugestoes', (req, res) => {
    const { sugestion } = req.body; // Recebe a sugestão do body

    if (!sugestion) {
        return res.status(400).json({ error: 'Sugestão é obrigatória!' });
    }

    // Adicionar a sugestão ao banco de dados
    const query = 'INSERT INTO Sugestoes (sugestion, date) VALUES (?, ?)';
    connection.query(query, [sugestion, new Date().toISOString()], (err, results) => {
        if (err) {
            console.error('Error inserting suggestion:', err);
            return res.status(500).json({ error: 'Erro ao adicionar sugestão.' });
        }

        res.status(201).json({ id: results.insertId, sugestion, date: new Date().toISOString() });
    });
});

// Rota GET para listar todas as sugestões
app.get('/api/sugestoes', (req, res) => {
    const query = 'SELECT * FROM Sugestoes';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching suggestions:', err);
            return res.status(500).json({ error: 'Erro ao buscar sugestões.' });
        }

        res.status(200).json(results);
    });
});

// Rota POST para adicionar um novo usuário
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

// Rota GET para listar todos os usuários
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

// Rota DELETE para excluir um usuário pelo CPF
app.delete('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    // Excluir o usuário do banco de dados
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

// Rota PUT para atualizar um usuário pelo CPF
app.put('/api/usuarios/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ error: 'Nome, email, telefone e senha são obrigatórios!' });
    }

    // Atualizar o usuário no banco de dados
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

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

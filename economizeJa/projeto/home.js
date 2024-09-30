const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.static('./pages'));

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

// Rota DELETE para excluir um restaurante pelo CNPJ
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

// ATUALIZAR RESTAURANTE PELO CNPJ
app.put('/api/restaurantes/:cnpj', (req, res) => {
    const cnpj = req.params.cnpj;
    const { nome_empresa, email, telefone, senha, nicho } = req.body;

    if (!nome_empresa || !email || !telefone || !senha || !nicho) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

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

// ADICIONAR MOTOBOY
app.post('/api/motoboys', (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    if (!nome || !cpf || !telefone || !email || !senha) {
        return res.status(400).json({ error: 'Nome, CPF, telefone, email e senha são obrigatórios!' });
    }

    const query = 'INSERT INTO Motoboy (Nome, CPF, Telefone, Email, Senha) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nome, cpf, telefone, email, senha], (err, results) => {
        if (err) {
            console.error('Error inserting motoboy:', err);
            return res.status(500).json({ error: 'Erro ao adicionar motoboy.' });
        }

        res.status(201).json({ message: 'Motoboy adicionado com sucesso!', id: results.insertId });
    });
});

// GET para listar todos os motoboys
app.get('/api/motoboys', (req, res) => {
    const query = 'SELECT * FROM Motoboy';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching motoboys:', err);
            return res.status(500).json({ error: 'Erro ao buscar motoboys.' });
        }

        res.status(200).json(results);
    });
});

// Rota DELETE para excluir um motoboy pelo CPF
app.delete('/api/motoboys/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    connection.query('DELETE FROM Motoboy WHERE CPF = ?', [cpf], (err, results) => {
        if (err) {
            console.error('Error deleting motoboy:', err);
            return res.status(500).json({ error: 'Erro ao excluir motoboy.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Motoboy não encontrado!' });
        }

        res.status(200).json({ message: 'Motoboy excluído com sucesso!' });
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

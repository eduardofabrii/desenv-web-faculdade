const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');


const app = express();

app.use(express.json());
app.use(express.static('./pages'));
app.use(cookieParser());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'economizeja'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});



// ROTA PARA OBTER DADOS DA SESSÃO
app.get('/api/sessao', (req, res) => {
    if (req.session.usuarioLogado) {
        return res.status(200).json({ usuarioLogado: req.session.usuarioLogado });
    } else if (req.session.restauranteLogado) {
        return res.status(200).json({ restauranteLogado: req.session.restauranteLogado });
    } else if (req.session.motoboyLogado) {
        return res.status(200).json({ motoboyLogado: req.session.motoboyLogado });
    } else {
        return res.status(401).json({ message: 'Nenhum usuário logado.' });
    }
});





// ROTA PARA REINICIALIZAR A SESSÃO (similar ao logout)
app.post('/api/sessao/reiniciar', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao reinicializar sessão:', err);
            return res.status(500).json({ error: 'Erro ao reinicializar sessão.' });
        }
        res.clearCookie('cpf');
        res.status(200).json({ message: 'Sessão reinicializada com sucesso.' });
    });
});


// ROTA DE LOGIN DO USUÁRIO
app.post('/api/login/usuario', (req, res) => {
    const { cpf, senha } = req.body;
    console.log('Tentativa de login do usuário:', cpf);

    if (!cpf || !senha) {
        return res.status(400).json({ error: 'CPF e senha são obrigatórios!' });
    }

    connection.query('SELECT * FROM Usuario WHERE CPF = ? AND Senha = ?', [cpf, senha], (error, results) => {
        if (error) {
            console.error('Error during user login:', error);
            return res.status(500).json({ error: 'Erro ao tentar fazer login.' });
        }

        if (results.length > 0) {
            req.session.usuarioLogado = results[0];
            return res.status(200).json({ success: true, message: 'Login do usuário bem-sucedido' });
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
        res.clearCookie('cpf');
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

    connection.query('SELECT * FROM Usuario WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Error checking CPF:', error);
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Já existe um usuário com o mesmo CPF!' });
        }




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

    connection.query('SELECT * FROM Usuario WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

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

// ROTAS DE MOTOBOY

// ROTA DE LOGIN DO MOTOBOY
app.post('/api/login/motoboy', (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ error: 'CPF e senha são obrigatórios!' });
    }

    connection.query('SELECT * FROM Motoboy WHERE CPF = ? AND Senha = ?', [cpf, senha], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro ao buscar motoboy.' });
        }

        if (results.length > 0) {
            req.session.motoboyLogado = results[0]; // Salva as informações do motoboy na sessão
            return res.status(200).json({ success: true, message: 'Login do motoboy bem-sucedido' });
        } else {
            return res.status(401).json({ success: false, message: 'CPF ou senha inválidos!' });
        }
    });
});



// ADICIONAR MOTOBOY
app.post('/api/motoboys', (req, res) => {
    const { nome, cpf, senha, telefone } = req.body;

    if (!nome || !cpf || !senha || !telefone) {
        return res.status(400).json({ error: 'Nome, CPF, senha e telefone são obrigatórios!' });
    }

    connection.query('SELECT * FROM Motoboy WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Error checking CPF:', error);
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Já existe um motoboy com o mesmo CPF!' });
        }

        const query = 'INSERT INTO Motoboy (Nome, CPF, Senha, Telefone) VALUES (?, ?, ?, ?)';
        connection.query(query, [nome, cpf, senha, telefone], (insertError, insertResults) => {
            if (insertError) {
                console.error('Error inserting motoboy:', insertError);
                return res.status(500).json({ error: 'Erro ao inserir motoboy.' });
            }

            res.status(201).json({ message: 'Motoboy adicionado com sucesso!', id: insertResults.insertId });
        });
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

// GET para consultar motoboy pelo CPF
app.get('/api/motoboys/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    if (!cpf) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }

    connection.query('SELECT * FROM Motoboy WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro ao buscar motoboy.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Motoboy não encontrado.' });
        }

        return res.json(results[0]);
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

// ATUALIZAR UM MOTOBOY PELO CPF
app.put('/api/motoboys/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const { nome, telefone, senha } = req.body;

    if (!nome || !telefone || !senha) {
        return res.status(400).json({ error: 'Nome, telefone e senha são obrigatórios!' });
    }

    const query = 'UPDATE Motoboy SET Nome = ?, Telefone = ?, Senha = ? WHERE CPF = ?';
    connection.query(query, [nome, telefone, senha, cpf], (err, results) => {
        if (err) {
            console.error('Error updating motoboy:', err);
            return res.status(500).json({ error: 'Erro ao atualizar motoboy.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Motoboy não encontrado!' });
        }

        res.status(200).json({ message: 'Motoboy atualizado com sucesso!' });
    });
});

// RODAR O SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');




// Configuração do Multer para salvar imagens na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extensão da imagem
        const filename = Date.now() + ext; // Nome único para o arquivo
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use(express.static('./pages'));
app.use(cookieParser());
app.use(session({ 
    secret: 'seu-segredo-aqui',
    resave: false,
    saveUninitialized: true,
}));

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
    } else if (req.session.estabelecimentoLogado) {
        return res.status(200).json({ estabelecimentoLogado: req.session.estabelecimentoLogado });
    } else {
        return res.status(404).json({ message: 'Nenhum usuário logado.' });
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


const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '2ecab2324d3bbb',
        pass: 'bcf8f8d0052ae2'
    }
});

// Função para enviar o e-mail
const sendEmail = (to, subject, text) => {
    transporter.sendMail({
        from: 'jvitor@gmail.com',
        to: to,
        subject: subject,
        text: text
    }, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
};

// Rota para envio de e-mail individual
app.post('/api/sendEmail', (req, res) => {
    const { email, subject, text } = req.body;

    sendEmail(email, subject || 'Bem-vindo ao nosso serviço!', text || 'Obrigado por se cadastrar!');
    res.json({ message: 'E-mail enviado com sucesso!' });
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

// ADICIONAR USUÁRIO
app.post('/api/usuarios', (req, res) => {
    const { nome, email, cpf, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
        return res.status(400).json({ error: 'Nome, email, cpf, telefone e senha são obrigatórios!' });
    }

    connection.query('SELECT * FROM Usuario WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro ao verificar CPF:', error);
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Já existe um usuário com o mesmo CPF!' });
        }

        const query = 'INSERT INTO Usuario (Nome, Email, Senha, CPF, Telefone) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [nome, email, senha, cpf, telefone], (insertError, insertResults) => {
            if (insertError) {
                console.error('Erro ao inserir usuário:', insertError);
                return res.status(500).json({ error: 'Erro ao inserir usuário.' });
            }

            sendEmail(email, 'Bem-vindo ao nosso serviço!', 'Obrigado por se cadastrar!');
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
    const { nome, email, telefone } = req.body; // Não incluímos a senha aqui

    if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios!' });
    }

    const query = 'UPDATE Usuario SET Nome = ?, Email = ?, Telefone = ? WHERE CPF = ?';
    connection.query(query, [nome, email, telefone, cpf], (err, results) => {
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
            req.session.motoboyLogado = results[0];
            return res.status(200).json({ success: true, message: 'Login do motoboy bem-sucedido' });
        } else {
            return res.status(401).json({ success: false, message: 'CPF ou senha inválidos!' });
        }
    });
});

// ADICIONAR MOTOBOY
app.post('/api/motoboys', (req, res) => {
    const { nome, email, cpf, senha, telefone, placa, cnh } = req.body;

    if (!nome || !email || !cpf || !senha || !telefone || !placa || !cnh) {
        return res.status(400).json({ error: 'Nome, CPF, senha e telefone são obrigatórios!' });
    }

    connection.query('SELECT * FROM Motoboy WHERE CPF = ?', [cpf], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Já existe um motoboy com o mesmo CPF!' });
        }

        const query = 'INSERT INTO Motoboy (Nome, Email, CPF, Senha, Telefone, Placa, CNH) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [nome, email, cpf, senha, telefone, placa, cnh], (insertError, insertResults) => {
            if (insertError) {
                console.error('Erro ao inserir motoboy:', insertError);
                return res.status(500).json({ error: 'Erro ao inserir motoboy.' });
            }

            res.status(201).json({ message: 'Motoboy adicionado com sucesso!', id: insertResults.insertId });
        });
    });
});

app.get('/api/motoboys', (req, res) => {
    const query = 'SELECT * FROM Motoboy';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar motoboys:', err);
            return res.status(500).json({ error: 'Erro ao buscar motoboys.' });
        }

        console.log(results); // Verifique o conteúdo de `results` aqui
        res.status(200).json(results);
    });
});


// ROTA PARA CONSULTAR MOTOBOY PELO CPF
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

// ROTA PARA ATUALIZAR UM MOTOBOY PELO CPF
app.put('/api/motoboys/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const { nome, email, telefone, senha, placa, cnh } = req.body; // Incluímos placa e cnh

    if (!nome || !email || !telefone || !senha || !placa || !cnh) {
        return res.status(400).json({ error: 'Nome, telefone, senha, placa e CNH são obrigatórios!' });
    }

    const query = 'UPDATE Motoboy SET Nome = ?, Email = ?, Telefone = ?, Senha = ?, Placa = ?, CNH = ? WHERE CPF = ?';
    connection.query(query, [nome, email, telefone, senha, placa, cnh, cpf], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar motoboy:', err);
            return res.status(500).json({ error: 'Erro ao atualizar motoboy.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Motoboy não encontrado!' });
        }

        res.status(200).json({ message: 'Motoboy atualizado com sucesso!' });
    });
});


// ROTA PARA EXCLUIR UM MOTOBOY PELO CPF
app.delete('/api/motoboys/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    connection.query('DELETE FROM Motoboy WHERE CPF = ?', [cpf], (err, results) => {
        if (err) {
            console.error('Erro ao excluir motoboy:', err);
            return res.status(500).json({ error: 'Erro ao excluir motoboy.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Motoboy não encontrado!' });
        }

        res.status(200).json({ message: 'Motoboy excluído com sucesso!' });
    });
});

app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        console.error('Nenhuma imagem foi carregada.');
        return res.status(400).json({ error: 'A imagem é obrigatória!' });
    }

    console.log('Arquivo recebido:', req.file); // Verifique os dados do arquivo

    const { Nome, Descricao, Nicho, Preco } = req.body;
    const imagemUrl = req.file ? req.file.path : null;

    if (!Nome || !Descricao || !Nicho || !Preco) {
        return res.status(400).json({ error: 'Nome, descrição, categoria e preço são obrigatórios!' });
    }

    const query = 'INSERT INTO Produtos (Nome, Descricao, Nicho, Preco, Imagem) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [Nome, Descricao, Nicho, Preco, imagemUrl], (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return res.status(500).json({ error: 'Erro ao inserir produto.' });
        }
        return res.status(201).json({ message: 'Produto adicionado com sucesso!', id: results.insertId });
    });
});


// Rota para consultar todos os produtos (GET)
app.get('/api/produtos', (req, res) => {
    const query = 'SELECT * FROM Produtos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }
        res.status(200).json(results);
    });
});

// Rota para consultar todos os produtos (GET)
app.get('/api/produtos', (req, res) => {
    const query = 'SELECT * FROM Produtos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }

        // Para cada produto, verifica se há uma imagem e cria uma URL relativa
        results.forEach((produto) => {
            if (produto.Imagem) {
                produto.Imagem = `http://localhost:3000/${produto.Imagem}`; 
            }
        });

        res.status(200).json(results);
    });
});

// Rota para atualizar produto (PUT)
app.put('/api/produtos/:id', (req, res) => {
    const produtoId = req.params.id;
    const { Nome, Descricao, Preco } = req.body;

    if (!Nome || !Descricao || !Preco) {
        return res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios!' });
    }

    // Query SQL para atualizar o produto
    const query = 'UPDATE Produtos SET Nome = ?, Descricao = ?, Preco = ? WHERE ID_Produtos = ?';
    
    connection.query(query, [Nome, Descricao, Preco, produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).json({ error: 'Erro ao atualizar produto.' });
        }

        // Verifica se o produto foi encontrado e atualizado
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    });
});

// Rota para excluir produto (DELETE)
app.delete('/api/produtos/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM Produtos WHERE ID_Produtos = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return res.status(500).json({ error: 'Erro ao excluir produto.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado!' });
        }

        res.status(200).json({ message: 'Produto excluído com sucesso!' });
    });
});
// Rota para login de estabelecimento
app.post('/api/login/estabelecimentos', (req, res) => {
    const { cnpj, senha } = req.body;

    if (!cnpj || !senha) {
        return res.status(400).json({ message: 'CNPJ e senha são obrigatórios!' });
    }

    const query = 'SELECT * FROM Estabelecimentos WHERE cnpj = ? AND senha = ?';
    connection.query(query, [cnpj, senha], (error, results) => {
        if (error) {
            console.error('Erro ao realizar login:', error);
            return res.status(500).json({ message: 'Erro ao realizar login.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'CNPJ ou senha inválidos.' });
        }
        res.json({ message: 'Login bem-sucedido!', estabelecimento: results[0] });
    });
});

// Rota para pegar todos os estabelecimentos
app.get('/api/estabelecimentos', (req, res) => {
    const query = 'SELECT * FROM Estabelecimentos';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar estabelecimentos:', err);
            return res.status(500).json({ error: 'Erro ao buscar estabelecimentos' });
        }
        res.json(results); // Retorna os dados para o frontend
    });
});


// Rota para cadastrar um novo estabelecimento
app.post('/api/estabelecimentos', (req, res) => {
    const { nome_empresa, email, cnpj, endereco, cidade, telefone, senha } = req.body;

    if (!nome_empresa || !email || !cnpj || !endereco || !cidade || !telefone || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const query = 'INSERT INTO Estabelecimentos(nome_empresa, email, cnpj, endereco, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nome_empresa, email, cnpj, endereco, cidade, telefone, senha], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar estabelecimento:', error);
            return res.status(500).json({ message: 'Erro ao cadastrar estabelecimento.' });
        }
        res.status(201).json({ id: results.insertId, nome_empresa });
    });
});

// Rota para editar um estabelecimento
app.put('/api/estabelecimentos/:ID_Estabelecimento', (req, res) => {
    const { ID_Estabelecimento } = req.params;
    const { nome_empresa, email, endereco, cidade, telefone } = req.body;

    const query = 'UPDATE Estabelecimentos SET nome_empresa = ?, email = ?, endereco = ?, cidade = ?, telefone = ? WHERE ID_Estabelecimento = ?';
    connection.query(query, [nome_empresa, email, endereco, cidade, telefone, ID_Estabelecimento], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar estabelecimento:', error);
            return res.status(500).json({ message: 'Erro ao atualizar estabelecimento.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Estabelecimento não encontrado.' });
        }
        res.json({ message: 'Estabelecimento atualizado com sucesso!' });
    });
});

// Rota para excluir um estabelecimento
app.delete('/api/estabelecimentos/:ID_Estabelecimento', (req, res) => {
    const { ID_Estabelecimento } = req.params;

    connection.query('DELETE FROM Estabelecimentos WHERE ID_Estabelecimento = ?', [ID_Estabelecimento], (error, results) => {
        if (error) {
            console.error('Erro ao excluir estabelecimento:', error);
            return res.status(500).json({ message: 'Erro ao excluir estabelecimento.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Estabelecimento não encontrado.' });
        }
        res.json({ message: 'Estabelecimento excluído com sucesso!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
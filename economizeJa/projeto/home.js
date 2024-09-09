var express = require('express');
var app = express();

app.use(express.json());

app.use(express.static('./pages'));

const usuarios = [];

const router = express.Router();
router.get('/api/usuarios' , (req, res) => {
    console.log('Entrou no GET')
    res.status(200).json(usuarios);
});

router.post('/api/usuarios' , (req, res) => {
    console.log('Entrou no POST')
    console.log(req.body);

    var usuario = req.body;
    res.status(201).json;
    usuario.id = 1;

    usuarios.push(usuario);
    res.status(201).json(usuarios);
});

app.use(router);

const port = 3000;

app.get('/hello', (req, res) => {
    res.send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});

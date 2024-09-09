var express = require('express');
var app = express();

app.use(express.static('./pages'));

const port = 3000;

app.get('/hello', (req, res) => {
    res.send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});

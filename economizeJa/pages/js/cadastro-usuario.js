function salvar() {
var nome = document.getElementById('nome').value;
var email = document.getElementById('email').value;
var cpf = document.getElementById('cpf').value;
var cores = document.getElementById('cores').value;
var telefone = document.getElementById('telefone').value;

console.log(nome);
console.log(email);
console.log(cpf);
console.log(cores);
console.log(telefone);

if (nome == "" || email == "" || cpf == "" || cores == "" || telefone == "") {
    alert("Preencha todos os campos");
    return false;
}

return false;
}
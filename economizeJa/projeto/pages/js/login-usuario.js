function validarLogin() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("cpf-usuario").value.trim();
    
    const campoObrigatorio = document.getElementById("campoObrigatorio");

    campoObrigatorio.style.display = "none";
    
    if (email === "" || senha === "") {
        campoObrigatorio.style.display = "block";
        return false;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuarioEncontrado) {
        window.open('pagina-inicial.html', '_blank');
    } else {
        alert("Email ou senha inválidos. Por favor, cadastre-se.");
        return false;
    }
}
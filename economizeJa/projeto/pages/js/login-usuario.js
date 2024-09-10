function validarLogin() {
    const senha = document.getElementById("senha-usuario").value.trim();
    const cpf = document.getElementById("cpf-usuario").value.trim();
    
    const campoObrigatorio = document.getElementById("campoObrigatorio");

    campoObrigatorio.style.display = "none";
    
    if (senha === "" || cpf === "") {
        campoObrigatorio.style.display = "block";
        return false;
    }

   
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(usuario => usuario.senha === senha && usuario.cpf === cpf);

    if (usuarioEncontrado) {
        
        window.open('homeUsuario.html', '_blank');
        
    } else {
        
        alert("Senha ou CPF inválidos. Por favor, cadastre-se.");
        return false;
    }
}



function validarLogin() {
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf-usuario").value.trim();
    
    const campoObrigatorio = document.getElementById("campoObrigatorio");

    campoObrigatorio.style.display = "none";
    
    if (email === "" || cpf === "") {
        campoObrigatorio.style.display = "block";
        return false;
    }

   
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.cpf === cpf);

    if (usuarioEncontrado) {
        
        window.open('home.html', '_blank');
        
    } else {
        
        alert("Email ou CPF inválidos. Por favor, cadastre-se.");
        return false;
    }
}

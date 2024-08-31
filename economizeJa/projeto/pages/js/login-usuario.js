function validarLogin() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    
    const campoObrigatorio = document.getElementById("campoObrigatorio");
    const senhaTamanho = document.getElementById("senhaTamanho");
    const senhaPadrao = document.getElementById("senhaPadrao");

    campoObrigatorio.style.display = "none";
    senhaTamanho.style.display = "none";
    senhaPadrao.style.display = "none";
    
    if (email === "" || senha === "") {
        campoObrigatorio.style.display = "block";
        return;
    }

    if (senha.length < 8 || senha.length > 16) {
        senhaTamanho.style.display = "block";
        return;
    }

    const regex = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
    if (!regex.test(senha)) {
        senhaPadrao.style.display = "block";
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioValido) {
        alert("Login bem-sucedido!");
        window.location.href = "index.html";
    } else {
        alert("Email ou senha inválidos.");
    }
}
// Função para mostrar o formulário correspondente ao tipo
function mostrarFormulario(tipo) {
  const formularios = document.querySelectorAll(".form-container");
  formularios.forEach(form => (form.style.display = "none"));
  document.getElementById(`form-${tipo}`).style.display = "block";
  switchImages(tipo);
}

// Função para trocar as imagens de fundo
function switchImages(tipo) {
  const img = document.getElementById("fundo");
  const images = {
    restaurante: "images/estabelecimento.jpg",
    motoboy: "images/img-motoboy.jpg",
    usuario: "images/frutasVermelhas.jpg"
  };
  img.src = images[tipo] || images.usuario; // Imagem padrão

  // Estilizar a imagem
  img.style.objectFit = "cover";
  img.style.width = "100vw";
  img.style.height = "100vh";
  img.style.position = "relative";
  img.style.top = "0";
  img.style.left = "0px";
}

// Adicionando eventos de clique para botões
document.getElementById("btn-restaurante").addEventListener("click", () => switchImages("restaurante"));
document.getElementById("btn-motoboy").addEventListener("click", () => switchImages("motoboy"));

// Função para cadastrar um usuário
function cadastrarUsuario() {
  const usuario = obterDadosUsuario();

  if (verificarCampos(usuario)) {
    salvarUsuarioLocalStorage(usuario);
    enviarUsuarioParaAPI(usuario);
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

// Função para obter os dados do usuário
function obterDadosUsuario() {
  return {
    nome: document.getElementById("nome-usuario").value,
    email: document.getElementById("email-usuario").value,
    cpf: document.getElementById("cpf-usuario").value,
    endereco: document.getElementById("endereco-usuario").value,
    cidade: document.getElementById("cidade-usuario").value,
    telefone: document.getElementById("telefone-usuario").value,
    senha: document.getElementById("senha-usuario").value,
  };
}

// Função para verificar se todos os campos estão preenchidos
function verificarCampos(usuario) {
  return Object.values(usuario).every(campo => campo !== "");
}

// Função para salvar o usuário no localStorage
function salvarUsuarioLocalStorage(usuario) {
  const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuariosLocal.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuariosLocal));
}

// Função para enviar o usuário para a API
function enviarUsuarioParaAPI(usuario) {
  fetch("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Usuário cadastrado com sucesso:", data);
    window.open("login.html", "_blank");
  })
  .catch(error => {
    console.error("Erro ao cadastrar o usuário:", error);
    alert("Ocorreu um erro ao cadastrar o usuário.");
  });
}

// Função para carregar os dados armazenados na tabela
function carregarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const tabelaUsuarios = document.getElementById("tabela-usuarios");
  tabelaUsuarios.innerHTML = "";

  usuarios.forEach(usuario => {
    const row = tabelaUsuarios.insertRow();
    Object.values(usuario).forEach((valor, index) => {
      row.insertCell(index).textContent = valor;
    });

    // Criando a célula de Ações com os botões de Editar e Excluir
    const acoesCell = row.insertCell(Object.values(usuario).length);
    acoesCell.innerHTML = `
      <button class="btn btn-warning btn-sm" onclick="editarUsuario(this)">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="excluirUsuario(this)">Excluir</button>
    `;
  });
}

// Função para editar um usuário
function editarUsuario(botao) {
  const linha = botao.closest("tr");
  const colunas = linha.querySelectorAll("td");

  colunas.forEach((coluna, index) => {
    if (index < colunas.length - 1) { // Não permite edição da última coluna (Ações)
      const conteudoAtual = coluna.innerText;
      coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
    }
  });

  botao.innerText = "Salvar";
  botao.onclick = () => salvarEdicao(linha);
}

// Função para salvar a edição de um usuário
function salvarEdicao(linha) {
  const inputs = linha.querySelectorAll("input");
  const usuarioAtualizado = {};

  inputs.forEach((input, index) => {
    usuarioAtualizado[index] === 2 // Mantemos o CPF como chave de identificação
      ? usuarioAtualizado.cpf = input.value
      : usuarioAtualizado[["nome", "email", "endereco", "cidade", "telefone"][index]] = input.value;
    linha.cells[index].innerText = input.value; // Atualiza a tabela
  });

  atualizarLocalStorage(usuarioAtualizado);
  linha.querySelector(".btn-warning").innerText = "Editar";
  linha.querySelector(".btn-warning").onclick = () => editarUsuario(this);
}

// Função para atualizar o localStorage
function atualizarLocalStorage(usuarioAtualizado) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const indexUsuario = usuarios.findIndex(usuario => usuario.cpf === usuarioAtualizado.cpf);

  if (indexUsuario !== -1) {
    usuarios[indexUsuario] = usuarioAtualizado;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

// Função para excluir um usuário
function excluirUsuario(botao) {
  const linha = botao.closest("tr");
  const cpf = linha.cells[2].innerText;

  fetch(`/api/usuarios/${cpf}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(data => {
    console.log("Usuário excluído com sucesso:", data);
    linha.remove();
    atualizarUsuariosLocalStorage(cpf);
  })
  .catch(error => {
    console.error("Erro ao excluir o usuário:", error);
    alert("Ocorreu um erro ao excluir o usuário.");
  });
}

// Função para atualizar o localStorage após exclusão
function atualizarUsuariosLocalStorage(cpf) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios = usuarios.filter(usuario => usuario.cpf !== cpf);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Função para buscar usuários na tabela
function buscarUsuarios() {
  const searchInput = document.getElementById("searchInput");
  const filter = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#tabela-usuarios tr");

  rows.forEach(row => {
    const cells = row.getElementsByTagName("td");
    const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
    row.style.display = match ? "" : "none";
  });
}

// Adicionando evento de busca
document.getElementById("searchInput").addEventListener("input", buscarUsuarios);

// Carregando usuários ao iniciar
carregarUsuarios();

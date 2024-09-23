function mostrarFormulario(tipo) {
  const formularios = document.querySelectorAll(".form-container");
  formularios.forEach((form) => (form.style.display = "none"));

  document.getElementById(`form-${tipo}`).style.display = "block";

  switchimages(tipo);
}

function switchimages(tipo) {
  var img = document.getElementById("fundo");
  var imgmoto = document.getElementById("fundo");

  // Troca a imagem com base no tipo
  if (tipo === "restaurante") {
    img.src = "images/estabelecimento.jpg";
  } else if (tipo === "motoboy") {
    imgmoto.src = "images/img-motoboy.jpg";
  } else if (tipo === "usuario") {
    img.src = "images/frutasVermelhas.jpg"; // Imagem padrão
  }

  // Assegura que a imagem cubra toda a área sem distorções
  imgmoto.style.objectFit = "cover";
  imgmoto.style.width = "100vw";
  imgmoto.style.height = "100vh";
  imgmoto.style.position = "relative";
  imgmoto.style.top = "0";
  imgmoto.style.left = "0px";
}

// Ajustando os eventos para passar o tipo correto
document
  .getElementById("btn-restaurante")
  .addEventListener("click", function () {
    switchimages("restaurante");
  });
document.getElementById("btn-motoboy").addEventListener("click", function () {
  switchimages("motoboy");
});

function cadastrarUsuario() {
  // Obter os valores dos inputs
  const nome = document.getElementById("nome-usuario").value;
  const email = document.getElementById("email-usuario").value;
  const cpf = document.getElementById("cpf-usuario").value;
  const endereco = document.getElementById("endereco-usuario").value;
  const cidade = document.getElementById("cidade-usuario").value;
  const telefone = document.getElementById("telefone-usuario").value;
  const senha = document.getElementById("senha-usuario").value;

  // Verificar se todos os campos estão preenchidos
  if (nome && email && cpf && endereco && cidade && telefone && senha) {
    // Montar o objeto para enviar à API e salvar no localStorage
    const usuario = { nome, email, cpf, endereco, cidade, telefone, senha };

    // Armazenar os dados no localStorage
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuariosLocal.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosLocal));

    // Fazer a requisição POST à API
    fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuário cadastrado com sucesso:", data);
        window.open("login.html", "_blank");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar o usuário:", error);
        alert("Ocorreu um erro ao cadastrar o usuário.");
      });
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

// Função para carregar os dados armazenados na tabela
function carregarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const tabelaUsuarios = document.getElementById("tabela-usuarios");

  tabelaUsuarios.innerHTML = "";

  usuarios.forEach((usuario) => {
    const row = tabelaUsuarios.insertRow();
    row.insertCell(0).textContent = usuario.nome;
    row.insertCell(1).textContent = usuario.email;
    row.insertCell(2).textContent = usuario.cpf;
    row.insertCell(3).textContent = usuario.endereco;
    row.insertCell(4).textContent = usuario.cidade;
    row.insertCell(5).textContent = usuario.telefone;

    // Criando a célula de Ações com os botões de Editar e Excluir
    const acoesCell = row.insertCell(6);
    acoesCell.innerHTML = `
        <button class="btn btn-warning btn-sm" onclick="editarUsuario(this)">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirUsuario(this)">Excluir</button>
    `;
  });
}

function editarUsuario(botao) {
  const linha = botao.parentNode.parentNode;
  const colunas = linha.querySelectorAll("td");

  // Exemplo simples: permite edição in-line
  colunas.forEach((coluna, index) => {
    if (index < colunas.length - 1) {
      // Não permite edição da última coluna (Ações)
      const conteudoAtual = coluna.innerText;
      coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
    }
  });

  botao.innerText = "Salvar";
  botao.onclick = function () {
    salvarEdicao(linha);
  };
}

function salvarEdicao(linha) {
  const inputs = linha.querySelectorAll("input");
  const usuarioAtualizado = {};

  inputs.forEach((input, index) => {
    const valorEditado = input.value;
    linha.cells[index].innerText = valorEditado;

    // Adicionar os dados editados ao objeto `usuarioAtualizado`
    switch (index) {
      case 0:
        usuarioAtualizado.nome = valorEditado;
        break;
      case 1:
        usuarioAtualizado.email = valorEditado;
        break;
      case 2:
        usuarioAtualizado.cpf = valorEditado; // Mantemos o CPF como chave de identificação
        break;
      case 3:
        usuarioAtualizado.endereco = valorEditado;
        break;
      case 4:
        usuarioAtualizado.cidade = valorEditado;
        break;
      case 5:
        usuarioAtualizado.telefone = valorEditado;
        break;
    }
  });

  // Atualizar o localStorage
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const indexUsuario = usuarios.findIndex(
    (usuario) => usuario.cpf === usuarioAtualizado.cpf
  );

  if (indexUsuario !== -1) {
    usuarios[indexUsuario] = usuarioAtualizado;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // Alterar o botão para 'Editar' novamente
  linha.querySelector(".btn-warning").innerText = "Editar";
  linha.querySelector(".btn-warning").onclick = function () {
    editarUsuario(this);
  };
}

function excluirUsuario(botao) {
  const linha = botao.parentNode.parentNode;
  const cpf = linha.cells[2].innerText;

  fetch(`/api/usuarios/${cpf}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Usuário excluído com sucesso:", data);
      linha.remove();

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios = usuarios.filter((usuario) => usuario.cpf !== cpf);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    })
    .catch((error) => {
      console.error("Erro ao excluir o usuário:", error);
      alert("Ocorreu um erro ao excluir o usuário.");
    });
}

function buscarUsuarios() {
  const searchInput = document.getElementById("searchInput");
  const filter = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#tabela-usuarios tr");

  rows.forEach((row) => {
    const cells = row.getElementsByTagName("td");
    let match = false;

    for (let i = 0; i < cells.length - 1; i++) {
      // Excluir a última coluna (ações)
      if (cells[i].textContent.toLowerCase().includes(filter)) {
        match = true;
        break;
      }
    }

    if (match) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

document
  .getElementById("searchInput")
  .addEventListener("input", buscarUsuarios);

carregarUsuarios();

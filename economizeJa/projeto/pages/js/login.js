function alterarInput() {
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const inputContainer = document.getElementById('inputCpfCnpj');
  
    if (tipoUsuario === 'estabelecimento') {
      inputContainer.innerHTML = `
        <label for="cnpj" class="form-label">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" class="form-control" required>
      `;
    } else {
      inputContainer.innerHTML = `
        <label for="cpf" class="form-label">CPF</label>
        <input type="text" id="cpf" name="cpf" class="form-control" required>
      `;
    }
  }
  document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const cpf = tipoUsuario === 'estabelecimento' ? null : document.getElementById('cpf').value.trim();
    const cnpj = tipoUsuario === 'estabelecimento' ? document.getElementById('cnpj').value.trim() : null;
    const senha = document.getElementById('senha').value;
  
    if (!tipoUsuario || (!cpf && !cnpj) || !senha) {
      document.getElementById('campoObrigatorio').style.display = 'block';
      return;
    } else {
      document.getElementById('campoObrigatorio').style.display = 'none';
    }
  
    const endpoint =
      tipoUsuario === 'usuario' ? '/api/login/usuario' :
      tipoUsuario === 'motoboy' ? '/api/login/motoboy' :
      '/api/login/estabelecimento';
  
    try {
      const body = tipoUsuario === 'estabelecimento' ? { cnpj, senha } : { cpf, senha };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login.');
      }
  
      const data = await response.json();
      console.log('Login bem-sucedido:', data);
  
      // Verifica se o CPF é do administrador
      const adminCpf = '123.456.789'; // Substitua pelo CPF do admin
      if (cpf === adminCpf) {
        window.location.href = 'paginaAdmin.html';
        return;
      }
  
      // Armazena os dados no Local Storage
      if (tipoUsuario === 'usuario') {
        localStorage.setItem('usuarioLogado', JSON.stringify(data));
        window.location.href = 'home-logado.html';
      } else if (tipoUsuario === 'motoboy') {
        localStorage.setItem('motoboyLogado', JSON.stringify(data));
        window.location.href = 'homeEntregador.html';
      } else if (tipoUsuario === 'estabelecimento') {
        localStorage.setItem('estabelecimentoLogado', JSON.stringify(data));
        window.location.href = 'homeEstabelecimento.html';
      }
    } catch (error) {
      console.error('Erro:', error.message);
      alert('CPF ou CNPJ e senha inválidos!');
    }
  });

  
  function switchImages() {
    const select = document.getElementById('tipoUsuario').value;
  
    if (select == "usuario"){
      document.getElementById("fundo").src = "images/frutasVermelhas.jpg";
    }
    else if (select == "motoboy"){
      document.getElementById("fundo").src = "images/img-motoboy.jpg";
    }
    else if (select == "estabelecimento"){
      document.getElementById("fundo").src = "images/estabelecimento.jpg";
    }
   
  }
  
  const select = document.getElementById('tipoUsuario');
  select.addEventListener('change', switchImages);
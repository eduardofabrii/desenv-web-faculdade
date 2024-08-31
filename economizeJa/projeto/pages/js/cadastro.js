function mostrarFormulario(tipo) {
    const opcoesCadastro = document.getElementById('opcoes-cadastro');
    const escolhaCadastro = document.getElementById('escolha-cadastro');
    const formularioUsuario = document.getElementById('form-usuario');
    const formularioMotoboy = document.getElementById('form-motoboy');
    const formularioRestaurante = document.getElementById('form-restaurante');
  
    opcoesCadastro.style.display = 'none';
    escolhaCadastro.style.display = 'none';
    formularioUsuario.style.display = 'none';
    formularioMotoboy.style.display = 'none';
    formularioRestaurante.style.display = 'none';
  
    if (tipo === 'usuario') {
      formularioUsuario.style.display = 'block';
    } else if (tipo === 'motoboy') {
      formularioMotoboy.style.display = 'block';
    } else if (tipo === 'restaurante') {
      formularioRestaurante.style.display = 'block';
    }
  }

  function validarPadraoSenha(event) {
    const senha = event.target.value;
    const senhaMinLength = 8;
    const senhaMaxLength = 16;
    const senhaRegex = /(?=.*[A-Z])(?=.*[\W_])/; // Pelo menos uma letra maiúscula e um caractere especial
  
    const alertasUsuario = document.getElementById('alertas-usuario');
    const alertasMotoboy = document.getElementById('alertas-motoboy');
    const alertasRestaurante = document.getElementById('alertas-restaurante');
  
    if (senha.length < senhaMinLength || senha.length > senhaMaxLength) {
      if (event.target.id.startsWith('senha-usuario')) {
        alertasUsuario.querySelector('#senhaTamanho-usuario').style.display = 'block';
      } else if (event.target.id.startsWith('senha-motoboy')) {
        alertasMotoboy.querySelector('#senhaTamanho-motoboy').style.display = 'block';
      } else if (event.target.id.startsWith('senha-restaurante')) {
        alertasRestaurante.querySelector('#senhaTamanho-restaurante').style.display = 'block';
      }
    } else {
      if (senhaRegex.test(senha)) {
        if (event.target.id.startsWith('senha-usuario')) {
          alertasUsuario.querySelector('#senhaPadrao-usuario').style.display = 'none';
        } else if (event.target.id.startsWith('senha-motoboy')) {
          alertasMotoboy.querySelector('#senhaPadrao-motoboy').style.display = 'none';
        } else if (event.target.id.startsWith('senha-restaurante')) {
          alertasRestaurante.querySelector('#senhaPadrao-restaurante').style.display = 'none';
        }
      } else {
        if (event.target.id.startsWith('senha-usuario')) {
          alertasUsuario.querySelector('#senhaPadrao-usuario').style.display = 'block';
        } else if (event.target.id.startsWith('senha-motoboy')) {
          alertasMotoboy.querySelector('#senhaPadrao-motoboy').style.display = 'block';
        } else if (event.target.id.startsWith('senha-restaurante')) {
          alertasRestaurante.querySelector('#senhaPadrao-restaurante').style.display = 'block';
        }
      }
    }
  }
  
  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }
  
  function validarTelefone(telefone) {
    const regexTelefone = /^\d{10,11}$/;
    return regexTelefone.test(telefone);
  }
  
  function validarCpf(cpf) {
    const regexCpf = /^\d{11}$/;
    return regexCpf.test(cpf);
  }
  
  function validarCnpj(cnpj) {
    const regexCnpj = /^\d{14}$/;
    return regexCnpj.test(cnpj);
  }
  
  function cadastrarUsuario() {
    const nome = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const senha = document.getElementById('senha-usuario').value;
    const cpf = document.getElementById('cpf-usuario').value;
    const endereco = document.getElementById('endereco-usuario').value;
    const cidade = document.getElementById('cidade-usuario').value;
    const telefone = document.getElementById('telefone-usuario').value;
  
    const camposObrigatorios = [nome, email, senha, cpf, endereco, cidade, telefone];
    const alertasUsuario = document.getElementById('alertas-usuario');
  
    // Verifica campos obrigatórios
    if (camposObrigatorios.some(campo => campo.trim() === '')) {
      alertasUsuario.querySelector('#campoObrigatorio-usuario').style.display = 'block';
      return;
    } else {
      alertasUsuario.querySelector('#campoObrigatorio-usuario').style.display = 'none';
    }
  
    // Verifica validade do email
    if (!validarEmail(email)) {
      alertasUsuario.querySelector('#emailInvalido-usuario').style.display = 'block';
      return;
    } else {
      alertasUsuario.querySelector('#emailInvalido-usuario').style.display = 'none';
    }
  
    // Verifica validade do telefone
    if (!validarTelefone(telefone)) {
      alertasUsuario.querySelector('#telefoneInvalido-usuario').style.display = 'block';
      return;
    } else {
      alertasUsuario.querySelector('#telefoneInvalido-usuario').style.display = 'none';
    }
  
    // Verifica validade do CPF
    if (!validarCpf(cpf)) {
      alertasUsuario.querySelector('#cpfInvalido-usuario').style.display = 'block';
      return;
    } else {
      alertasUsuario.querySelector('#cpfInvalido-usuario').style.display = 'none';
    }
  
    // Cadastro bem-sucedido
    alert('Cadastro de usuário realizado com sucesso!');
  }
  
  function cadastrarMotoboy() {
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const senha = document.getElementById('senha-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;
  
    const camposObrigatorios = [nome, email, senha, cpf, telefone, placa, cnh];
    const alertasMotoboy = document.getElementById('alertas-motoboy');
  
    // Verifica campos obrigatórios
    if (camposObrigatorios.some(campo => campo.trim() === '')) {
      alertasMotoboy.querySelector('#campoObrigatorio-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#campoObrigatorio-motoboy').style.display = 'none';
    }
  
    // Verifica validade do email
    if (!validarEmail(email)) {
      alertasMotoboy.querySelector('#emailInvalido-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#emailInvalido-motoboy').style.display = 'none';
    }
  
    // Verifica validade do telefone
    if (!validarTelefone(telefone)) {
      alertasMotoboy.querySelector('#telefoneInvalido-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#telefoneInvalido-motoboy').style.display = 'none';
    }
  
    // Verifica validade do CPF
    if (!validarCpf(cpf)) {
      alertasMotoboy.querySelector('#cpfInvalido-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#cpfInvalido-motoboy').style.display = 'none';
    }
  
    // Verifica validade da placa
    if (!placa.match(/^[A-Z]{3}-\d{4}$/)) {
      alertasMotoboy.querySelector('#placaInvalida-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#placaInvalida-motoboy').style.display = 'none';
    }
  
    // Verifica validade da CNH
    if (cnh.length < 11 || cnh.length > 15) {
      alertasMotoboy.querySelector('#cnhInvalida-motoboy').style.display = 'block';
      return;
    } else {
      alertasMotoboy.querySelector('#cnhInvalida-motoboy').style.display = 'none';
    }
  
    // Cadastro bem-sucedido
    alert('Cadastro de motoboy realizado com sucesso!');
  }
  
  function cadastrarRestaurante() {
    const nome = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;
  
    const camposObrigatorios = [nome, email, senha, cnpj, endereco, cidade, telefone];
    const alertasRestaurante = document.getElementById('alertas-restaurante');
  
    // Verifica campos obrigatórios
    if (camposObrigatorios.some(campo => campo.trim() === '')) {
      alertasRestaurante.querySelector('#campoObrigatorio-restaurante').style.display = 'block';
      return;
    } else {
      alertasRestaurante.querySelector('#campoObrigatorio-restaurante').style.display = 'none';
    }
  
    // Verifica validade do email
    if (!validarEmail(email)) {
      alertasRestaurante.querySelector('#emailInvalido-restaurante').style.display = 'block';
      return;
    } else {
      alertasRestaurante.querySelector('#emailInvalido-restaurante').style.display = 'none';
    }
  
    // Verifica validade do CNPJ
    if (!validarCnpj(cnpj)) {
      alertasRestaurante.querySelector('#cnpjInvalido-restaurante').style.display = 'block';
      return;
    } else {
      alertasRestaurante.querySelector('#cnpjInvalido-restaurante').style.display = 'none';
    }
  
    // Verifica validade do telefone
    if (!validarTelefone(telefone)) {
      alertasRestaurante.querySelector('#telefoneInvalido-restaurante').style.display = 'block';
      return;
    } else {
      alertasRestaurante.querySelector('#telefoneInvalido-restaurante').style.display = 'none';
    }
  
    // Cadastro bem-sucedido
    alert('Cadastro de restaurante realizado com sucesso!');
  }
  
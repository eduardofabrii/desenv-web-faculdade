
function cadastrarEstabelecimento() {
    const nome_empresa = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;

    if (!nome_empresa || !email || !cnpj || !endereco || !cidade || !telefone || !senha) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    fetch('/api/estabelecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_empresa, email, cnpj, endereco, cidade, telefone, senha })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao cadastrar estabelecimento: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        alert('Estabelecimento cadastrado com sucesso!');
        console.log('Estabelecimento cadastrado:', data);        
        location.href = 'login.html';
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar estabelecimento. Por favor, tente novamente.');
    });
}


function carregarEstabelecimentos() {
    fetch('/api/estabelecimento')
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao buscar estabelecimentos: ${response.statusText}`);
        return response.json();
    })
    .then(estabelecimentos => {
        const tabela = document.getElementById('tabela-empresas');//.getElementByTagName('tbody')[0];
        //tabela.innerHTML = ''; 

        estabelecimentos.forEach(empresa => {
            console.log(empresa);
            const row = tabela.insertRow();
            row.insertCell(0).innerText = empresa.Nome_Empresa;
            row.insertCell(1).innerText = empresa.Email;
            row.insertCell(2).innerText = empresa.CNPJ;
            row.insertCell(3).innerText = empresa.Endereco;
            row.insertCell(4).innerText = empresa.Cidade;
            row.insertCell(5).innerText = empresa.Telefone;

            const actionsCell = row.insertCell(6);
            actionsCell.innerHTML = `
                <button class="btn btn-warning" onclick="editarEmpresa(this, '${empresa.ID_Estabelecimento}')">Editar</button>
                <button class="btn btn-danger" onclick="excluirEmpresa('${empresa.ID_Estabelecimento}')">Excluir</button>
            `;
        });
    })
    .catch(error => {
        console.error('Erro ao carregar estabelecimentos:', error);
        alert('Erro ao buscar estabelecimentos. Verifique a conexão ou o servidor.');
    });
}


function editarEmpresa(botao, cnpj) {
    const linha = botao.parentNode.parentNode;
    const inputs = Array.from(linha.cells).slice(0, 6).map((cell, index) => {
        if (index !== 2) { 
            const conteudoAtual = cell.innerText;
            cell.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
            return cell.querySelector('input');
        }
        return null;
    }).filter(input => input !== null);

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        const [nome_empresa, email, endereco, cidade, telefone] = inputs.map(input => input.value);
        if (!nome_empresa || !email || !endereco || !cidade || !telefone) {
            alert('Todos os campos devem ser preenchidos!');
            return;
        }

        fetch(`/api/estabelecimento/${cnpj}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_empresa, email, endereco, cidade, telefone })
        })
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao atualizar estabelecimento: ${response.statusText}`);
            alert('Estabelecimento atualizado com sucesso!');
            carregarEstabelecimentos();
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar estabelecimento. Tente novamente.');
        });
    };
}

function excluirEmpresa(ID_Estabelecimento) {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return;

    console.log('Excluindo estabelecimento:', ID_Estabelecimento);
    fetch(`/api/estabelecimento/${ID_Estabelecimento}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao excluir estabelecimento: ${response.statusText}`);
        alert('Estabelecimento excluído com sucesso!');
        carregarEstabelecimentos(); 
    })
    .catch(error => {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir estabelecimento. Tente novamente.');
    });
}


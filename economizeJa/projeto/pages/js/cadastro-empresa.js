// Função para cadastrar um novo estabelecimento
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

    fetch('/api/estabelecimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_empresa, email, cnpj, endereco, cidade, telefone, senha })
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao cadastrar estabelecimento.');
        return response.json();
    })
    .then(data => {
        alert('Estabelecimento cadastrado com sucesso!');
        carregarEstabelecimentos(); // Atualiza a lista de estabelecimentos
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar estabelecimento.');
    });
}

// Função para carregar e exibir os estabelecimentos na tabela
function carregarEstabelecimentos() {
    fetch('/api/estabelecimentos')
    .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar estabelecimentos.');
        return response.json();
    })
    .then(estabelecimentos => {
        const tabela = document.getElementById('tabela-empresas').getElementsByTagName('tbody')[0];
        tabela.innerHTML = ''; // Limpa a tabela

        estabelecimentos.forEach(empresa => {
            const row = tabela.insertRow();
            row.insertCell(0).innerText = empresa.nome_empresa;
            row.insertCell(1).innerText = empresa.email;
            row.insertCell(2).innerText = empresa.cnpj;
            row.insertCell(3).innerText = empresa.endereco;
            row.insertCell(4).innerText = empresa.cidade;
            row.insertCell(5).innerText = empresa.telefone;

            const actionsCell = row.insertCell(6);
            actionsCell.innerHTML = `
                <button class="btn btn-warning" onclick="editarEmpresa(this, '${empresa.cnpj}')">Editar</button>
                <button class="btn btn-danger" onclick="excluirEmpresa('${empresa.cnpj}')">Excluir</button>
            `;
        });
    })
    .catch(error => {
        console.error('Erro ao carregar estabelecimentos:', error);
        alert('Erro ao buscar estabelecimentos.');
    });
}

// Função para editar um estabelecimento
function editarEmpresa(botao, cnpj) {
    const linha = botao.parentNode.parentNode;
    const inputs = Array.from(linha.cells).slice(0, 6).map((cell, index) => {
        if (index !== 2) { // Não permite edição do CNPJ
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

        fetch(`/api/estabelecimentos/${cnpj}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_empresa, email, endereco, cidade, telefone })
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar estabelecimento.');
            alert('Estabelecimento atualizado com sucesso!');
            carregarEstabelecimentos(); // Atualiza a lista
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar estabelecimento.');
        });
    };
}

// Função para excluir um estabelecimento
function excluirEmpresa(cnpj) {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return;

    fetch(`/api/estabelecimentos/${cnpj}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir estabelecimento.');
        alert('Estabelecimento excluído com sucesso!');
        carregarEstabelecimentos(); // Atualiza a lista
    })
    .catch(error => {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir estabelecimento.');
    });
}

// Chama a função para carregar os estabelecimentos quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarEstabelecimentos);

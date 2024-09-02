function cadastrarMotoboy() {
    // Obter os valores dos inputs
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;
    const senha = document.getElementById('senha-motoboy').value;

    // Verificar se todos os campos estão preenchidos
    if (nome && email && cpf && placa && cnh && telefone && senha) {
        
        // Armazenar os dados no localStorage
        const motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
        motoboys.push({ nome, email, cpf, placa, cnh, telefone, senha });
        localStorage.setItem('motoboys', JSON.stringify(motoboys));

        // Redirecionar para a página de lista de motoboys
        window.open('lista-entregadores.html', '_blank');
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para carregar os motoboys armazenados na tabela
function carregarMotoboys() {
    const motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
    const tabelaMotoboys = document.getElementById('tabela-motoboys');
    
    tabelaMotoboys.innerHTML = '';
    
    motoboys.forEach(motoboy => {
        const row = tabelaMotoboys.insertRow();
        row.insertCell(0).textContent = motoboy.nome;
        row.insertCell(1).textContent = motoboy.email;
        row.insertCell(2).textContent = motoboy.cpf;
        row.insertCell(3).textContent = motoboy.placa;
        row.insertCell(4).textContent = motoboy.cnh;
        row.insertCell(5).textContent = motoboy.telefone;

        // Criando a célula de Ações com os botões de Editar e Excluir
        const acoesCell = row.insertCell(6);
        acoesCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="editarMotoboy(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirMotoboy(this)">Excluir</button>
        `;
    });
}

function editarMotoboy(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');
    
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) {
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        salvarEdicaoMotoboy(linha);
    };
}

function salvarEdicaoMotoboy(linha) {
    const inputs = linha.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;
    });

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function() {
        editarMotoboy(this);
    };
}

function excluirMotoboy(botao) {
    const linha = botao.parentNode.parentNode;
    const nome = linha.cells[0].innerText;  
    linha.remove();

    let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
    motoboys = motoboys.filter(motoboy => motoboy.nome !== nome);

    localStorage.setItem('motoboys', JSON.stringify(motoboys));
}

// Função para buscar motoboys na tabela
function buscarMotoboys() {
    const searchInput = document.getElementById('searchInputMotoboy');
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#tabela-motoboys tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let i = 0; i < cells.length - 1; i++) { 
            if (cells[i].textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }

        if (match) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

document.getElementById('searchInputMotoboy').addEventListener('input', buscarMotoboys);

// Carregar motoboys ao abrir a página
if (window.location.pathname.endsWith('lista-entregadores.html')) {
    carregarMotoboys();
}

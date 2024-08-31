document.addEventListener('DOMContentLoaded', function() {
    function carregarEmpresas() {
        const tabela = document.getElementById('tabela-empresas');
        let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
        
        // Limpar a tabela antes de adicionar novos dados
        tabela.innerHTML = '';

        // Adicionar cada empresa à tabela
        empresas.forEach(empresa => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${empresa.nome}</td>
                <td>${empresa.email}</td>
                <td>${empresa.senha}</td>
                <td>${empresa.cnpj}</td>
                <td>${empresa.endereco}</td>
                <td>${empresa.cidade}</td>
                <td>${empresa.telefone}</td>
                <td>
                    <i class="fas fa-edit" title="Editar" onclick="editarEmpresa('${empresa.email}')"></i>
                    <i class="fas fa-trash" title="Apagar" onclick="apagarEmpresa('${empresa.email}')"></i>
                </td>
            `;

            tabela.appendChild(row);
        });
    }

    window.editarEmpresa = function(email) {
        let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
        const empresa = empresas.find(e => e.email === email);
        
        if (empresa) {
            document.getElementById('id-empresa').value = empresa.email;
            document.getElementById('nome-empresa').value = empresa.nome;
            document.getElementById('email-empresa').value = empresa.email;
            document.getElementById('senha-empresa').value = empresa.senha;
            document.getElementById('cnpj-empresa').value = empresa.cnpj;
            document.getElementById('endereco-empresa').value = empresa.endereco;
            document.getElementById('cidade-empresa').value = empresa.cidade;
            document.getElementById('telefone-empresa').value = empresa.telefone;
            document.getElementById('status-empresa').value = empresa.status;

            document.getElementById('formulario-edicao').style.display = 'block';
        }
    }

    window.apagarEmpresa = function(email) {
        if (confirm(`Tem certeza que deseja apagar a empresa com email: ${email}?`)) {
            let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
            empresas = empresas.filter(empresa => empresa.email !== email);
            localStorage.setItem('empresas', JSON.stringify(empresas));
            carregarEmpresas();
        }
    }

    function salvarEdicao(event) {
        event.preventDefault();

        const email = document.getElementById('id-empresa').value;
        const nome = document.getElementById('nome-empresa').value;
        const emailInstitucional = document.getElementById('email-empresa').value;
        const senha = document.getElementById('senha-empresa').value;
        const cnpj = document.getElementById('cnpj-empresa').value;
        const endereco = document.getElementById('endereco-empresa').value;
        const cidade = document.getElementById('cidade-empresa').value;
        const telefone = document.getElementById('telefone-empresa').value;
        const status = document.getElementById('status-empresa').value;

        let empresas = JSON.parse(localStorage.getItem('empresas')) || [];

        empresas = empresas.map(empresa => {
            if (empresa.email === email) {
                return {
                    nome: nome,
                    email: emailInstitucional,
                    senha: senha,
                    cnpj: cnpj,
                    endereco: endereco,
                    cidade: cidade,
                    telefone: telefone,
                    status: status
                };
            }
            return empresa;
        });

        localStorage.setItem('empresas', JSON.stringify(empresas));
        carregarEmpresas();
        document.getElementById('formulario-edicao').style.display = 'none';
    }

    document.getElementById('form-editar').addEventListener('submit', salvarEdicao);

    document.getElementById('cancelar-edicao').addEventListener('click', function() {
        document.getElementById('formulario-edicao').style.display = 'none';
    });

    function buscarEmpresas() {
        const searchInput = document.getElementById('searchInput');
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#tabela-empresas tr');

        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            let match = false;

            for (let i = 0; i < cells.length - 1; i++) { // Excluir a última coluna (ações)
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

    document.getElementById('searchInput').addEventListener('input', buscarEmpresas);

    carregarEmpresas();
});
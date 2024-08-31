document.addEventListener('DOMContentLoaded', function() {
    function carregarMotoboys() {
        const tabela = document.getElementById('tabela-motoboys');
        let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
        
        // Limpar a tabela antes de adicionar novos dados
        tabela.innerHTML = '';

        // Adicionar cada motoboy à tabela
        motoboys.forEach(motoboy => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${motoboy.nome}</td>
                <td>${motoboy.email}</td>
                <td>${motoboy.telefone}</td>
                <td>${motoboy.senha}</td>
                <td>${motoboy.cpf}</td>
                <td>${motoboy.placa}</td>
                <td>${motoboy.cnh}</td>
                <td>
                    <i class="fas fa-edit" title="Editar" onclick="editarMotoboy('${motoboy.email}')"></i>
                    <i class="fas fa-trash" title="Apagar" onclick="apagarMotoboy('${motoboy.email}')"></i>
                </td>
            `;

            tabela.appendChild(row);
        });
    }

    window.editarMotoboy = function(email) {
        let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
        const motoboy = motoboys.find(m => m.email === email);
        
        if (motoboy) {
            document.getElementById('email-editar').value = motoboy.email;
            document.getElementById('placa-editar').value = motoboy.placa;
            document.getElementById('telefone-editar').value = motoboy.telefone;

            document.getElementById('formulario-edicao').style.display = 'block';
        }
    }

    window.apagarMotoboy = function(email) {
        if (confirm(`Tem certeza que deseja apagar o motoboy com email: ${email}?`)) {
            let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
            motoboys = motoboys.filter(motoboy => motoboy.email !== email);
            localStorage.setItem('motoboys', JSON.stringify(motoboys));
            carregarMotoboys();
        }
    }

    function salvarEdicao(event) {
        event.preventDefault();

        const email = document.getElementById('email-editar').value;
        const placa = document.getElementById('placa-editar').value;
        const telefone = document.getElementById('telefone-editar').value;

        let motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];

        motoboys = motoboys.map(motoboy => {
            if (motoboy.email === email) {
                return {
                    ...motoboy, 
                    placa: placa,
                    telefone: telefone
                };
            }
            return motoboy;
        });

        localStorage.setItem('motoboys', JSON.stringify(motoboys));
        carregarMotoboys();
        document.getElementById('formulario-edicao').style.display = 'none';
    }

    document.getElementById('form-editar').addEventListener('submit', salvarEdicao);

    document.getElementById('cancelar-edicao').addEventListener('click', function() {
        document.getElementById('formulario-edicao').style.display = 'none';
    });

    function buscarMotoboys() {
        const searchInput = document.getElementById('searchInput');
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#tabela-motoboys tr');

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

    document.getElementById('searchInput').addEventListener('input', buscarMotoboys);

    carregarMotoboys();
});
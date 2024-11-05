async function adicionarProduto(event) {
    event.preventDefault();

    // Captura a imagem e converte para uma URL temporária
    const imageInput = document.getElementById("productImage");
    const imageFile = imageInput.files[0];
    const imageURL = imageFile ? URL.createObjectURL(imageFile) : '';

    // Captura os outros campos
    const nome = document.getElementById("productName").value;
    const nicho = document.getElementById("productCategory").value;
    const descricao = document.getElementById("productDescription").value;
    const preco = parseFloat(document.getElementById("productPrice").value);

    const produto = {
        Nome: nome,
        Nicho: nicho,
        Descricao: descricao,
        Preco: preco,
        Imagem: imageURL
    };

    try {
        const response = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto),
        });

        if (response.ok) {
            alert("Produto adicionado com sucesso!");
            document.getElementById("produtoForm").reset();

            // Salva a imagem no localStorage
            localStorage.setItem(`imagem-${nome}`, imageURL);
            carregarProdutos();
        } else {
            throw new Error("Erro ao adicionar produto.");
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const produtos = await response.json();

        const produtosContainer = document.getElementById("produtosContainer");
        produtosContainer.innerHTML = ""; // Limpa a lista existente

        if (produtos.length === 0) {
            produtosContainer.innerHTML = "<p>Nenhum produto cadastrado.</p>";
            return;
        }

        for (const produto of produtos) {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-3";

            // Recupera a URL da imagem do localStorage ou usa uma imagem padrão
            const imagem = localStorage.getItem(`imagem-${produto.Nome}`) || 'caminho/para/imagem/padrao.jpg';

            col.innerHTML = `
                <div class="card">
                    <img src="${imagem}" class="card-img-top" alt="${produto.Nome}" style="max-height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${produto.Nome}</h5>
                        <p class="card-text">${produto.Descricao}</p>
                        <p class="card-text">Preço: R$ ${produto.Preco.toFixed(2)}</p>
                        <p class="card-text">Nicho: ${produto.Nicho}</p>
                        <button class="btn btn-primary" onclick="editarProduto(${produto.ID_Produtos})">Editar</button>
                        <button class="btn btn-danger" onclick="excluirProduto(${produto.ID_Produtos})">Excluir</button>
                    </div>
                </div>
            `;

            produtosContainer.appendChild(col);
        }
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos.");
    }
}

async function editarProduto(id) {
    const nome = prompt("Novo Nome do Produto:");
    const nicho = prompt("Novo Nicho:");
    const descricao = prompt("Nova Descrição:");
    const preco = parseFloat(prompt("Novo Preço:"));

    // Verifica se há um novo arquivo de imagem selecionado
    const imageInput = document.getElementById("productImage");
    const imageFile = imageInput.files[0];
    let imageURL = localStorage.getItem(`imagem-${id}`) || 'caminho/para/imagem/padrao.jpg';

    if (imageFile) {
        imageURL = URL.createObjectURL(imageFile); // Cria uma nova URL temporária se houver um novo arquivo
        localStorage.setItem(`imagem-${id}`, imageURL); // Atualiza o localStorage
    }

    const produto = {
        Nome: nome,
        Nicho: nicho,
        Descricao: descricao,
        Preco: preco,
        Imagem: imageURL
    };

    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto),
        });

        if (response.ok) {
            alert("Produto editado com sucesso!");
            carregarProdutos();
        } else {
            throw new Error("Erro ao editar produto.");
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                localStorage.removeItem(`imagem-${id}`); // Remove a imagem do localStorage ao excluir o produto
                alert("Produto excluído com sucesso!");
                carregarProdutos();
            } else {
                throw new Error("Erro ao excluir produto.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
}

// Adiciona o evento de submit ao formulário
document.getElementById("produtoForm").addEventListener("submit", adicionarProduto);

// Carrega os produtos ao iniciar a página
carregarProdutos();

async function adicionarProduto(event) {
    event.preventDefault();
    
    // Captura a imagem e converte para uma URL temporária
    const imageInput = document.getElementById("productImage");
    const imageFile = imageInput.files[0];

    // Verifica se uma imagem foi selecionada
    const imageURL = imageFile ? URL.createObjectURL(imageFile) : ''; // Se não houver imagem, a URL será uma string vazia
    
    // Captura os outros campos
    const nome = document.getElementById("productName").value;
    const nicho = document.getElementById("productCategory").value;
    const descricao = document.getElementById("productDescription").value;
    const preco = parseFloat(document.getElementById("productPrice").value);

    // Cria o objeto produto com os dados
    const produto = {
        Nome: nome,
        Nicho: nicho,
        Descricao: descricao,
        Preco: preco,
        Imagem: imageURL // Adiciona a URL da imagem ao objeto produto
    };

    try {
        // Envia o produto para o backend
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
            if (imageFile) {
                localStorage.setItem(`imagem-${nome}`, imageURL);
            }
            carregarProdutos(); // Atualiza a lista de produtos
        } else {
            throw new Error("Erro ao adicionar produto.");
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


// Função para carregar os produtos do banco de dados (API)
async function carregarProdutos() {
    try {
        // Faz a requisição GET para carregar os produtos
        const response = await fetch('/api/produtos');
        const produtos = await response.json();

        const produtosContainer = document.getElementById("produtosContainer");
        produtosContainer.innerHTML = ""; // Limpa a lista existente

        if (produtos.length === 0) {
            produtosContainer.innerHTML = "<p class='alert alert-warning'>Nenhum produto encontrado.</p>";
            return;
        }

        // Exibe os produtos existentes
        produtos.forEach((produto, index) => {
            // Use a URL da imagem correta que foi retornada pelo backend
            const imagem = produto.Imagem || '';  // Alterado de produto.image para produto.Imagem

            const produtoCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${imagem}" class="card-img-top" alt="${produto.Nome}" style="height: 400px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title" id="nameDisplay-${index}">${produto.Nome}</h5>
                            <input type="text" value="${produto.Nome}" class="form-control mb-2" readonly id="name-${index}" style="display: none;">
                            <p class="card-text" id="descriptionDisplay-${index}">${produto.Descricao}</p>
                            <input type="text" value="${produto.Descricao}" class="form-control mb-2" readonly id="description-${index}" style="display: none;">
                            <p class="card-text" id="priceDisplay-${index}"><strong>R$</strong> ${produto.Preco.toFixed(2)}</p>
                            <input type="number" value="${produto.Preco}" class="form-control mb-2" readonly id="price-${index}" style="display: none;">
                            <button class="btn btn-warning mt-2" onclick="toggleEdit(${index}, event, ${produto.ID_Produtos})">Editar</button>
                            <button class="btn btn-danger mt-2" onclick="excluirProduto(${produto.ID_Produtos})">Remover</button>
                        </div>
                    </div>
                </div>
            `;
            produtosContainer.innerHTML += produtoCard;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos.");
    }
}

// Função para carregar todos os produtos
async function carregarTodosProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const todosOsProdutos = await response.json();
        produtos.length = 0; // Limpa a lista atual
        produtos.push(...todosOsProdutos); // Adiciona todos os produtos à lista atual
        salvarProdutos(); // Salva as alterações
    } catch (error) {
        console.error("Erro ao carregar todos os produtos:", error);
        alert("Erro ao carregar todos os produtos.");
    }
}

// Função para alternar entre editar e salvar
async function toggleEdit(index, event, produtoId) {
    const nameInput = document.getElementById(`name-${index}`);
    const descriptionInput = document.getElementById(`description-${index}`);
    const priceInput = document.getElementById(`price-${index}`);
    const nameDisplay = document.getElementById(`nameDisplay-${index}`);
    const descriptionDisplay = document.getElementById(`descriptionDisplay-${index}`);
    const priceDisplay = document.getElementById(`priceDisplay-${index}`);
    const button = event.target; // Pega o botão que foi clicado

    if (button.innerText === 'Editar') {
        // Mostra os campos de entrada e esconde os textos
        nameInput.style.display = 'block';
        descriptionInput.style.display = 'block';
        priceInput.style.display = 'block';
        nameDisplay.style.display = 'none';
        descriptionDisplay.style.display = 'none';
        priceDisplay.style.display = 'none';
        button.innerText = 'Salvar'; // Muda o texto do botão para 'Salvar'
        nameInput.removeAttribute('readonly'); // Permite edição
        descriptionInput.removeAttribute('readonly'); // Permite edição
        priceInput.removeAttribute('readonly'); // Permite edição
        nameInput.focus(); // Foca no campo de entrada para facilitar a edição
    } else {
        // Salva as alterações
        const updatedProduto = {
            Nome: nameInput.value,
            Descricao: descriptionInput.value,
            Preco: parseFloat(priceInput.value)
        };

        try {
            // Faz a requisição PUT para atualizar o produto no banco de dados
            const response = await fetch(`/api/produtos/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduto)
            });

            if (response.ok) {
                // Atualiza a exibição com os novos dados
                const produtoAtualizado = await response.json(); // Captura o produto atualizado

                atualizarDisplay(index, produtoAtualizado, button);
                alert("Produto atualizado com sucesso!");
                carregarProdutos(); // Recarrega a lista de produtos
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar produto.");
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert("Erro ao atualizar produto. Tente novamente.");
        }
    }
}

// Função para atualizar a exibição depois de salvar
function atualizarDisplay(index, produtoAtualizado, button) {
    const nameDisplay = document.getElementById(`nameDisplay-${index}`);
    const descriptionDisplay = document.getElementById(`descriptionDisplay-${index}`);
    const priceDisplay = document.getElementById(`priceDisplay-${index}`);
    const nameInput = document.getElementById(`name-${index}`);
    const descriptionInput = document.getElementById(`description-${index}`);
    const priceInput = document.getElementById(`price-${index}`);

    // Atualiza os valores de exibição
    nameDisplay.innerText = produtoAtualizado.Nome;
    descriptionDisplay.innerText = produtoAtualizado.Descricao;
    priceDisplay.innerHTML = `<strong>R$</strong> ${parseFloat(produtoAtualizado.Preco).toFixed(2)}`;

    // Esconde os campos de entrada e mostra os textos atualizados
    nameInput.style.display = 'none';
    descriptionInput.style.display = 'none';
    priceInput.style.display = 'none';
    nameDisplay.style.display = 'block';
    descriptionDisplay.style.display = 'block';
    priceDisplay.style.display = 'block';

    // Volta o texto do botão para 'Editar'
    button.innerText = 'Editar';
}

// Função para excluir um produto
async function excluirProduto(produtoId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`/api/produtos/${produtoId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Produto excluído com sucesso!");
                carregarProdutos(); // Atualiza a lista de produtos
            } else {
                throw new Error("Erro ao excluir produto.");
            }
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            alert("Erro ao excluir produto.");
        }
    }
}


// Carrega os produtos ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarProdutos);

// Adiciona o evento de submit ao formulário de novo produto
document.getElementById("produtoForm").addEventListener("submit", adicionarProduto);

// Função para carregar os produtos do banco de dados (API)
async function carregarProdutos() {
    try {
        // Faz a requisição GET para carregar os produtos
        const response = await fetch('/api/produtos');
        
        if (!response.ok) {
            throw new Error("Erro ao carregar produtos");
        }

        const produtos = await response.json();
        const produtosContainer = document.getElementById("produtosContainer");

        // Limpa a lista existente
        produtosContainer.innerHTML = ""; 

        if (produtos.length === 0) {
            produtosContainer.innerHTML = "<p class='alert alert-warning'>Nenhum produto encontrado.</p>";
            return;
        }

        // Exibe os produtos carregados
        produtos.forEach((produto, index) => {
            const produtoCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${produto.image || ''}" class="card-img-top" alt="${produto.Nome}" style="height: 400px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${produto.Nome}</h5>
                            <p class="card-text">${produto.Descricao}</p>
                            <p class="card-text"><strong>R$</strong> ${produto.Preco.toFixed(2)}</p>
                            <button class="btn btn-success mt-2" onclick="adicionarAoCarrinho(${produto.ID_Produtos})">Adicionar ao Carrinho</button>
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

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    // Faz a requisição para buscar os detalhes do produto
    fetch(`/api/produtos/${produtoId}`)
        .then(response => response.json())
        .then(produto => {
            // Recupera o carrinho do localStorage (ou cria um novo se não existir)
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            // Verifica se o produto já está no carrinho
            const produtoExistente = carrinho.find(item => item.ID_Produtos === produto.ID_Produtos);

            if (produtoExistente) {
                // Se já estiver no carrinho, apenas aumenta a quantidade
                produtoExistente.quantidade += 1;
            } else {
                // Caso contrário, adiciona o produto com quantidade 1
                carrinho.push({
                    ...produto,
                    quantidade: 1
                });
            }

            // Atualiza o localStorage com o carrinho
            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            alert("Produto adicionado ao carrinho!");
            atualizarCarrinho(); // Atualiza a visualização do carrinho
        })
        .catch(error => {
            console.error("Erro ao adicionar ao carrinho:", error);
            alert("Erro ao adicionar produto ao carrinho.");
        });
}

// Função para exibir o conteúdo do carrinho
function atualizarCarrinho() {
    const carrinhoContainer = document.getElementById('carrinhoContainer');
    carrinhoContainer.innerHTML = '';

    // Recupera o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p class='alert alert-warning'>Carrinho vazio.</p>";
    } else {
        let total = 0;
        carrinho.forEach(item => {
            total += item.Preco * item.quantidade;
            carrinhoContainer.innerHTML += `
                <div class="cart-item">
                    <h5>${item.Nome}</h5>
                    <p>Quantidade: ${item.quantidade}</p>
                    <p><strong>R$</strong> ${item.Preco.toFixed(2)} (Total: R$ ${(item.Preco * item.quantidade).toFixed(2)})</p>
                </div>
            `;
        });

        carrinhoContainer.innerHTML += `
            <hr>
            <p><strong>Total do Carrinho:</strong> R$ ${total.toFixed(2)}</p>
            <button class="btn btn-danger" onclick="limparCarrinho()">Limpar Carrinho</button>
            <button class="btn btn-primary" onclick="finalizarCompra()">Finalizar Compra</button>
        `;
    }
}

// Função para limpar o carrinho
function limparCarrinho() {
    localStorage.removeItem('carrinho');
    atualizarCarrinho(); // Atualiza o carrinho visualmente
}

// Função para finalizar a compra
function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        alert("Carrinho vazio. Adicione produtos antes de finalizar.");
        return;
    }

    // Aqui você pode adicionar a lógica de pagamento ou enviar a compra para a API
    alert("Compra finalizada com sucesso!");
    limparCarrinho(); // Limpa o carrinho após a compra
}

// Atualiza o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(); // Carrega os produtos na página
    atualizarCarrinho(); // Exibe o carrinho atual
});

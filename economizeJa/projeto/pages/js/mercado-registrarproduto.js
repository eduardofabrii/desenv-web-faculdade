// Inicializa a lista de produtos
const produtos = JSON.parse(localStorage.getItem('products')) || [];

// Cria o botão para carregar todos os produtos
const carregarTodosBtn = document.createElement('button');
carregarTodosBtn.innerText = 'Carregar Todos os Produtos';
carregarTodosBtn.className = 'btn btn-primary mt-4';
carregarTodosBtn.onclick = carregarTodosProdutos; // Chama a função para carregar todos os produtos
produtosContainer.prepend(carregarTodosBtn); // Adiciona o botão ao início do container

const imagemPadrao = 'images/img-caixa-bombons.jpg'; // Substitua pelo caminho da sua imagem padrão

// Adiciona um produto padrão se não houver produtos
if (produtos.length === 0) {
    produtos.push({
        id: Date.now(), // Usando timestamp como ID único
        name: 'Caixa de Bombons',
        description: 'Caixa com 12 bombons sortidos',
        price: '49.99',
        image: imagemPadrao
    });
    localStorage.setItem('products', JSON.stringify(produtos)); // Salva no localStorage
}

function carregarProdutosRegistro() {
    const produtosContainer = document.getElementById('produtosContainer');
    
    // Limpa o container
    produtosContainer.innerHTML = ''; // Isso é necessário para não duplicar os produtos

    // Exibe os produtos existentes
    produtos.forEach((produto, index) => {
        const produtoCard = `
            <div class="col-md-4">
                <div class="card" style="margin-bottom: 20px;">
                    <img src="${produto.image}" class="card-img-top" alt="${produto.name}" style="height: 400px; object-fit: cover;" />
                    <div class="card-body">
                        <span id="nameDisplay-${index}">${produto.name}</span>
                        <input type="text" value="${produto.name}" class="form-control mb-2" readonly id="name-${index}" style="display: none;" />
                        <br />
                        <span id="descriptionDisplay-${index}">${produto.description}</span>
                        <input type="text" value="${produto.description}" class="form-control mb-2" readonly id="description-${index}" style="display: none;" />
                        <br />
                        <span id="priceDisplay-${index}"><strong>R$</strong> ${produto.price}</span>
                        <input type="number" value="${produto.price}" class="form-control mb-2" readonly id="price-${index}" style="display: none;" />
                        <br />
                        <button class="btn btn-warning mt-2" onclick="toggleEdit(${index}, event)">Editar</button>
                        <button class="btn btn-danger mt-2" onclick="removerProduto(${index})">Remover</button>
                    </div>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += produtoCard;
    });
}


// Função para carregar todos os produtos
function carregarTodosProdutos() {
    const todosOsProdutos = JSON.parse(localStorage.getItem('products')) || [];
    produtos.length = 0; // Limpa a lista atual
    produtos.push(...todosOsProdutos); // Adiciona todos os produtos à lista atual
    salvarProdutos(); // Salva as alterações
}

// Função para alternar entre editar e salvar
function toggleEdit(index, event) {
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
        button.innerText = 'Salvar'; // Muda o texto do botão
        nameInput.removeAttribute('readonly'); // Permite edição
        descriptionInput.removeAttribute('readonly'); // Permite edição
        priceInput.removeAttribute('readonly'); // Permite edição
        nameInput.focus(); // Foca no campo de entrada para facilitar a edição
    } else {
        // Salva as alterações
        produtos[index].name = nameInput.value;
        produtos[index].description = descriptionInput.value;
        produtos[index].price = priceInput.value;

        // Atualiza a exibição
        atualizarDisplay(index, nameInput, descriptionInput, priceInput, button);
        salvarProdutos(); // Salva as alterações
    }
}

// Função para atualizar a exibição após a edição
function atualizarDisplay(index, nameInput, descriptionInput, priceInput, button) {
    const nameDisplay = document.getElementById(`nameDisplay-${index}`);
    const descriptionDisplay = document.getElementById(`descriptionDisplay-${index}`);
    const priceDisplay = document.getElementById(`priceDisplay-${index}`);
    
    // Esconde os campos de entrada e mostra os textos
    nameInput.style.display = 'none';
    descriptionInput.style.display = 'none';
    priceInput.style.display = 'none';
    nameDisplay.innerText = nameInput.value; // Atualiza o texto com o novo valor
    descriptionDisplay.innerText = descriptionInput.value;
    priceDisplay.innerHTML = `<strong>R$</strong> ${priceInput.value}`; // Atualiza o preço com o símbolo em negrito
    nameDisplay.style.display = 'block';
    descriptionDisplay.style.display = 'block';
    priceDisplay.style.display = 'block';
    button.innerText = 'Editar'; // Muda o texto do botão de volta para "Editar"
}

// Função para carregar produtos no "Mercado" (somente com opção de adicionar ao carrinho)
function carregarProdutosMercado() {
    const produtosContainer = document.getElementById('produtosContainer');
    produtosContainer.innerHTML = ''; // Limpa o container

    produtos.forEach(produto => {
        const produtoCard = `
            <div class="col-md-4">
                <div class="card" style="margin-bottom: 20px;">
                    <img src="${produto.image || imagemPadrao}" class="card-img-top" alt="${produto.name}" style="height: 400px; object-fit: cover;" />
                    <div class="card-body">
                        <h5 class="card-title">${produto.name}</h5>
                        <p class="price"><strong>R$</strong> ${produto.price}</p>
                        <p>${produto.description}</p>
                        <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                    </div>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += produtoCard;
    });
}

// Função para adicionar um produto ao localStorage
document.getElementById('produtoForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nomeProduto = document.getElementById('productName').value;
    const descricaoProduto = document.getElementById('productDescription').value;
    const precoProduto = document.getElementById('productPrice').value;
    const imagemProdutoInput = document.getElementById('productImage');

    const reader = new FileReader();
    reader.onloadend = function() {
        const novoProduto = {
            id: Date.now(), // Usando timestamp como ID único
            name: nomeProduto,
            description: descricaoProduto,
            price: precoProduto,
            image: reader.result, // A imagem em formato Base64
        };

        produtos.push(novoProduto); // Adiciona o novo produto
        localStorage.setItem('products', JSON.stringify(produtos)); // Salva no localStorage

        document.getElementById('produtoForm').reset(); // Limpa o formulário
        carregarProdutosRegistro(); // Recarrega a lista de produtos
    };

    if (imagemProdutoInput.files[0]) {
        reader.readAsDataURL(imagemProdutoInput.files[0]); // Lê a imagem selecionada
    }
});

// Função para remover um produto
function removerProduto(index) {
    produtos.splice(index, 1); // Remove o produto da lista
    salvarProdutos(); // Salva as alterações
}

// Função para salvar os produtos no localStorage e recarregar a lista
function salvarProdutos() {
    localStorage.setItem('products', JSON.stringify(produtos)); // Atualiza o localStorage
    carregarProdutosRegistro(); // Recarrega a lista de produtos
}

// Função para adicionar um produto ao carrinho no "Mercado" (implementação futura)
function adicionarAoCarrinho(produtoId) {
    alert(`Produto com ID ${produtoId} adicionado ao carrinho!`); // Mensagem de alerta
}

// Inicialize o carregamento
if (window.location.pathname.includes('registrar-produtos.html')) {
    carregarProdutosRegistro(); // Carrega produtos para registrar
}

if (window.location.pathname.includes('mercado.html')) {
    carregarProdutosMercado(); // Carrega produtos para o mercado
}
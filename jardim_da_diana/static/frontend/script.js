document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});

function fetchProdutos() {
    fetch("http://localhost:8000/api/produtos/")
        .then(res => res.json())
        .then(produtos => {
            renderCarrossel(produtos);
            renderTodosProdutos(produtos);
        })
        .catch(err => console.error("Erro ao buscar Produtos", err));
}

// Carrossel
function renderCarrossel(produtos) {
    const container = document.getElementById("produtos-container");
    container.innerHTML = "";

    const quantidadeCarrossel = 7;

    produtos.slice(0, quantidadeCarrossel).forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto";
        card.innerHTML = `
            <div class="imagem-container">
                <a href="./descricao.html?id=${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}" />
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Mais Vendidos
function renderTodosProdutos(produtos) {
    const todosContainer = document.getElementById("produtos-todos");
    todosContainer.innerHTML = "";

    const quantidadeMaisVendidos = 8;

    produtos.slice(0, quantidadeMaisVendidos).forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto-item";
        card.innerHTML = `
            <div class="produto-completo">
                <a href="./descricao.html?id=${produto.id}">
                    <div class="imagem-produto">
                        <img src="${produto.imagem}" alt="${produto.nome}" />
                    </div>
                    <div class="descricao-produto">
                        <h1>${produto.nome}</h1>
                        <p class="preco">R$ ${produto.preco}</p>
                    </div>
                </a>
            </div>
        `;
        todosContainer.appendChild(card);
    });
}

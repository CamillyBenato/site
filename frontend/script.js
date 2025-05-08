document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});

function fetchProdutos(){
    fetch("http://localhost:8000/api/produtos/")
        .then(res => res.json())
        .then(data => {
            renderCarrossel(data);
            renderTodosProdutos(data);
        })
        .catch(err => console.error("Erro ao buscar Produtos", err));
}

//Carrossel
function renderCarrossel(produtos){
    const container = document.getElementById("produtos-container");
    container.innerHTML = "";

    produtos.forEach(produto => {
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

//Todos os Produtos
function renderTodosProdutos(produtos){
    const todosContainer = document.getElementById("produtos-todos");
    todosContainer.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto-item";
        
        card.innerHTML = `
            <div class="produto-completo">
                <img src="${produto.imagem}" alt="${produto.nome}" />
                <h2>${produto.nome}</h2>
                <p class="preco">R$ ${produto.preco}</p>
                <p><strong>Categoria:</strong> ${produto.categoria.nome}</p>
            </div>
        `;
        todosContainer.appendChild(card);
    });
}

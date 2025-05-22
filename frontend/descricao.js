document.addEventListener("DOMContentLoaded", () => {
    fetchProduto();
});

function fetchProduto() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    if(!id){
        console.error("ID do produto não encontrado na URL.");
        return;
    }

    fetch(`http://localhost:8000/api/produtos/${id}`)
        .then(res => res.json())
        .then(produto => renderProduto(produto))
        .catch(err => console.error("Erro ao buscar o produto", err));
}

function renderProduto(produto){
    const carrosselContainer = document.getElementById("produtos-container");
    const todosContainer = document.getElementById("produtos-todos");

    const cardHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <p><strong>${produto.nome}</strong></p>
        <p>${produto.descricao}</p>
        <p><strong>R$ ${produto.preco}</strong></p>
        <p><em>Categoria: ${produto.categoria?.nome || "Sem categoria"}</em></p>
    `;

    if (carrosselContainer) {
        carrosselContainer.innerHTML = "";
        const card = document.createElement("div");
        card.className = "produto";
        card.innerHTML = cardHTML;
        carrosselContainer.appendChild(card);
    }

    if (todosContainer) {
        todosContainer.innerHTML = "";
        const card = document.createElement("div");
        card.className = "produto-completo";
        card.innerHTML = cardHTML;
        todosContainer.appendChild(card);
    }
}
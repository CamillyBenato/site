document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});

function fetchProdutos(){
    fetch("http://localhost:8000/api/produtos/")
    .then(res => res.json())
    .then(data => renderProdutos(data))
    .catch(err => console.error("Erro ao buscar Produtos", err));
}

function renderProdutos(produtos){

    const container = document.getElementById("produtos-container");
    container.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto";
        card.innerHTML = `
            <h2>${produto.nome}</h2>
            <div class = "imagem-container">
            <a href = './descricao.html?id=${produto.id}'>
                <img src = "${produto.imagem}" alt = "${produto.nome}"/>
                </a>
            </div>
            <p>${produto.descricao}</p>
            <p class = "preco"> R$ ${produto.preco}</p>
            <p><strong> Categoria: </strong> ${produto.categoria.nome}</p>
        `;
        container.appendChild(card);
    });
    
}
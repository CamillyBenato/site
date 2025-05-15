document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});

function fetchProdutos(){
    fetch("http://localhost:8000/api/produtos/")
        .then(res => res.json())
        .then(data => {
            renderTodosProdutos(data);
        })
        .catch(err => console.error("Erro ao buscar Produtos", err));
}

function renderTodosProdutos(produtos){
    const todosContainer = document.getElementById("produtos-todos");
    todosContainer.innerHTML = "";

    produtos.forEach(produto => {
        console.log(produto);

        if(produto.categoria?.nome?.toLowerCase() === "presente"){
            const card = document.createElement("div");
            card.className = "produto-item";
            
            card.innerHTML = `
                <div class="produto-completo">
                    <img src="${produto.imagem}" alt="${produto.nome}" />
                    <h1>${produto.nome}</h1>
                    <p class="preco">R$ ${produto.preco}</p>
                </div>
            `;
            todosContainer.appendChild(card);
        }
    });
}

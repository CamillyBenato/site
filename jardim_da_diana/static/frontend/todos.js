document.addEventListener("DOMContentLoaded", () => {
    // Acessa o valor do parâmetro "categoria"
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
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");
    const todosContainer = document.getElementById("produtos-todos");
    todosContainer.innerHTML = "";

    produtos.forEach(produto => {
        console.log(produto);

        if(produto.categoria?.nome?.toLowerCase() === categoria){
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

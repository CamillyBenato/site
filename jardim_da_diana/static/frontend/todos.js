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

function showMenu() {
    document.getElementById("dropdown").style.display = "flex";
}
function hideMenu() {
    document.getElementById("dropdown").style.display = "none";
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
                    <a href="./descricao.html?id=${produto.id}">
                        <img src="${produto.imagem}" alt="${produto.nome}" />
                        <h1>${produto.nome}</h1>
                        <p class="descricao">${produto.descricao}</p> <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p> </a>
                </div>
            `;
            todosContainer.appendChild(card);
        }
    });
}

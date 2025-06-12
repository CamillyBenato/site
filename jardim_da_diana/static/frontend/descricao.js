import { getCookie, handleAddToCart, handleAddToFav, checkInitialFavoriteState } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    fetchProduto();
});

function fetchProduto() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id'); // Pega o ID do produto da URL

    if (!id) {
        console.error("ID do produto não encontrado na URL.");
        const container = document.getElementById("produto-detalhes-container");
        if (container) {
            container.innerHTML = "<p>Nenhum produto especificado. Por favor, retorne à página inicial.</p>";
        }
        return;
    }

    // Requisição para a API do Django que retorna os detalhes do produto
    fetch(`http://localhost:8000/api/produtos/${id}/`) // Adicionei a barra final consistentemente
        .then(res => {
            if (!res.ok) {
                // Se o produto não for encontrado (404), exibe mensagem específica
                if (res.status === 404) {
                    const container = document.getElementById("produto-detalhes-container");
                    if (container) {
                        container.innerHTML = "<p>Produto não encontrado.</p>";
                    }
                    throw new Error(`Produto com ID ${id} não encontrado.`);
                }
                // Se for outro erro HTTP, tente ler a mensagem de erro da resposta
                return res.json().then(errData => {
                    throw new Error(`Erro HTTP! Status: ${res.status}. Detalhes: ${errData.detail || JSON.stringify(errData)}`);
                }).catch(() => {
                    // Se não conseguir ler o JSON, lança um erro genérico
                    throw new Error(`Erro HTTP! Status: ${res.status}`);
                });
            }
            return res.json();
        })
        .then(produto => renderProduto(produto))
        .catch(err => {
            console.error("Erro ao buscar o produto:", err);
            const container = document.getElementById("produto-detalhes-container");
            if (container) {
                container.innerHTML = `<p>Erro ao carregar detalhes do produto. Tente novamente mais tarde.</p>`;
            }
        });
}

function showMenu() {
    document.getElementById("dropdown").style.display = "flex";
}
function hideMenu() {
    document.getElementById("dropdown").style.display = "none";
}

function renderProduto(produto) {
    const imagemElement = document.getElementById("produto-imagem");
    const nomeElement = document.getElementById("produto-nome");
    const descricaoElement = document.getElementById("produto-descricao");
    const precoElement = document.getElementById("produto-preco");
    const categoriaElement = document.getElementById("produto-categoria");
    const adicionarSacolaBtn = document.getElementById("adicionar-sacola");
    const adicionarFavoritosBtn = document.getElementById("adicionar-favoritos");

    // Preenche os elementos com os dados do produto
    if (imagemElement) {
        imagemElement.src = produto.imagem;
        imagemElement.alt = produto.nome;
    }
    if (nomeElement) {
        nomeElement.textContent = produto.nome;
    }
    if (descricaoElement) {
        descricaoElement.textContent = produto.descricao; // Corrigido: estava atribuindo o preço aqui
    }
    if (precoElement) {
        precoElement.textContent = `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}`;
    }
    if (categoriaElement) {
        categoriaElement.textContent = `Categoria: ${produto.categoria ? produto.categoria.nome : "N/A"}`;
    }

    // Adiciona eventos aos botões usando as funções importadas de utils.js
    if (adicionarSacolaBtn) {
        adicionarSacolaBtn.dataset.produtoId = produto.id; // Garante que o ID do produto está no data-attribute
        adicionarSacolaBtn.removeEventListener("click", handleAddToCart); // Evita duplicidade de listeners
        adicionarSacolaBtn.addEventListener("click", handleAddToCart);
    }

    if (adicionarFavoritosBtn) {
        adicionarFavoritosBtn.dataset.produtoId = produto.id; // Garante que o ID do produto está no data-attribute
        adicionarFavoritosBtn.removeEventListener("click", handleAddToFav); // Evita duplicidade de listeners
        adicionarFavoritosBtn.addEventListener("click", handleAddToFav);
        checkInitialFavoriteState(adicionarFavoritosBtn); // Verifica se o produto já é favorito para definir o ícone
    }
}
import { handleAddToCart, handleAddToFav, checkInitialFavoriteState } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    fetchFavoritos();
});

/**
 * Busca os produtos favoritos da API Django.
 */
async function fetchFavoritos() {
    const container = document.getElementById("favoritos-container");
    if (!container) {
        console.error("Elemento #favoritos-container não encontrado.");
        return;
    }
    container.innerHTML = "Carregando favoritos..."; // Mensagem de carregamento

    try {
        const token = localStorage.getItem('access_token'); // Assume JWT para autenticação
        if (!token) {
            alert('Por favor, faça login para ver seus favoritos.');
            window.location.href = '/jardim_da_diana/usuarios/templates/login.html';
            return;
        }

        const response = await fetch("http://localhost:8000/api/favoritos/", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                window.location.href = '/jardim_da_diana/usuarios/templates/login.html';
                return;
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const favoritos = await response.json();
        renderFavoritos(favoritos);
    } catch (err) {
        console.error("Erro ao buscar Favoritos:", err);
        container.innerHTML = "<p>Erro ao carregar favoritos. Tente novamente mais tarde.</p>";
    }
}

/**
 * Renderiza os produtos favoritos.
 * @param {Array} favoritos - Uma lista de objetos de produtos favoritos.
 */
function renderFavoritos(favoritos) {
    const container = document.getElementById("favoritos-container");
    container.innerHTML = ""; // Limpa o conteúdo existente

    if (favoritos.length === 0) {
        container.innerHTML = "<p>Você não tem nenhum produto favorito ainda.</p>";
        return;
    }

    favoritos.forEach(favItem => {
        const produto = favItem.produto; // Assumindo que a API retorna um objeto favorito que contém o produto
        const card = document.createElement("div");
        card.className = "favorito-card"; // Nova classe para o estilo do card de favorito
        card.innerHTML = `
            <a href="./descricao.html?id=${produto.id}" class="favorito-link-produto">
                <div class="favorito-imagem-container">
                    <img src="${produto.imagem}" alt="${produto.nome}" />
                </div>
                <h3 class="favorito-nome">${produto.nome}</h3>
                <p class="favorito-preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
            </a>
            <div class="favorito-actions">
                <button class="add-to-cart-btn" data-produto-id="${produto.id}">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button class="add-to-fav-btn" data-produto-id="${produto.id}">
                    <i class="fa-solid fa-star"></i> </button>
            </div>
        `;
        container.appendChild(card);
    });

    // Adiciona event listeners aos botões após renderizar
    container.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    container.querySelectorAll('.add-to-fav-btn').forEach(button => {
        button.addEventListener('click', handleAddToFav);
        // Opcional: verificar o estado inicial do coração, embora aqui já sejam favoritos
        checkInitialFavoriteState(button);
    });
}
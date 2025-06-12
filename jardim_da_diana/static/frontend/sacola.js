document.addEventListener("DOMContentLoaded", () => {
    fetchItensSacola();

    const finalizarPedidoBtn = document.getElementById("finalizar-pedido-btn");
    if (finalizarPedidoBtn) {
        finalizarPedidoBtn.addEventListener("click", () => {
            window.location.href = "finalizacao.html"; // Redireciona para a página de finalização
        });
    }
});

/**
 * Busca os itens do carrinho da API Django.
 */
async function fetchItensSacola() {
    const container = document.getElementById("itens-sacola-container");
    if (!container) {
        console.error("Elemento #itens-sacola-container não encontrado.");
        return;
    }
    container.innerHTML = "Carregando itens da sacola..."; // Mensagem de carregamento

    try {
        const token = localStorage.getItem('access_token'); // Assume JWT para autenticação
        if (!token) {
            alert('Por favor, faça login para ver sua sacola.');
            window.location.href = '/jardim_da_diana/usuarios/templates/login.html'; // Redireciona para login
            return;
        }

        const response = await fetch("http://localhost:8000/api/carrinho/", {
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

        const data = await response.json();
        renderItensSacola(data.itens); // Assume que a API retorna um objeto com 'itens'
        updateTotalSacola(data.total); // Assume que a API retorna um 'total'
    } catch (err) {
        console.error("Erro ao buscar itens da sacola:", err);
        container.innerHTML = "<p>Erro ao carregar a sacola. Tente novamente mais tarde.</p>";
    }
}

/**
 * Renderiza os itens na página da sacola.
 * @param {Array} itens - Uma lista de objetos de itens do carrinho.
 */
function renderItensSacola(itens) {
    const container = document.getElementById("itens-sacola-container");
    container.innerHTML = ""; // Limpa o conteúdo existente

    if (itens.length === 0) {
        container.innerHTML = "<p>Sua sacola está vazia.</p>";
        updateTotalSacola(0);
        return;
    }

    itens.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "sacola-item-card";
        itemCard.innerHTML = `
            <div class="sacola-produto-info">
                <img src="${item.produto.imagem}" alt="${item.produto.nome}" class="sacola-imagem-produto" />
                <div class="sacola-texto-info">
                    <h3>Produto - ${item.produto.nome}</h3>
                    <p>Estoque - Disponível</p>
                    <p>ID - ${item.produto.id}</p>
                </div>
            </div>
            <div class="sacola-valor">
                <span>Valor</span>
                <span class="preco-item">R$ ${parseFloat(item.produto.preco).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="sacola-quantidade">
                <span>Quantidade</span>
                <div class="quantidade-controls">
                    <button data-id="${item.id}" data-action="decrement">-</button>
                    <span>${item.quantidade}</span>
                    <button data-id="${item.id}" data-action="increment">+</button>
                </div>
            </div>
        `;
        container.appendChild(itemCard);
    });

    // Adiciona listeners para os botões de quantidade
    container.querySelectorAll('.quantidade-controls button').forEach(button => {
        button.addEventListener('click', handleQuantidadeChange);
    });
}

/**
 * Atualiza o valor total exibido na sacola.
 * @param {number} total - O valor total da sacola.
 */
function updateTotalSacola(total) {
    const totalElement = document.getElementById("total-sacola");
    if (totalElement) {
        totalElement.textContent = `R$ ${parseFloat(total).toFixed(2).replace('.', ',')}`;
    }
}

/**
 * Lida com a alteração da quantidade de um item no carrinho.
 * @param {Event} e - O evento de clique.
 */
async function handleQuantidadeChange(e) {
    const button = e.currentTarget;
    const itemId = button.dataset.id;
    const action = button.dataset.action; // 'increment' ou 'decrement'
    const token = localStorage.getItem('access_token');

    if (!token) {
        alert('Por favor, faça login para modificar a sacola.');
        window.location.href = '/jardim_da_diana/usuarios/templates/login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/carrinho/atualizar/${itemId}/`, {
            method: 'POST', // Ou PUT, dependendo da sua API
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ action: action })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Erro ao ${action}ar quantidade.`);
        }

        // Se a atualização for bem-sucedida, busca os itens novamente para refletir as mudanças
        fetchItensSacola();
    } catch (error) {
        console.error('Erro ao alterar quantidade do item:', error);
        alert(`Erro ao alterar quantidade: ${error.message || 'Tente novamente.'}`);
    }
}
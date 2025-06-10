document.addEventListener("DOMContentLoaded", () => {
    fetchCarrinho();
    document.getElementById("finalizar-pedido-btn").addEventListener("click", finalizarPedido);
});

async function fetchCarrinho() {
    try {
        const response = await fetch('http://localhost:8000/api/carrinho/'); // API do Django para obter itens do carrinho
        if (!response.ok) {
            throw new Error(Erro HTTP! Status: ${response.status});
        }
        const data = await response.json();
        renderCarrinho(data.itens, data.total_geral); // Supondo que a API retorne 'itens' e 'total_geral'
    } catch (error) {
        console.error("Erro ao buscar o carrinho:", error);
        document.getElementById("itens-sacola").innerHTML = "<p>Erro ao carregar sua sacola. Tente novamente.</p>";
    }
}

function renderCarrinho(itensCarrinho, totalGeral) {
    const itensSacolaDiv = document.getElementById("itens-sacola");
    itensSacolaDiv.innerHTML = ""; // Limpa o conteúdo existente

    if (itensCarrinho && itensCarrinho.length > 0) {
        let subtotal = 0;
        itensCarrinho.forEach(item => {
            const itemHTML = `
                <div class="item-sacola" data-item-id="${item.id}" data-produto-id="${item.produto.id}">
                    <img src="${item.produto.imagem}" alt="${item.produto.nome}">
                    <div class="item-info">
                        <h3>${item.produto.nome}</h3>
                        <p>${item.produto.descricao || ''}</p>
                    </div>
                    <div class="item-quantidade">
                        <button class="btn-quantidade" data-action="decrement" data-item-id="${item.id}">-</button>
                        <input type="number" value="${item.quantidade}" min="1" class="quantidade-input" data-item-id="${item.id}">
                        <button class="btn-quantidade" data-action="increment" data-item-id="${item.id}">+</button>
                    </div>
                    <span class="item-preco">R$ ${parseFloat(item.preco_total).toFixed(2).replace('.', ',')}</span>
                    <button class="remover-item" data-item-id="${item.id}">Remover</button>
                </div>
            `;
            itensSacolaDiv.insertAdjacentHTML('beforeend', itemHTML);
            subtotal += parseFloat(item.preco_total);
        });

        // Atualiza os totais
        document.getElementById("total-itens").textContent = R$ ${subtotal.toFixed(2).replace('.', ',')};
        // Frete pode ser calculado no backend ou ter um valor fixo
        const valorFrete = 15.00; // Exemplo de frete fixo
        document.getElementById("valor-frete").textContent = R$ ${valorFrete.toFixed(2).replace('.', ',')};
        document.getElementById("total-geral").textContent = R$ ${(subtotal + valorFrete).toFixed(2).replace('.', ',')};

        // Adiciona eventos aos botões de quantidade e remoção
        itensSacolaDiv.querySelectorAll('.btn-quantidade').forEach(button => {
            button.addEventListener('click', updateQuantidade);
        });
        itensSacolaDiv.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', updateQuantidadeManual);
        });
        itensSacolaDiv.querySelectorAll('.remover-item').forEach(button => {
            button.addEventListener('click', removerItemCarrinho);
        });

    } else {
        itensSacolaDiv.innerHTML = "<p>Sua sacola está vazia.</p>";
        document.getElementById("total-itens").textContent = "R$ 0,00";
        document.getElementById("valor-frete").textContent = "R$ 0,00";
        document.getElementById("total-geral").textContent = "R$ 0,00";
    }
}

async function updateQuantidade(event) {
    const button = event.target;
    const itemId = button.dataset.itemId;
    const action = button.dataset.action;
    const input = document.querySelector(.quantidade-input[data-item-id="${itemId}"]);
    let newQuantity = parseInt(input.value);

    if (action === 'increment') {
        newQuantity++;
    } else if (action === 'decrement' && newQuantity > 1) {
        newQuantity--;
    } else if (action === 'decrement' && newQuantity === 1) {
        // Se a quantidade for 1 e tentar decrementar, remove o item
        removerItemCarrinho({ target: { dataset: { itemId: itemId } } });
        return;
    }

    // Atualiza a quantidade no input imediatamente para feedback visual
    input.value = newQuantity;

    try {
        const response = await fetch(`http://localhost:8000/api/carrinho/atualizar/${itemId}/`, {
            method: 'PATCH', // Ou PUT, dependendo da sua API Django
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ quantidade: newQuantity })
        });
        if (!response.ok) {
            throw new Error(Erro ao atualizar quantidade! Status: ${response.status});
        }
        await fetchCarrinho(); // Recarrega o carrinho para atualizar totais e preços
    } catch (error) {
        console.error("Erro ao atualizar a quantidade:", error);
        alert('Erro ao atualizar quantidade. Tente novamente.');
        fetchCarrinho(); // Recarrega para reverter se houver erro no backend
    }
}

async function updateQuantidadeManual(event) {
    const input = event.target;
    const itemId = input.dataset.itemId;
    let newQuantity = parseInt(input.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        alert("A quantidade deve ser um número válido e maior que zero.");
        fetchCarrinho(); // Recarrega para restaurar a quantidade original
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/carrinho/atualizar/${itemId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ quantidade: newQuantity })
        });
        if (!response.ok) {
            throw new Error(Erro ao atualizar quantidade! Status: ${response.status});
        }
        await fetchCarrinho();
    } catch (error) {
        console.error("Erro ao atualizar a quantidade:", error);
        alert('Erro ao atualizar quantidade. Tente novamente.');
        fetchCarrinho();
    }
}

async function removerItemCarrinho(event) {
    const itemId = event.target.dataset.itemId;
    if (!confirm("Tem certeza que deseja remover este item da sacola?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/carrinho/remover/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        if (!response.ok) {
            throw new Error(Erro ao remover item! Status: ${response.status});
        }
        alert('Item removido da sacola!');
        await fetchCarrinho(); // Recarrega o carrinho
    } catch (error) {
        console.error("Erro ao remover item:", error);
        alert('Erro ao remover item da sacola. Tente novamente.');
    }
}

async function finalizarPedido() {
    // Nesta etapa, você pode redirecionar para uma página de checkout
    // ou fazer uma requisição POST para uma API de finalização de pedido.
    alert('Redirecionando para a página de finalização do pedido...');
    // Exemplo de requisição para finalizar o pedido (ajuste conforme sua API)
    try {
        const response = await fetch('http://localhost:8000/api/pedidos/finalizar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({}) // Envie dados adicionais se necessário (e.g., endereço)
        });

        if (!response.ok) {
            throw new Error(Erro ao finalizar pedido! Status: ${response.status});
        }
        const data = await response.json();
        alert('Pedido finalizado com sucesso! ID do Pedido: ' + data.pedido_id);
        window.location.href = '{% url "confirmacao_pedido" %}?pedido_id=' + data.pedido_id; // Redireciona
    } catch (error) {
        console.error("Erro ao finalizar o pedido:", error);
        alert('Erro ao finalizar o pedido. Tente novamente.');
    }
}

// Função auxiliar para pegar o CSRF token do cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
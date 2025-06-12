import { getCookie } from './utils.js'; // Importa getCookie de utils.js

document.addEventListener("DOMContentLoaded", () => {
    fetchDadosPedidoParaFinalizacao();

    const confirmarPedidoBtn = document.getElementById("confirmar-pedido-btn");
    if (confirmarPedidoBtn) {
        confirmarPedidoBtn.addEventListener("click", handleConfirmarPedido);
    }
    
    // Define as datas iniciais
    setInitialDates();
});

function setInitialDates() {
    const dataRealizacaoElement = document.getElementById('data-realizacao-pedido');
    const dataEstimadaElement = document.getElementById('data-estimada-entrega');

    const hoje = new Date();
    const dataRealizacao = hoje.toLocaleDateString('pt-BR'); // Formato dd/mm/yyyy

    // Estima a entrega para 15 dias após a data de hoje
    const dataEstimada = new Date(hoje);
    dataEstimada.setDate(hoje.getDate() + 15); // Adiciona 15 dias
    const dataEstimadaFormatada = dataEstimada.toLocaleDateString('pt-BR');

    if (dataRealizacaoElement) {
        dataRealizacaoElement.textContent = dataRealizacao;
    }
    if (dataEstimadaElement) {
        dataEstimadaElement.textContent = dataEstimadaFormatada;
    }
}


/**
 * Busca os dados do carrinho para exibição na página de finalização.
 */
async function fetchDadosPedidoParaFinalizacao() {
    const resumoContainer = document.getElementById("itens-pedido-resumo");
    const totalElement = document.getElementById("total-final-pedido");

    if (!resumoContainer || !totalElement) {
        console.error("Elementos de resumo/total não encontrados na finalização.");
        return;
    }
    resumoContainer.innerHTML = "Carregando resumo do pedido...";

    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Por favor, faça login para finalizar seu pedido.');
            window.location.href = '/jardim_da_diana/usuarios/templates/login.html';
            return;
        }

        const response = await fetch("http://localhost:8000/api/carrinho/", { // Reusa a API do carrinho
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
        renderResumoPedido(data.itens, data.total);
    } catch (err) {
        console.error("Erro ao buscar dados do carrinho para finalização:", err);
        resumoContainer.innerHTML = "<p>Erro ao carregar o resumo do pedido.</p>";
        totalElement.textContent = "R$ 0,00";
    }
}

/**
 * Renderiza o resumo dos itens do pedido e o total.
 * @param {Array} itens - Lista de itens do carrinho.
 * @param {number} total - O valor total do carrinho.
 */
function renderResumoPedido(itens, total) {
    const resumoContainer = document.getElementById("itens-pedido-resumo");
    const totalElement = document.getElementById("total-final-pedido");
    resumoContainer.innerHTML = "";

    if (itens.length === 0) {
        resumoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElement.textContent = "R$ 0,00";
        return;
    }

    itens.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `Produto - ${item.produto.nome} - R$ ${parseFloat(item.produto.preco).toFixed(2).replace('.', ',')}`;
        resumoContainer.appendChild(p);
    });

    totalElement.textContent = `R$ ${parseFloat(total).toFixed(2).replace('.', ',')}`;
}

/**
 * Lida com o clique no botão "Confirmar Pedido".
 */
async function handleConfirmarPedido() {
    const endereco = document.getElementById("campo-endereco").value;
    const formaPagamento = document.querySelector('input[name="forma_pagamento"]:checked').value;
    const totalPedido = parseFloat(document.getElementById("total-final-pedido").textContent.replace('R$', '').replace(',', '.'));

    if (!endereco.trim()) {
        alert("Por favor, preencha o endereço de entrega.");
        return;
    }
    
    if (totalPedido <= 0) {
        alert("Não é possível finalizar um pedido vazio.");
        return;
    }

    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Você precisa estar logado para confirmar o pedido.');
            window.location.href = '/jardim_da_diana/usuarios/templates/login.html';
            return;
        }

        const response = await fetch('http://localhost:8000/api/pedidos/criar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                endereco_entrega: endereco,
                forma_pagamento: formaPagamento
                // O backend deve pegar os itens do carrinho automaticamente,
                // ou você pode enviar uma lista de IDs de produtos/quantidades se a API exigir.
                // Por agora, presumimos que a API sabe o carrinho do usuário logado.
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao finalizar o pedido.');
        }

        const data = await response.json();
        alert('Pedido realizado com sucesso! Número do pedido: ' + data.numero_pedido);
        console.log('Pedido realizado:', data);
        // Opcional: Limpar o carrinho após a finalização
        // window.location.href = 'pagina_de_confirmacao.html?pedido=' + data.numero_pedido;
    } catch (error) {
        console.error('Erro ao confirmar pedido:', error);
        alert(`Erro ao finalizar o pedido: ${error.message || 'Tente novamente.'}`);
    }
}

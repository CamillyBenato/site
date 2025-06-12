document.addEventListener("DOMContentLoaded", () => {
    // Garante que o código só é executado após o DOM estar completamente carregado.
    fetchProdutos();
});

/**
 * Busca a lista de produtos da API Django.
 */
function fetchProdutos() {
    fetch("http://localhost:8000/api/produtos/")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(produtos => {
            renderCarrossel(produtos);
            renderTodosProdutos(produtos);
        })
        .catch(err => console.error("Erro ao buscar Produtos:", err));
}

/**
 * Renderiza os produtos no carrossel.
 * @param {Array} produtos - Uma lista de objetos de produtos.
 */
function renderCarrossel(produtos) {
    const container = document.getElementById("produtos-container");
    if (!container) {
        console.error("Elemento #produtos-container não encontrado.");
        return;
    }
    container.innerHTML = ""; // Limpa o conteúdo existente

    const quantidadeCarrossel = 7;
    produtos.slice(0, quantidadeCarrossel).forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto";
        card.innerHTML = `
            <div class="imagem-container">
                <a href="./descricao.html?id=${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}" />
                </a>
            </div>
            <button class="add-to-cart-btn" data-produto-id="${produto.id}">Adicionar ao Carrinho</button>
            <button class="add-to-fav-btn" data-produto-id="${produto.id}"><i class="fa-regular fa-heart"></i></button>
        `;
        container.appendChild(card);
    });
    // Adiciona event listeners após renderizar os produtos do carrossel.
    addEventListenersToButtons();
}

/**
 * Renderiza todos os produtos (ou uma quantidade limitada) na seção principal.
 * @param {Array} produtos - Uma lista de objetos de produtos.
 */
function renderTodosProdutos(produtos) {
    const todosContainer = document.getElementById("produtos-todos");
    if (!todosContainer) {
        console.error("Elemento #produtos-todos não encontrado.");
        return;
    }
    todosContainer.innerHTML = ""; // Limpa o conteúdo existente

    // Limita a quantidade de produtos para "Mais Vendidos" se necessário.
    const quantidadeMaisVendidos = 8;
    produtos.slice(0, quantidadeMaisVendidos).forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto-item";
        card.innerHTML = `
            <div class="produto-completo">
                <a href="./descricao.html?id=${produto.id}">
                    <div class="imagem-produto">
                        <img src="${produto.imagem}" alt="${produto.nome}" />
                    </div>
                    <div class="descricao-produto">
                        <h1>${produto.nome}</h1>
                        <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
                    </div>
                </a>
            </div>
            <button class="add-to-cart-btn" data-produto-id="${produto.id}">Adicionar ao Carrinho</button>
            <button class="add-to-fav-btn" data-produto-id="${produto.id}"><i class="fa-regular fa-heart"></i></button>
        `;
        todosContainer.appendChild(card);
    });
    // Adiciona event listeners após renderizar os "todos os produtos".
    addEventListenersToButtons();
}

/**
 * Adiciona event listeners para os botões "Adicionar ao Carrinho" e "Adicionar aos Favoritos".
 * Esta função é chamada após a renderização dos produtos para garantir que os botões existam no DOM.
 */
function addEventListenersToButtons() {
    // Listeners para os botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        // Remove listeners anteriores para evitar duplicação (importante se a função for chamada múltiplas vezes)
        button.removeEventListener('click', handleAddToCart);
        button.addEventListener('click', handleAddToCart);
    });

    // Listeners para os botões "Adicionar aos Favoritos"
    document.querySelectorAll('.add-to-fav-btn').forEach(button => {
        // Remove listeners anteriores para evitar duplicação
        button.removeEventListener('click', handleAddToFav);
        button.addEventListener('click', handleAddToFav);
    });
}

/**
 * Lida com o clique no botão "Adicionar ao Carrinho".
 * @param {Event} e - O objeto do evento de clique.
 */
async function handleAddToCart(e) {
    const produtoId = e.target.dataset.produtoId;
    try {
        const response = await fetch('http://localhost:8000/api/carrinho/adicionar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Para Django, você pode precisar do CSRF token para requisições POST.
                // Se estiver usando sessões baseadas em cookie, o navegador gerencia o cookie.
                // Se estiver usando JWT, adicione:
                // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                'X-CSRFToken': getCookie('csrftoken') // Função auxiliar para pegar o token CSRF
            },
            body: JSON.stringify({ produto_id: produtoId, quantidade: 1 })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Produto adicionado ao carrinho:', data);
            alert('Produto adicionado ao carrinho!');
            // Opcional: Atualizar o número de itens na sacola no cabeçalho
        } else {
            const errorData = await response.json();
            console.error('Erro ao adicionar produto ao carrinho:', errorData);
            alert(`Erro ao adicionar produto ao carrinho: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro de rede ao adicionar ao carrinho:', error);
        alert('Erro de rede ao adicionar ao carrinho.');
    }
}

/**
 * Lida com o clique no botão "Adicionar aos Favoritos".
 * Esta função agora tenta adicionar/remover o favorito e atualiza o ícone do coração.
 * @param {Event} e - O objeto do evento de clique.
 */
async function handleAddToFav(e) {
    // Certifica-se de que estamos pegando o data-produto-id do botão em si, não do ícone filho.
    const button = e.currentTarget;
    const produtoId = button.dataset.produtoId;
    const icon = button.querySelector('i'); // Assumindo que o ícone está dentro do botão

    try {
        const token = localStorage.getItem('access_token'); // Exemplo para JWT
        if (!token) {
            alert('Por favor, faça login para adicionar aos favoritos.');
            // Redireciona para sua página de login. Ajuste o caminho.
            window.location.href = './login.html';
            return;
        }

        // Tenta adicionar o favorito. Se já existir, a API pode retornar um status diferente ou um erro.
        const addResponse = await fetch('http://localhost:8000/api/favoritos/adicionar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Inclui o token de autenticação
                'X-CSRFToken': getCookie('csrftoken') // CSRF token também pode ser necessário aqui
            },
            body: JSON.stringify({ produto_id: produtoId })
        });

        if (addResponse.status === 201) { // 201 Created - Favorito adicionado com sucesso
            alert('Produto adicionado aos favoritos!');
            if (icon) icon.classList.replace('fa-regular', 'fa-solid'); // Altera para coração preenchido
        } else if (addResponse.status === 400 || addResponse.status === 409) { // 400 Bad Request ou 409 Conflict
            // Se a API indicar que já é favorito (ex: por uma mensagem de erro ou status específico)
            // ou se o backend criar a duplicidade e retornar 200, podemos tentar remover.
            // Aqui assumimos que 400/409 significa "já existe" ou erro de validação.
            const errorData = await addResponse.json();
            if (errorData.error && errorData.error.includes("já está nos favoritos")) { // Exemplo de mensagem de erro
                const confirmRemove = confirm('Este produto já está nos seus favoritos. Deseja removê-lo?');
                if (confirmRemove) {
                    await removeFavorite(produtoId, token, icon);
                } else {
                    alert('Produto já estava nos favoritos.');
                    if (icon) icon.classList.replace('fa-regular', 'fa-solid'); // Garante que o ícone esteja preenchido
                }
            } else {
                console.error('Erro ao adicionar favorito:', errorData);
                alert(`Erro ao adicionar favorito: ${errorData.error || addResponse.statusText}`);
            }
        } else {
            // Outros erros da API (ex: 401 Unauthorized, 500 Internal Server Error)
            const errorData = await addResponse.json();
            console.error('Erro inesperado ao adicionar favorito:', errorData);
            alert(`Erro ao adicionar favorito: ${errorData.error || addResponse.statusText}`);
        }
    } catch (error) {
        console.error('Erro de rede ao adicionar/remover favorito:', error);
        alert('Erro de rede ao adicionar/remover favorito.');
    }
}

/**
 * Remove um produto dos favoritos.
 * @param {string} produtoId - O ID do produto a ser removido.
 * @param {string} token - O token de autenticação do usuário.
 * @param {HTMLElement} icon - O elemento <i> do ícone do coração.
 */
async function removeFavorite(produtoId, token, icon) {
    try {
        // Correção: Use crases (`) para template literals em URLs
        const deleteResponse = await fetch(`http://localhost:8000/api/favoritos/remover/${produtoId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken') // CSRF token
            }
        });

        if (deleteResponse.status === 204) { // 204 No Content - Favorito removido com sucesso
            alert('Produto removido dos favoritos.');
            if (icon) icon.classList.replace('fa-solid', 'fa-regular'); // Altera para coração vazio
        } else if (deleteResponse.status === 404) { // 404 Not Found - Favorito não encontrado (já removido ou nunca existiu)
            alert('Este produto não estava nos seus favoritos ou já foi removido.');
            if (icon) icon.classList.replace('fa-solid', 'fa-regular'); // Garante que o ícone esteja vazio
        } else {
            const errorData = await deleteResponse.json();
            console.error('Erro ao remover favorito:', errorData);
            alert(`Erro ao remover favorito: ${errorData.error || deleteResponse.statusText}`);
        }
    } catch (error) {
        console.error('Erro de rede ao remover favorito:', error);
        alert('Erro de rede ao remover favorito.');
    }
}

function showMenu() {
    document.getElementById("dropdown").style.display = "flex";
}
function hideMenu() {
    document.getElementById("dropdown").style.display = "none";
}


/**
 * Função auxiliar para obter o valor de um cookie específico pelo nome.
 * Usada para pegar o 'csrftoken' necessário para requisições Django que modificam dados.
 * @param {string} name - O nome do cookie a ser buscado.
 * @returns {string|null} O valor do cookie ou null se não for encontrado.
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verifica se a string do cookie começa com o nome desejado.
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
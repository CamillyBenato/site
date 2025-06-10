document.addEventListener("DOMContentLoaded", () => {
    // Garante que o código só é executado após o DOM estar completamente carregado.
    fetchFavoritos();
});

/**
 * Busca a lista de produtos favoritos da API Django.
 */
async function fetchFavoritos() {
    try {
        // Faz uma requisição GET para sua API de favoritos.
        const response = await fetch('http://localhost:8000/api/favoritos/');

        // Verifica se a resposta da requisição foi bem-sucedida (status 200-299).
        if (!response.ok) {
            // Se não for bem-sucedida, lança um erro com o status HTTP.
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        // Converte a resposta JSON em um objeto JavaScript.
        const data = await response.json();

        // Chama a função para renderizar os produtos favoritos na página.
        renderFavoritos(data);
    } catch (error) {
        // Captura e exibe erros que ocorrem durante a busca dos favoritos.
        console.error("Erro ao buscar os favoritos:", error);
        // Exibe uma mensagem de erro amigável ao usuário na div de favoritos.
        document.getElementById("itens-favoritos").innerHTML = "<p>Erro ao carregar seus favoritos. Tente novamente.</p>";
    }
}

/**
 * Renderiza a lista de produtos favoritos na interface do usuário.
 * @param {Array} produtosFavoritos - Uma lista de objetos de produtos favoritos.
 */
function renderFavoritos(produtosFavoritos) {
    const itensFavoritosDiv = document.getElementById("itens-favoritos");
    // Limpa qualquer conteúdo existente na div antes de adicionar novos itens.
    itensFavoritosDiv.innerHTML = "";

    // Verifica se há produtos na lista e se a lista não está vazia.
    if (produtosFavoritos && produtosFavoritos.length > 0) {
        // Itera sobre cada produto favorito e cria seu card HTML.
        produtosFavoritos.forEach(produto => {
            // ATENÇÃO: Ajuste esta URL para a sua rota real de detalhes do produto no Django.
            // Exemplo 1: Se sua URL for tipo '/descricao-produto/?id=123'
            const produtoDetalheUrl = `/descricao-produto/?id=${produto.id}`;
            // Exemplo 2: Se sua URL for tipo '/produtos/123/'
            // const produtoDetalheUrl = `/produtos/${produto.id}/`;

            // Cria o HTML do card do produto usando template literals.
            const cardHTML = `
                <div class="produto-completo" data-produto-id="${produto.id}">
                    <a href="${produtoDetalheUrl}">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <p>${produto.nome}</p>
                        <span class="preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                    </a>
                    <button class="remover-favorito" data-produto-id="${produto.id}">&times;</button>
                </div>
            `;
            // Adiciona o card HTML ao final da div de favoritos.
            itensFavoritosDiv.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Adiciona listeners de evento para os botões de remover favoritos.
        itensFavoritosDiv.querySelectorAll('.remover-favorito').forEach(button => {
            button.addEventListener('click', removerDosFavoritos);
        });
    } else {
        // Se não houver produtos favoritos, exibe uma mensagem.
        itensFavoritosDiv.innerHTML = "<p>Você ainda não adicionou nenhum item aos favoritos.</p>";
    }
}

/**
 * Remove um item dos favoritos via requisição DELETE para a API Django.
 * @param {Event} event - O objeto do evento de clique.
 */
async function removerDosFavoritos(event) {
    // Obtém o ID do produto do atributo 'data-produto-id' do botão clicado.
    const produtoId = event.target.dataset.produtoId;

    // Pede confirmação ao usuário antes de remover.
    if (!confirm("Tem certeza que deseja remover este item dos favoritos?")) {
        return; // Sai da função se o usuário cancelar.
    }

    try {
        // Faz uma requisição DELETE para a API Django para remover o item.
        // O CSRF token é necessário para requisições que modificam dados no Django.
        const response = await fetch(`http://localhost:8000/api/favoritos/remover/${produtoId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // Pega o CSRF token do cookie.
            }
        });

        // Verifica se a remoção foi bem-sucedida.
        if (!response.ok) {
            throw new Error(`Erro ao remover favorito! Status: ${response.status}`);
        }

        // Informa ao usuário que o item foi removido.
        alert('Item removido dos favoritos!');
        // Recarrega a lista de favoritos para atualizar a interface.
        await fetchFavoritos();
    } catch (error) {
        // Captura e exibe erros que ocorrem durante a remoção.
        console.error("Erro ao remover favorito:", error);
        alert('Erro ao remover item dos favoritos. Tente novamente.');
    }
}

/**
 * Função auxiliar para obter o valor de um cookie específico pelo nome.
 * Usada para pegar o 'csrftoken' necessário para requisições Django.
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
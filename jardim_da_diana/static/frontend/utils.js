/**
 * Obtém o valor de um cookie específico.
 * @param {string} name - O nome do cookie a ser procurado.
 * @returns {string|null} O valor do cookie, ou null se não for encontrado.
 */
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verifica se o cookie começa com o nome desejado
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Envia uma requisição POST para adicionar um produto ao carrinho.
 * @param {Event} event - O evento de clique que disparou a função.
 */
export async function handleAddToCart(event) {
    const produtoId = event.currentTarget.dataset.produtoId;
    if (!produtoId) {
        console.error('ID do produto não encontrado no botão de adicionar à sacola.');
        alert('Erro: ID do produto não encontrado.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/carrinho/adicionar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Importante para Django CSRF
            },
            body: JSON.stringify({ produto_id: produtoId, quantidade: 1 })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao adicionar produto ao carrinho.');
        }

        const data = await response.json();
        alert('Produto adicionado à sacola!');
        console.log('Produto adicionado:', data);
        // Você pode adicionar lógica aqui para atualizar o contador da sacola no header, por exemplo.
    } catch (error) {
        console.error('Erro ao adicionar produto à sacola:', error);
        alert(`Erro ao adicionar o produto à sacola: ${error.message || 'Tente novamente.'}`);
    }
}

/**
 * Envia uma requisição POST para adicionar/remover um produto dos favoritos.
 * @param {Event} event - O evento de clique que disparou a função.
 */
export async function handleAddToFav(event) {
    const button = event.currentTarget;
    const produtoId = button.dataset.produtoId;
    const icon = button.querySelector('i'); // Seleciona o ícone dentro do botão

    if (!produtoId) {
        console.error('ID do produto não encontrado no botão de favoritos.');
        alert('Erro: ID do produto não encontrado.');
        return;
    }

    // Você pode adicionar uma verificação de autenticação aqui, se desejar
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //     alert('Por favor, faça login para adicionar produtos aos favoritos.');
    //     window.location.href = '/jardim_da_diana/usuarios/templates/login.html'; // Ajuste o caminho
    //     return;
    // }

    try {
        const response = await fetch('http://localhost:8000/api/favoritos/alternar/', { // Supondo uma API para alternar favoritos
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                // 'Authorization': `Bearer ${token}` // Descomente se usar JWT
            },
            body: JSON.stringify({ produto_id: produtoId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao alternar o status de favorito.');
        }

        const data = await response.json();
        
        if (data.status === 'added') {
            alert('Produto adicionado aos favoritos!');
            if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        } else if (data.status === 'removed') {
            alert('Produto removido dos favoritos!');
            if (icon) {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }
        console.log('Favorito status:', data);
    } catch (error) {
        console.error('Erro ao alternar favorito:', error);
        alert(`Erro ao adicionar/remover dos favoritos: ${error.message || 'Tente novamente.'}`);
    }
}

/**
 * Verifica o estado inicial de favorito de um produto ao carregar a página.
 * @param {HTMLElement} button - O botão de favoritos.
 */
export async function checkInitialFavoriteState(button) {
    const produtoId = button.dataset.produtoId;
    const icon = button.querySelector('i');

    if (!produtoId || !icon) {
        return; // Não faz nada se não houver ID ou ícone
    }

    // Adicione a verificação de autenticação aqui também para que o ícone inicial seja correto
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //     icon.classList.remove('fa-solid');
    //     icon.classList.add('fa-regular');
    //     return; // Não verifica favoritos se o usuário não estiver logado
    // }

    try {
        const response = await fetch(`http://localhost:8000/api/favoritos/verificar/${produtoId}/`, {
            // headers: { 'Authorization': `Bearer ${token}` } // Descomente se usar JWT
        });
        
        if (!response.ok) {
            console.warn(`Não foi possível verificar o status de favorito para o produto ${produtoId}. Status: ${response.status}`);
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular'); // Em caso de erro ou não logado, o ícone fica regular
            return;
        }

        const data = await response.json();

        if (data.is_favorite) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
        }
    } catch (error) {
        console.error('Erro ao verificar status inicial de favoritos:', error);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular'); // Em caso de erro de rede, o ícone fica regular
    }
}

/**
 * Verifica se o usuário está autenticado.
 * @returns {Promise<boolean>} True se autenticado, false caso contrário.
 */
export async function isAuthenticated() {
    try {
        const response = await fetch('http://localhost:8000/api/check-auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.is_authenticated;
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
}

/**
 * Redireciona para a página de perfil ou login com base no status de autenticação.
 */
export async function redirectToProfileOrLogin() {
    const loggedIn = await isAuthenticated();
    if (loggedIn) {
        window.location.href = '/jardim_da_diana/static/frontend/index.html'; 
    } else {
        window.location.href = '/jardim_da_diana/usuarios/templates/login.html'; 
    }
}
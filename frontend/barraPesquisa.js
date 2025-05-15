const pesquisaInput = document.getElementById("campo-pesquisa");

pesquisaInput.addEventListener('input', (event) => { // será mostrado no console
    const value = formaString(event.target.value);

    const produtos = document.querySelectorAll('#produtos-todos .produto-completo'); // mais de um item
    const noResults = document.getElementById('no_results');

    let hasResults = false;
    
    if (value !== '') {
        produtos.forEach(produto => {
            const produtoNome = produto.querySelector('.nomeProduto').textContent; // Pesquisar apenas o título
            if (formaString(produtoNome).indexOf(value) !== -1) { // !== (diferente)
                produto.style.display = 'flex';
                hasResults = true;
            } else {
                produto.style.display = 'none';
            }
        });

        if (hasResults) { // irá mostrar os resultados 
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    } else {
        produtos.forEach(produto => produto.style.display = 'flex'); // mostrar todos novamente

        noResults.style.display = 'none';
    }
});

// função para limpar e padronizar a string
function formaString(value) {
    return value
        .toLowerCase() // toLowerCase (identificar a letra mesmo se estiver minúscula)
        .trim() // trim (tirar espaços em branco no começo/fim)
        .normalize('NFD') // transforma os acentos em outros caracteres
        .replace(/[\u0300-\u036f]/g, ''); // remove acentos
}
const searchInput = document.getElementById("header-center");

searchInput.addEventListener('input', (event) => {//será mostrado no console
    const value= formaString(event.target.value);

    const produtos= document.querySelectorAll('produtos-todos');//mais de um item
    const noResults= document.getElementById('no_results');

    let hasResuls= false;
if (value !== '') {
    produtos.array.forEach(element => {
        const produtoNome= produto.querySelectorAll('produto.nome').textContent;//Pesquisar apenas o título
        if(formaString(produtoName).indexOf(value) !== -1){//!==(diferente)
            produto.style.display= 'flex';

            hasResuls= true;
        }else{
            produto.style.display= 'none'
        }
    });
    
    if (hasResuls) {//irá mostrar os resultados 
        noResults.style.display= 'none';
    }else{
        noResults.style.display= 'block'
    }
}else{
    produto.array.forEach(produto => produto.style.display= 'flex');

    noResults.style.display= 'none';
}
})
function formaString(value) {
    return value
    .tolowerCase()//tolowerCase(identificar a letra mesmo se estiver minúscula)
    .trim()//trim(tirar espaços em brancos no console)
    .normalLize('NFD')//transforma os acetos em outro caracter
    .replace(/[\u0300-\u036f]/g, '');

}
const searchInput= document.getElementById(newLocal)
document.querySelectorAll('.link-scroll').forEach(link => { //Procurar todos os elementos que tem a classe link-scroll
    link.addEventListener('click', function (e) { //Quando clicar ele vai fazer algo
        e.preventDefault(); // Impede o comportamento padrão do link

        const targetUrl = this.getAttribute('data-target'); //Pega o valor do atributo

        window.location.href = targetUrl; //Vai para a página que pegou do data-target
    });
});
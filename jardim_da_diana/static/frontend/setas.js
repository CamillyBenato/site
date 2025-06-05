document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".carrossel-wrapper");
    const esquerda = document.getElementById("seta-esquerda");
    const direita = document.getElementById("seta-direita");
  
    esquerda.addEventListener("click", () => {
      container.scrollBy({ left: -300, behavior: "smooth" });
    });
  
    direita.addEventListener("click", () => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    });
  });
  
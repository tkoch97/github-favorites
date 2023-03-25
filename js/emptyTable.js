export function createEmptyTable() {
  const tbody = document.querySelector('tbody'); //Selecionando o tbody no HTML
  const trEmptytable = document.createElement('tr'); //Criar um elemento tr no tbody

  // Adicionando conteúdo HTML no trEmptyable
  trEmptytable.innerHTML = `
    <td class="no_favorites">
      <img src="./assets/nonefavoritesicon.svg" alt="star img">
      <p>No Favorites Yet</p>
    </td>
    `
    //Função para adicionar o trEmptyTable no tbody apenas se o número de elementos filho for nulo.
    function addContent() { 
      if (tbody.childElementCount === 0) {
        tbody.appendChild(trEmptytable);
      }
    }

    window.addEventListener('load', addContent); //Evento para acionar o addContent quando a página carregar

    // O Mutation Observer serve observar alterações feitas na árvore DOM. Aqui ele executa o comando addContent
    const observer = new MutationObserver(() => {
      addContent();
    });
    
    // Configurando o Mutation Observer para detectar mudanças de DOM nos filhos do tbody. Ou seja, se há alguma mudança e
    // o tbody ficar vazio, o addContent é acionado
    observer.observe(tbody, {
      childList: true,
    });
}
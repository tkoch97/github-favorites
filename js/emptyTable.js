export function createEmptyTable() {
  const tbody = document.querySelector('tbody');
  const trEmptytable = document.createElement('tr');
  trEmptytable.innerHTML = `
    <td class="no_favorites">
      <img src="/assets/nonefavoritesicon.svg" alt="star img">
      <p>No Favorites Yet</p>
    </td>
    `
    function addContent() {
      if (tbody.childElementCount === 0) {
        tbody.appendChild(trEmptytable);
      }
    }
    window.addEventListener('load', addContent)
 
}
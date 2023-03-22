export class CreateEmptyTable {

  createEmptyTable()
  
  createEmptyTable() {
    const tbody = document.querySelector('table tbody')
    
    tbody.innerHTML = `
      <td class="no_favorites">
        <img src="/assets/nonefavoritesicon.svg" alt="star img">
        <p>No Favorites Yet</p>
      </td>
    `
    return tbody
  }

 
}




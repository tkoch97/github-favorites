import { GithubUser } from "./githubUser.js"

// Criar uma classe para trabalhar com a lógica dos dados e como os dados serão estruturados

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.loadData()
  }

//No loadData estou aribuindo ao entries o valor da key '@github-favorites' que deve estar no localStorage. Caso o localStorage esteja vazio, o valor será de uma array vazia
  
  loadData() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries)) //salvando as entradas no localStorage
  }

// Criar uma função assíncrona para adicionar um usuário favorito a lista

  async addFavorite(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
  
      if(userExists) {
        throw new Error ('Usuário já cadastrado.')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error ('Usuário não encontrado.')
      }

      this.entries = [user, ...this.entries] // seguindo a lei da imutabilidade, estamos adicionando um novo user nas entradas(entries) que nós temos, criando um novo array.
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

//Filter é uma Higher-order function (funções que usamos muito) 
//que permite que filtremos uma das entradas da array, se colocarmos um retorno 'false', eliminamos do array, se o retorno for 'true', adicionamos no array.
//No caso, se o entry.login for diferente do user.login o retorno vai ser verdadeiro, enão manen-se o dado, caso contrário, o dado é retirado.
// O 'this.entries.filter' trabalha com a lei da imutabilidade, que retorna um novo array e não faz a alteração na array antiga. Ele troca uma pela outra.

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login) 
    this.entries = filteredEntries
    this.update()
    this.save()
  }

}


// Criar outra classe para criar a visualização e os eventos do HTML

// A classe FavoritesView está extendendo a Favorites, assim herdando seus atributos.
// O super funciona como uma espécie de "copia e cola", onde pega o constructor do Favorites e faz ele existir tbm no FavoritesView.
//O "querySelectorAll" vai funcionar como uma arrayLike, ou seja, semelhante a uma array, onde podemos tbm aplicar propriedades comuns as arrays.
// Utilizei o "forEach (para cada)" para criar uma função que vai remover cada "tr" presente no "tbody"
// criando a função "RemoveAllTr" separada e chamando ela dentro da "update", usamos o conceito de clean code. Onde uma função tem sua tarefa específica e recebe um nome exclarecedor sobre o que faz.
// No createRow criei uma variável "tr" que tem como valor a criação de um elemento tr no documento HTML, que logo abaixo recebe a propriedade "innerHTML", responsável por introduzir um conteúdo HTML no tr.
// O "this.entries.forEach" pega cada um dos objetos contidos na array 'entries (entradas)', nomeia cada um como "user" e cria uma variável "row" que executa a função "createRow" e muda o valor de cada elemento HTML baseado nos dados dos users
// O comando "this.tbody.append (acrescentar)" acrescenta cada linha criada, baseada nos users, dentro do tbody, formando assim as linhas da tabela.

export class FavoritesView extends Favorites {
  constructor(root){
    super(root) //aqui estamos apenas selecionando o root (no nosso caso, a div #app).

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAddFavorite()
  }

  onAddFavorite() {
    const favoriteButton = this.root.querySelector('.input-space .favorite-button')
    favoriteButton.onclick = () => {
      const { value } = this.root.querySelector('.input-space #input-search')

      this.addFavorite(value)
    }
  }

  update() {
    this.removeAllTr()
    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src= `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt= `imagem de ${user.name}`
      row.querySelector('.user a').href= `https://github.com/${user.login}`
      row.querySelector('.user p').innerText= `${user.name}`
      row.querySelector('.user span').innerText= `${user.login}`
      row.querySelector('.repositories').innerText= `${user.public_repos}`
      row.querySelector('.followers').innerText= `${user.followers}`
      row.querySelector('.trash-button').onclick = () => {
        const isSure = confirm('Tem certeza que deseja deletar esse favorito? 🗑')
        if(isSure) {
          this.delete(user)
        }
      }
      this.tbody.append(row) //append é um elemento da DOM e significa 'acrescentar'
    })
  }

  createRow() {
    const tr = document.createElement('tr') // variável criada para criar uma linha (o elemento tr) no documento de HTML

    tr.innerHTML = `
        <td class="user">
          <img class="userImg" src="https://github.com/tkoch97.png" alt="Imagem de tkoch97">
          <a href="https://github.com/tkoch97" target="_blank">
            <p>Thiago Koch</p>
            <span>tkoch97</span>
          </a>
        </td>
        <td class="repositories">32</td>
        <td class="followers">25</td>
        <td>
          <button class="trash-button">
            <svg width="18" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-trash">
              <g transform="translate(1.000000, 0.000000)" fill="#E1E1E6">
                <path d="M0.982,5.073 L2.007,15.339 C2.007,15.705 2.314,16 2.691,16 L10.271,16 C10.648,16 10.955,15.705 10.955,15.339 L11.98,5.073 L0.982,5.073 L0.982,5.073 Z M7.033,14.068 L5.961,14.068 L5.961,6.989 L7.033,6.989 L7.033,14.068 L7.033,14.068 Z M9.033,14.068 L7.961,14.068 L8.961,6.989 L10.033,6.989 L9.033,14.068 L9.033,14.068 Z M5.033,14.068 L3.961,14.068 L2.961,6.989 L4.033,6.989 L5.033,14.068 L5.033,14.068 Z" class="si-glyph-fill"></path>
                <path d="M12.075,2.105 L8.937,2.105 L8.937,0.709 C8.937,0.317 8.481,0 8.081,0 L4.986,0 C4.586,0 4.031,0.225 4.031,0.615 L4.031,2.011 L0.886,2.105 C0.485,2.105 0.159,2.421 0.159,2.813 L0.159,3.968 L12.8,3.968 L12.8,2.813 C12.801,2.422 12.477,2.105 12.075,2.105 L12.075,2.105 Z M4.947,1.44 C4.947,1.128 5.298,0.875 5.73,0.875 L7.294,0.875 C7.726,0.875 8.076,1.129 8.076,1.44 L8.076,2.105 L4.946,2.105 L4.946,1.44 L4.947,1.44 Z" class="si-glyph-fill"></path>
              </g>
            </svg>
          </button>
        </td>
    `
    return tr
  }
  
  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
  }

}

const socket = io()

let nome = prompt('Qual seu nome?')
socket.emit('new user', nome)

socket.on('new user', data => {
  if (!data.success) {
    alert('Já existe usuário com este nome....')
    window.location.href = '/'
  }
})

const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

form.addEventListener('submit', e => {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', { msg: input.value, nome: nome })
    input.value = ''
  }
})

socket.on('chat message', obj => {
  console.log('foi')
  let item = document.createElement('li')

  let nomeUsuario = document.createElement('p')
  nomeUsuario.textContent = obj.nome
  nomeUsuario.classList.add('nome')

  let caixaMensagem = document.createElement('div')
  caixaMensagem.classList.add('box-message')

  let textoMensagem = document.createElement('p')
  textoMensagem.textContent = obj.msg

  if (obj.nome == nome) {
    item.classList.add('suaMensagem')
  } else {
  }

  caixaMensagem.appendChild(textoMensagem)
  item.appendChild(nomeUsuario)
  item.appendChild(caixaMensagem)
  messages.appendChild(item)
})

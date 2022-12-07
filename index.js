const express = require('express')
const path = require('path')
const { disconnect } = require('process')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const usuarios = []
const socketIds = []

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  socket.on('new user', data => {
    if (usuarios.indexOf(data) != -1) {
      socket.emit('new user', { success: false })
    } else {
      usuarios.push(data)
      socketIds.push(socket.id)
      socket.emit('new user', { success: true })
    }
  })

  socket.on('chat message', obj => {
    if (
      usuarios.indexOf(obj.nome) != -1 &&
      usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)
    ) {
      io.emit('chat message', obj)
    } else {
      console.log('Erro: Você não tem permissão para executar a ação.')
    }
  })

  socket.on(disconnect, () => {
    let id = socketIds.indexOf(socket.id)
    socketIds.slice(id, 1)
    usuarios.splice(id, 1)
  })
})

server.listen(3000)

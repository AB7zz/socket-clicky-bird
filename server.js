const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const { emit } = require('process')
const server = http.createServer(app)
const socketio = require('socket.io')
const {rooms, createRoom, joinRoom, leaveRoom, username} = require('./util/rooms.js')
const {clicks, initializeClick, userConnected, connectedUsers, clickScore} = require('./util/users.js')
app.use(express.static(path.join(__dirname, 'public')))
const io = socketio(server)
io.on('connection', socket => {
    let username1;
    let username2;
    socket.on('create-room', ({roomId, nameId}) => {
        if(rooms[roomId]){
            const message = "A room already exists with id "+ roomId
            socket.emit('display-error', message)
        }else if(roomId===""){
            const message = "Cannot create a room with a blank id"
            socket.emit('display-error', message)
        }else{
            socket.join(roomId)
            userConnected(socket.client.id)
            createRoom(roomId, socket.client.id, nameId)
            username1 = username[roomId][0]
            socket.emit('player-1-connected', username1, roomId)
            socket.emit('room-created', roomId)
            console.log('Player 1 Connected')
        } 
    })  

    socket.on('join-room', ({roomId, nameId}) => {
        if(!rooms[roomId]){
            const message = "No such room exists"
            socket.emit('display-error', message)
        }else{
            socket.join(roomId)
            userConnected(socket.client.id)
            initializeClick(roomId)
            joinRoom(roomId, socket.client.id, nameId)
            username1 = username[roomId][0]
            username2 = username[roomId][1]
            io.to(roomId).emit('player-2-connected', username1, username2, roomId)
            socket.emit('room-joined', roomId)
            console.log('Player 2 Connected')
        }
    })

    socket.on('join-random', nameId => {
        let roomId
        for(let id in rooms){
            if(rooms[id][1] === "" && rooms[id][0]){
                roomId = id
                break
            }
        }

        if(roomId === "" || !roomId){
            const message = "All rooms are full or no room exists right now."
            socket.emit('display-error', message)
        }else{
            socket.join(roomId)
            userConnected(socket.client.id)
            initializeClick(roomId)
            joinRoom(roomId, socket.client.id, nameId)
            username1 = username[roomId][0]
            username2 = username[roomId][1]
            io.to(roomId).emit('player-2-connected', username1, username2)
            socket.emit('room-joined', roomId)
            console.log('Player 2 Connected')
        }
    }) 

    socket.on('click', ({roomId, playerId, genPlayerId, clickNo}) => {
        if(genPlayerId==="none"){
            clickScore(roomId, playerId, clickNo)
        }else if(genPlayerId===1){
            playerId="none"
            clickScore(roomId, genPlayerId, --clicks[roomId][0]) 
        }else{
            playerId="none"
            clickScore(roomId, genPlayerId, --clicks[roomId][1])
        }
        const clickone = clicks[roomId][0]
        const clicktwo = clicks[roomId][1]
        socket.join(roomId)
        io.to(roomId).emit('clickDisplay', {clickone, clicktwo, playerId})
    })

    socket.on('disconnect', () => {
        if(connectedUsers[socket.client.id]){
            let playerId
            let roomId

            for(let id in rooms){
                if(rooms[id][0] === socket.client.id || rooms[id][1] === socket.client.id){
                    if(rooms[id][0] == socket.client.id){
                        playerId = 1
                    }else{
                        palyerId = 2
                    }
                    roomId = id
                    break
                }
            } 
            leaveRoom(roomId, playerId)
            if(playerId === 1){
                io.to(roomId).emit('player-1-disconnected')
                console.log('Player 1 disconnected')
            }else{
                io.to(roomId).emit('player-2-disconnected')
                console.log('Player 2 disconnected')
            }
        }
    })
})
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log('Server running in PORT ' + PORT))

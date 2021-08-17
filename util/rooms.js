const rooms = {}
const username = {}
const createRoom = (roomId, playerSocketId, nameId) => {
    rooms[roomId] = [playerSocketId, ""]
    username[roomId] = [nameId, ""]
}

const joinRoom = (roomId, playerSocketId, nameId) => {
    if(rooms[roomId]){
        rooms[roomId][1] = playerSocketId
        username[roomId][1] = nameId
    }
}

const leaveRoom = (roomId, playerId) => {
    if(playerId===1){
        delete rooms[roomId]
        delete username[roomId]
    }else{
        if(rooms[roomId]){
            rooms[roomId][1] = ""
            username[roomId][1] = ""
        }
    }
}

module.exports = {rooms, createRoom, joinRoom, leaveRoom, username} 
const rooms = {}
const createRoom = (roomId, playerSocketId) => {
    rooms[roomId] = [playerSocketId, ""]
}

const joinRoom = (roomId, playerSocketId) => {
    rooms[roomId][1] = playerSocketId
}

const leaveRoom = (roomId, playerId) => {
    if(playerId===1){
        delete rooms[roomId]
    }else{
        rooms[roomId][1] = ""
    }
}

module.exports = {rooms, createRoom, joinRoom, leaveRoom} 
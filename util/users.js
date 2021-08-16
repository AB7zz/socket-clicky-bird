const clicks = {}
const connectedUsers = {}
const initializeClick = (roomId) => {
    clicks[roomId] = ["", ""]
}
const userConnected = playerSocketId => {
    connectedUsers[playerSocketId] = true
}

const clickScore = (roomId, playerId, clickNo) => {
    if(clicks[roomId]){
        clicks[roomId][playerId-1] = clickNo
    }
}

module.exports = {connectedUsers, clicks, initializeClick, userConnected, clickScore}


const socket = io()

//DOM Elements

//Display Screens
const home = document.getElementById('home')
const createroom = document.getElementById('createroom')
const joinroom = document.getElementById('joinroom')
const game = document.getElementById('game')
const winner = document.getElementById('winner')

//Buttons
const homecreatebutton = document.getElementById('homecreatebutton')
const homejoinbutton = document.getElementById('homejoinbutton')
const createroombutton = document.getElementById('createroombutton')
const joinroombutton = document.getElementById('joinroombutton')
const joinrandomroombutton = document.getElementById('joinrandomroombutton')
const cancelcreateroombutton = document.getElementById('cancelcreateroombutton')
const canceljoinroombutton = document.getElementById('canceljoinroombutton')

//Inputs
const nameIdOneInput = document.getElementById('nameidone')  
const nameIdTwoInput = document.getElementById('nameidtwo')  
const roomIdInput = document.getElementById('roomid')  
const joinRoomIdInput = document.getElementById('joinroomid')

//Random
const playeroneconnectioncircle = document.getElementById('playeroneconnectioncircle')
const playertwoconnectioncircle = document.getElementById('playertwoconnectioncircle')
const errormessage = document.getElementById('errormessage')
const birdone = document.getElementById('birdone')
const birdtwo = document.getElementById('birdtwo')
const usernameone = document.getElementById('usernameone')
const usernametwo = document.getElementById('usernametwo')
const waitingmessage = document.getElementById('waitingmessage')
const heading = document.getElementById('heading')
const winnernameone = document.getElementById('winnernameone')
const winnernametwo = document.getElementById('winnernametwo')
const winnerscoreone = document.getElementById('winnerscoreone')
const winnerscoretwo = document.getElementById('winnerscoretwo')

//User 1
const scoreone = document.getElementById('score1')
const imageone = document.getElementById('image1')
const buttonone = document.getElementById('button1')

//User 2
const scoretwo = document.getElementById('score2')
const imagetwo = document.getElementById('image2')
const buttontwo = document.getElementById('button2')


//Game Variables
let playerOneConnected = false;
let playerTwoConnected = false;
let playerId = 0;
let myScore = 0;
let enemyScore = 0;
let roomId = ""
let nameId = ""

//Main Code
homecreatebutton.addEventListener('click', () => {
    home.style.display = 'none';
    createroom.style.display = 'block';
})
homejoinbutton.addEventListener('click', () => {
    home.style.display = 'none';
    joinroom.style.display = 'block';
})

createroombutton.addEventListener('click', () => {
    roomId = roomIdInput.value
    nameId = nameIdOneInput.value
    errormessage.innerText = ''
    errormessage.style.display = 'none'
    socket.emit('create-room', {roomId, nameId})
})
cancelcreateroombutton.addEventListener('click', () => {
    home.style.display = 'block';
    errormessage.innerText = ''
    errormessage.style.display = 'none'
    createroom.style.display = 'none';
})
joinroombutton.addEventListener('click', () => {
    roomId = joinRoomIdInput.value
    nameId = nameIdTwoInput.value
    errormessage.innerText = ''
    errormessage.style.display = 'none'
    socket.emit('join-room', {roomId, nameId})
})
canceljoinroombutton.addEventListener('click', () => {
    home.style.display = 'block';
    errormessage.innerText = ''
    errormessage.style.display = 'none'
    joinroom.style.display = 'none';
})
joinrandomroombutton.addEventListener('click', () => {
    errormessage.innerText = ''
    errormessage.style.display = 'none'
    nameId = nameIdTwoInput.value
    socket.emit('join-random', nameId)
})
buttonone.addEventListener('click', () => {
    if(playerId!==2){
        myScore += 1
        const clickNo = myScore
        socket.emit('click', {roomId, playerId, clickNo})
        if(imageone.classList.contains('jump')){
            imageone.classList.add('jump1')
            imageone.classList.remove('jump')
        }else{
            imageone.classList.add('jump')
            imageone.classList.remove('jump1')
        }
    }else{
        if(birdone.classList.contains('shake')){
            birdone.classList.add('shake1')
            birdone.classList.remove('shake')
        }else{
            birdone.classList.add('shake')
            birdone.classList.remove('shake1')
        }
        enemyScore -= 1
        const clickNo = enemyScore
        socket.emit('click', {roomId, playerId, clickNo})
    }
})

buttontwo.addEventListener('click', () => {
    if(playerId!==1){
        enemyScore += 1
        const clickNo = enemyScore
        socket.emit('click', {roomId, playerId, clickNo})
        if(imagetwo.classList.contains('jump')){
            imagetwo.classList.add('jump1')
            imagetwo.classList.remove('jump')
        }else{
            imagetwo.classList.add('jump')
            imagetwo.classList.remove('jump1')
        }
    }else{
        if(birdtwo.classList.contains('shake')){
            birdtwo.classList.add('shake1')
            birdtwo.classList.remove('shake')
        }else{
            birdtwo.classList.add('shake')
            birdtwo.classList.remove('shake1')
        }
        myScore -= 1
        const clickNo = myScore
        socket.emit('click', {roomId, playerId, clickNo})
    }
})

socket.on('display-error', message => {
    errormessage.innerText = message
})
socket.on('room-created', id => {
    playerId = 1
    roomId = id
    createroom.style.display = 'none'
    game.style.display = 'block'
})
socket.on('player-1-connected', nameId => {
    playerOneConnected = true
    localStorage.setItem('player-1', nameId)
    if(nameId!==''){
        usernameone.innerText = ' '+ localStorage.getItem('player-1')
    }else{
        usernameone.innerText = ' You'
    }
    waitingmessage.innerText = 'Waiting for another player...'
    playersConnected(1)
})
socket.on('room-joined', id => {
    playerId = 2
    roomId = id
    joinroom.style.display = 'none'
    game.style.display = 'block'
})
socket.on('player-2-connected', nameId => {
    playerOneConnected = true
    playerTwoConnected = true
    usernameone.innerText = ' '+ localStorage.getItem('player-1')
    if(nameId!=='' || nameId){
        usernametwo.innerText = nameId
        localStorage.setItem('player-2', nameId)
    }else{
        usernametwo.innerText = " Enemy"
    }
    waitingmessage.innerText = ''
    playersConnected(2)
})
socket.on('player-1-disconnected', () => {
    reset()
})
socket.on('player-2-disconnected', () => {
    // playerTwoLeftTheGame()
    reset()
})
socket.on('clickDisplay', ({clickone, clicktwo}) => {
    if(clickone!==""){
        scoreone.innerText = clickone
        localStorage.setItem('score-1', clickone)
    }else{
        scoreone.innerText = "0"
    }
    if(clicktwo!==""){
        scoretwo.innerText = clicktwo
        localStorage.setItem('score-2', clicktwo)
    }else{
        scoretwo.innerText = "0"
    }
})

function playersConnected(playerId){
    if(playerId===1 && playerOneConnected){
        playeroneconnectioncircle.innerHTML = '<img src="images/online.png" style="height: 20px; width: auto;" />'
        playertwoconnectioncircle.innerHTML = '<img src="images/offline.png" style="height: 21px; width: auto;" />'
    }else{
        playeroneconnectioncircle.innerHTML = '<img src="images/online.png" style="height: 20px; width: auto;" />'
        playertwoconnectioncircle.innerHTML = '<img src="images/online.png" style="height: 20px; width: auto;" />'
    }
}

function reset() {
    myScore = 0
    enemyScore = 0
    playerId = 0
    playerOneConnected = false
    playerTwoConnected = false
    game.style.display = 'none'
    home.style.display = 'none'
    heading.style.display = 'none'
    winner.style.display = 'block'
    winnernameone.innerText = localStorage.getItem('player-1')
    winnernametwo.innerText = localStorage.getItem('player-2')
    winnerscoreone.innerText = localStorage.getItem('score-1')
    winnerscoretwo.innerText = localStorage.getItem('score-2')
    playeroneconnectioncircle.innerHTML = '<img src="images/offline.png" style="height: 21px; width: auto;" />'
    playertwoconnectioncircle.innerHTML = '<img src="images/offline.png" style="height: 21px; width: auto;" />'
}

function refresh(){
    localStorage.removeItem('player-1')
    localStorage.removeItem('player-2')
    localStorage.removeItem('score-1')
    localStorage.removeItem('score-2')
    myScore = 0
    enemyScore = 0
    playeroneconnectioncircle.innerHTML = '<img src="images/offline.png" style="height: 21px; width: auto;" />'
    playertwoconnectioncircle.innerHTML = '<img src="images/offline.png" style="height: 21px; width: auto;" />'
    window.location.reload()
}
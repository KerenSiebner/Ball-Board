'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'

// Model:
var gBoard
var gGamerPos

var interval = null
var gCollectedBallCount = 0


function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    displayCollectedBalls()
    interval = setInterval(addBall, 3500)
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL
    
    
    board[0][5].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR
    board[9][5].type = FLOOR

    // console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    console.log(elBoard)
}

// Move the player to a specific location
function moveTo(i, j) {
    // console.log(i, j)
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            // console.log('Collecting!')
            gCollectedBallCount++
            displayCollectedBalls()
            const sound = new Audio('eatfruit.wav')
            sound.play()
            if(getEmptyCells().length ===78) gameOver()
        }

        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)

    }

}

function gameOver(){
    restart()
}

function restart(){
    interval = null
    gCollectedBallCount = 0
    onInitGame()
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    // console.log('event.key:', event.key)

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

//Every few seconds a new ball is added in a random empty cell
function addBall() {
    const emptyCellsIdx = getEmptyCells()
    const numberOfEmptyCells = emptyCellsIdx.length
    if (numberOfEmptyCells) {
        const randIdx = getRandomInt(0, numberOfEmptyCells)
        var emptyCellIdx = emptyCellsIdx[randIdx]
        gBoard[emptyCellIdx.i][emptyCellIdx.j].gameElement = BALL
        renderCell(emptyCellIdx, BALL_IMG)
    }
}

function displayCollectedBalls(){
    const elBallsCollected = document.querySelector(".collected")
    const strHTML = `Balls collected: ${gCollectedBallCount}`
    elBallsCollected.innerHTML = strHTML
}


function getEmptyCells() {
    const emptyCellsIdx = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameElement === null & gBoard[i][j].type === 'FLOOR')
                emptyCellsIdx.push({ i: i, j: j })
        }
    }
    if (emptyCellsIdx === []) clearInterval(interval)
    else return emptyCellsIdx
}

//
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


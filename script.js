const block = document.getElementsByClassName('block'); //get the block
const base = document.getElementsByClassName('base');  //get inside of block for the values 

let winnerBoard = document.querySelector('.winner-board'); // game end display board
let winner = document.querySelector('.winner'); // for display the winner
let text = document.querySelector('.text'); // text called winner
let playAgain = document.querySelector('.button'); //play againg button
let homeButton = document.querySelector('.home-button'); //play againg button

let singlePB = document.querySelector('.one'); //play againg button
let doublePB = document.querySelector('.two'); //play againg button

let yesB = document.querySelector('.yes'); //play againg button
let noB = document.querySelector('.no'); //play againg button

let boardContainer = document.querySelector('.board-container');
let homeBoard = document.querySelector('.home-board');
let orderBoard = document.querySelector('.play-order-board');
let intBoard = document.querySelector('.dp-ints');

let index; // this use for remove items from the array
let randomItem; // this use for get random item from the array


//for identify layer by layer
const v1 = [0, 3, 6];
const v2 = [1, 4, 7];
const v3 = [2, 5, 8];
const h1 = [0, 1, 2];
const h2 = [3, 4, 5];
const h3 = [6, 7, 8];
const d1 = [0, 4, 8];
const d2 = [2, 4, 6];

const paths = [v1, v2, v3, h1, h2, h3, d1, d2];

let botMoves = []; //track the bot moves
let playerMoves = []; //track the player moves

let playerChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // choices that board has left to select
let pathTempChoices = []; // tempary arrays that use in functions
let pathTempChoicesSecond = [];  // tempary arrays that use in functions

var playerCount = 1; // for the change every click what arrears
let botPlayOk = false;

let hasWinMove = false;
let hasDefendMove = false;

let doesPlaySngle = true;
let doesPlayFirst = true;

let playMode = 0; //for single or double mode selection. 1-- single
let playOrder = 0; //for play first or second  1--play first

winnerBoard.style.visibility = 'hidden'; //hide for the start

//Time function do task according to time period
function waiting(ms) {

    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })

}

async function moveDown(board) {
    if (board == intBoard) {
        for (let i = 0; i <= 350; i++) {
            await waiting(0.1);
        }
    }
    for (let i = 0; i > -50; i--) {
        //i--;
        board.style.top = i + 'px';
        await waiting(0.1);
    }
    for (let i = -50; i < 0; i++) {
        i++;
        board.style.top = i + 'px';
        await waiting(0.1);
    }
    let j = 1;
    for (let i = 0; i <= 350; i++) {
        i = i + 2;
        board.style.opacity = j;
        j = j - 0.01;
        board.style.top = i + 'px';
        await waiting(0.1);
    }
    if (board == intBoard) {
        boardContainer.style.visibility = 'hidden';
    }
}
async function moveup(board) {

    let j = 0;
    for (let i = 350; i > 0; i--) {
        i = i + 2;
        board.style.opacity = j;
        j = j + 0.01;
        board.style.top = i + 'px';
        await waiting(0.1);
    }
    for (let i = 0; i > -50; i--) {
        //i--;
        board.style.top = i + 'px';
        await waiting(0.1);
    }
    for (let i = -50; i <= 0; i++) {
        i++;
        board.style.top = i + 'px';
        await waiting(0.1);
    }


}

//Home section select play mode
singlePB.addEventListener('click', (e) => {
    playMode = 1;
    console.log('playMode ' + playMode);
    moveDown(homeBoard);
})

doublePB.addEventListener('click', (e) => {
    playMode = 2;
    orderBoard.style.visibility = 'hidden';
    console.log('playMode ' + playMode);
    moveDown(homeBoard);
    moveDown(intBoard);
})

//PLay order selection
yesB.addEventListener('click', (e) => {
    playOrder = 1;
    console.log('playOrder ' + playOrder);
    moveDown(orderBoard);
    moveDown(intBoard);
})

noB.addEventListener('click', (e) => {
    playOrder = 2;
    console.log('playOrder ' + playOrder);
    moveDown(orderBoard);
    moveDown(intBoard);
    if (playMode == 1) openingMove();
})

// play againg button function
playAgain.addEventListener('click', (e) => {
    playerChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    botMoves = [];
    playerMoves = [];
    winnerBoard.style.visibility = 'hidden';
    text.style.visibility = 'hidden';
    for (let i = 0; i < 9; i++) {
        base[i].textContent = '';
    }
    playerCount = 1;
    if (playMode == 1 && playOrder == 2) openingMove();
})

homeButton.addEventListener('click', (e) => {
    playerChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < 9; i++) {
        base[i].textContent = '';
    }
    winnerBoard.style.visibility = 'hidden';
    text.style.visibility = 'hidden';
    boardContainer.style.visibility = 'visible';
    orderBoard.style.visibility = 'visible';
    homeBoard.style.opacity = 1;
    orderBoard.style.opacity = 1;
    intBoard.style.opacity = 1;
    orderBoard.style.top = '0px';
    homeBoard.style.top = '0px';
    intBoard.style.top = '0px';
    playMode = 0;
    playOrder = 0;
    playerCount = 1;
})



//set blocks clickable and blank values
for (let i = 0; i < 9; i++) {
    base[i].textContent = '';
    block[i].addEventListener('click', (e) => { play(i); });
}



// remove specific item from array
function removeItemArray(val) {
    index = playerChoices.findIndex((element) => element == val)
    if (index !== -1) {
        playerChoices.splice(index, 1)
    }
}



//this will call after ckick a block
function play(val) {

    if (winCheck() && playerChoices.includes(val)) tick(val);
    if (botPlayOk && playerChoices.length != 0 && playMode == 1) legendBot();

}



// for mark the block
function tick(val) {
    console.log('function tick')
    playerMoves.unshift(val);
    markOnBoard(val);
    botPlayOk = true;
    console.log('playerMoves ' + playerMoves)
    winCheck();
    if (winCheck()) draw();
}



// mark values on the board
function markOnBoard(passVal) {
    console.log('function mark on board')
    if (base[passVal].textContent == '' && playerCount % 2 == 1) {
        base[passVal].textContent = 'X';
        removeItemArray(passVal);
        console.log(playerChoices);
        playerCount++;
    }
    if (base[passVal].textContent == '' && playerCount % 2 == 0) {
        base[passVal].textContent = 'O';
        removeItemArray(passVal);
        console.log(playerChoices);
        playerCount++;
    }
}



// Noob player selection
function botPlay() {
    console.log('function bot play');
    randomItem = playerChoices[Math.floor(Math.random() * playerChoices.length)];
    console.log(randomItem);
    markOnBoard(randomItem);
    botPlayOk = false;
    winCheck();
    if (winCheck()) draw();
}


// Legend bot overall faunction
function legendBot() {
    console.log('function legend bot overall')
    botPlayOk = false;
    winningMove();
    hasDefendMove = true;
    if (!hasWinMove) defendMove();
    if (!hasDefendMove) {
        if (botMoves.length == 0) openingMove();
        else if (botMoves.length == 1) secondMove();
        else if (botMoves.length == 2) thirdMove();
        else randomMove();
    }
    winCheck();
    if (winCheck()) draw();
    console.log('botMoves ' + botMoves);
}


//RANDOM MOVE
function randomMove() {
    console.log('function randomMove')
    randomItem = playerChoices[Math.floor(Math.random() * playerChoices.length)];
    markOnBoard(randomItem);
}


//OPENING MOVE
function openingMove() {
    console.log('function openingMove');
    let openingArray = [0, 1, 2, 3, 5, 6, 7, 8];
    randomItem = openingArray[Math.floor(Math.random() * openingArray.length)];
    botMoves.unshift(randomItem);
    markOnBoard(randomItem);
    console.log(botMoves);

}
if (playMode == 1 && playOrder == 2) openingMove();


//SECOND MOVE
function secondMove() {
    console.log('function secondMove')
    pathTempChoices = [];
    pathTempChoicesSecond = [];

    for (let i = 0; i < paths.length; i++)secondMoveSelector(paths[i])
    for (let i = 0; i < playerChoices.length; i++) {
        if (!pathTempChoices.includes(playerChoices[i])) pathTempChoicesSecond.unshift(playerChoices[i]);
    }
    if (pathTempChoicesSecond.length > 0) {
        randomItem = pathTempChoicesSecond[Math.floor(Math.random() * pathTempChoicesSecond.length)];
    }

    else randomItem = 4;
    console.log('ptc ' + pathTempChoices);
    console.log('ptcs ' + pathTempChoicesSecond);
    console.log('rI ' + randomItem);
    botMoves.unshift(randomItem);
    markOnBoard(randomItem);

}

//selection from the paths sor the second move 
function secondMoveSelector(passArray) {
    console.log('function secondMoveSelector')
    if (passArray.includes(botMoves[0])) {
        for (let i = 0; i < 3; i++) {
            if (playerChoices.includes(passArray[i]) && !pathTempChoices.includes(passArray[i])) pathTempChoices.unshift((passArray[i]));
        }
    }
}




//THIRD MOVE
function thirdMove() {
    console.log('function thirdMove')
    pathTempChoices = [];
    pathTempChoicesSecond = [];

    for (let i = 0; i < paths.length; i++)commonBlockSelector(paths[i])
    pathTempChoices.sort(function (a, b) { return a - b });

    for (let i = 1; i < pathTempChoices.length; i++) {
        if (pathTempChoices[i] == pathTempChoices[i - 1] && !pathTempChoicesSecond.includes(pathTempChoices[i])) pathTempChoicesSecond.unshift(pathTempChoices[i]);
    }
    if (pathTempChoicesSecond.length > 0) {
        randomItem = pathTempChoicesSecond[Math.floor(Math.random() * pathTempChoicesSecond.length)];
        botMoves.unshift(randomItem);
        markOnBoard(randomItem);
    }
    else thirdDefendMove();
}


function commonBlockSelector(passArray) {
    console.log('function thrdMoveSelector')
    let botMCheck = false;
    let noPlayerCheck = true;

    if (passArray.includes(botMoves[0]) || passArray.includes(botMoves[1])) botMCheck = true;
    if (passArray.includes(playerMoves[0]) || passArray.includes(playerMoves[1])) noPlayerCheck = false;

    if (botMCheck && noPlayerCheck) {
        for (let i = 0; i < 3; i++) {
            if (playerChoices.includes(passArray[i]) && !botMoves.includes(passArray[i])) pathTempChoices.unshift(passArray[i]);
        }
    }
}




//THIRD DEFEND MOVE 
function thirdDefendMove() {
    console.log('function thirdDefendMove')
    pathTempChoices = [];
    pathTempChoicesSecond = [];

    for (let i = 0; i < paths.length; i++)commonBlockSelectorPlayer(paths[i])
    pathTempChoices.sort(function (a, b) { return a - b });
    for (let i = 1; i < pathTempChoices.length; i++) {
        if (pathTempChoices[i] == pathTempChoices[i - 1] && !pathTempChoicesSecond.includes(pathTempChoices[i])) pathTempChoicesSecond.unshift(pathTempChoices[i]);
    }
    if (pathTempChoicesSecond.length > 0) {
        randomItem = pathTempChoicesSecond[Math.floor(Math.random() * pathTempChoicesSecond.length)];
    }
    else if (playerChoices.includes(4)) {
        randomItem = 4;
    }
    else {
        randomItem = playerChoices[Math.floor(Math.random() * playerChoices.length)];
    }
    botMoves.unshift(randomItem);
    markOnBoard(randomItem);

}


function commonBlockSelectorPlayer(passArray) {
    console.log('function thirdDefendMoveSelector')
    let botMCheck = false;
    let noPlayerCheck = true;

    if (passArray.includes(botMoves[0]) || passArray.includes(botMoves[1])) botMCheck = false;
    if (passArray.includes(playerMoves[0]) || passArray.includes(playerMoves[1])) noPlayerCheck = true;

    if (botMCheck && noPlayerCheck) {
        for (let i = 0; i < 3; i++) {
            if (playerChoices.includes(passArray[i]) && !playerMoves.includes(passArray[i])) pathTempChoices.unshift(passArray[i]);
        }
    }
}



// Draw board display
function draw() {
    console.log('function displayDrawAtTheEnd')
    let tempval = 0
    for (let i = 0; i < 9; i++) {
        if (base[i].textContent != '') tempval++;
    }
    if (tempval == 9) {
        text.style.visibility = 'hidden';
        winnerBoard.style.visibility = 'visible';
        winner.style.fontSize = '60px';
        winner.textContent = 'It\'s a Tie';
    }
}


//WINNING MOVE
function winningMove() {
    console.log('function winningMove')
    pathTempChoices = [];
    hasWinMove = false;

    for (let i = 0; i < paths.length; i++)winMove(paths[i])
    randomItem = pathTempChoices[Math.floor(Math.random() * pathTempChoices.length)];
    if (pathTempChoices.length > 0) {
        markOnBoard(randomItem);
        winCheck();
    }
}


function winMove(passArray) {
    console.log('function winningMoveSelector')
    let doubleCheck = 0;

    for (let i = 0; i < botMoves.length; i++) {
        if (passArray.includes(botMoves[i])) doubleCheck++;
    }
    if (doubleCheck == 2) {
        for (let i = 0; i < playerChoices.length; i++) {
            if (passArray.includes(playerChoices[i])) {
                pathTempChoices.unshift(playerChoices[i]);
                hasWinMove = true;
            }
        }
    }
}

function defendMove() {
    console.log('function defendMove');
    pathTempChoices = [];
    hasDefendMove = false;

    for (let i = 0; i < paths.length; i++)criticalMove(paths[i]);
    randomItem = pathTempChoices[Math.floor(Math.random() * pathTempChoices.length)];
    console.log('defend moves ' + pathTempChoices);
    if (pathTempChoices.length > 0) {
        botMoves.unshift(randomItem);
        markOnBoard(randomItem);
    }
}


function criticalMove(passArray) {
    console.log('function defendMoveSelector');
    let doubleCheck = 0;

    for (let i = 0; i < playerMoves.length; i++) {
        if (passArray.includes(playerMoves[i])) doubleCheck++;
    }
    if (doubleCheck == 2) {
        console.log(passArray);
        for (let i = 0; i < playerChoices.length; i++) {
            if (passArray.includes(playerChoices[i])) {
                pathTempChoices.unshift(playerChoices[i]);
                hasDefendMove = true;
            }
        }
    }
}



// check the game is over
function winCheck() {
    console.log('function winCheck')
    if (base[v1[0]].textContent === base[v1[1]].textContent && base[v1[0]].textContent === base[v1[2]].textContent && base[v1[0]].textContent != '') {
        winner.textContent = base[v1[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[v2[0]].textContent === base[v2[1]].textContent && base[v2[0]].textContent === base[v2[2]].textContent && base[v2[0]].textContent != '') {
        winner.textContent = base[v2[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[v3[0]].textContent === base[v3[1]].textContent && base[v3[0]].textContent === base[v3[2]].textContent && base[v3[0]].textContent != '') {
        winner.textContent = base[v3[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[h1[0]].textContent === base[h1[1]].textContent && base[h1[0]].textContent === base[h1[2]].textContent && base[h1[0]].textContent != '') {
        winner.textContent = base[h1[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[h2[0]].textContent === base[h2[1]].textContent && base[h2[0]].textContent === base[h2[2]].textContent && base[h2[0]].textContent != '') {
        winner.textContent = base[h2[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[h3[0]].textContent === base[h3[1]].textContent && base[h3[0]].textContent === base[h3[2]].textContent && base[h3[0]].textContent != '') {
        winner.textContent = base[h3[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[d1[0]].textContent === base[d1[1]].textContent && base[d1[0]].textContent === base[d1[2]].textContent && base[d1[0]].textContent != '') {
        winner.textContent = base[d1[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else if (base[d2[0]].textContent === base[d2[1]].textContent && base[d2[0]].textContent === base[d2[2]].textContent && base[d2[0]].textContent != '') {
        winner.textContent = base[d2[0]].textContent;
        winnerBoard.style.visibility = 'visible';
        text.style.visibility = 'visible';
        return false;
    }
    else return true;
}

// Intro

let introContainer = document.querySelector('.loading-container');

let t1 = document.querySelector('.t1');
let t2 = document.querySelector('.t2');
let t3 = document.querySelector('.t3');

let st1 = document.querySelector('.st1');
let st2 = document.querySelector('.st2');
let st3 = document.querySelector('.st3');


function delay(ms) {

    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })

}
async function comeToCenter(item) {
    let p; let t; let v; let l; let m;

    if (item == t1 || item == t3) {
        t = 0;
        v = -85;
        l = 150;
        m = 131;
        for (let i = 0; i <= 150; i++) {
            p = ((v - m) * (i - l) * (i - l) / ((t - l) * (t - l))) + m;
            item.style.top = p + 'px';
            //p=p-0.001;
            await delay(1);
        }
    }
    if (item == t2) {
        t = 0;
        v = -85;
        l = 150;
        m = 136;
        for (let i = 0; i <= 150; i++) {
            p = ((v - m) * (i - l) * (i - l) / ((t - l) * (t - l))) + m;
            item.style.bottom = p + 'px';
            await delay(1);
        }
    }
    if (item == st1 || item == st2 || item == st3) {
        for (let i = 1; i <= 150; i++) {
            await delay(1);
        }
        t = 0;
        v = 0;
        l = 150;
        m = 60;
        p = 0;
        /* for(let i=1;i<=150;i++){
            item.style.width = p+'px';
            p=p+0.6;
            await delay(1);
        } */
        for (let i = 0; i <= 150; i++) {
            p = ((v - m) * (i - l) * (i - l) / ((t - l) * (t - l))) + m;
            item.style.width = p + 'px';
            await delay(1);
        }
    }
}


async function scaling(item) {
    for (let i = 1; i <= 400; i++) {
        await delay(1);
    }
    let g = 1
    for (let i = 1; i <= 200; i++) {
        item.style.transform = "scale(" + g + ")";
        g = g + 1 / 200;
        await delay(1);
    }
}

async function bluring(item) {
    for (let i = 1; i <= 400; i++) {
        await delay(1);
    }
    for (let i = 1; i <= 200; i++) {
        item.style.filter = "blur(" + i + "px)";
        await delay(5);
    }
}

async function fadeAway(item) {
    for (let i = 1; i <= 500; i++) {
        await delay(1);
    }
    let f = 1;
    for (let i = 1; i <= 200; i++) {
        item.style.opacity = f;
        f = f - 1 / 200;
        await delay(5);
    }
    introContainer.style.visibility = 'hidden';
}

comeToCenter(t1);
comeToCenter(t3);
comeToCenter(t2);
comeToCenter(st1);
comeToCenter(st2);
comeToCenter(st3);

scaling(t1);
scaling(t3);
scaling(t2);

bluring(t1);
bluring(t3);
bluring(t2);

fadeAway(introContainer);
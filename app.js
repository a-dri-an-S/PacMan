const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const tempBoard = [
    1,1,1,1,1,1,1,1,1,1,
    1,4,4,4,2,2,2,2,2,1,
    1,1,1,1,2,2,2,1,2,1,
    1,2,2,2,3,2,1,2,2,1,
    1,2,1,2,1,1,1,1,2,1,
    1,2,2,3,2,1,2,2,2,1,
    1,2,1,1,2,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,1,1,1,1,1,1,1,1,1,
];
const keys = {
    ArrowRight: false, 
    ArrowLeft: false, 
    ArrowUp: false, 
    ArrowDown: false
};
const ghosts = [];
const g = {
    x: '', 
    y: '', 
    h: 50, 
    size: 10, 
    ghosts: 5, 
    inplay: false,
    startGhost: 11
};
const player = {
    pos: 32,
    speed: 4,
    cool: 0,
    pause: false,
    score: 0,
    lives: 1,
    gameover: true,
    gamewin: false,
    powerup: false,
    powerCount: 0
};

const startGame = document.querySelector('.btn');

document.addEventListener('DOMContentLoaded', () => {
    g.grid = document.querySelector('.grid'); // this is the game board
    g.pacman = document.querySelector('.pacman'); // this is the player, pacman
    g.eye = document.querySelector('.eye'); // pacman eye
    g.mouth = document.querySelector('.mouth'); // pacman mouth
    g.ghost = document.querySelector('.ghost'); // ghosts
    g.score = document.querySelector('.score');
    g.lives = document.querySelector('.lives');
    g.pacman.style.display = 'none';
    g.ghost.style.display = 'none';
    g.grid.style.display = 'none';

})

document.addEventListener('keydown', (e) => {
    // key presses
    if(e.code in keys) {
        keys[e.code] = true;
    }
    if (!g.inplay && !player.pause) {
        player.play = requestAnimationFrame(move);
        g.inplay = true;
    }
    
})

document.addEventListener('keyup', (e) => {
    if(e.code in keys) {
        keys[e.code] = false;
    }
})

startGame.addEventListener('click', boardBuilder);

function boardBuilder() {
    console.log(tempBoard)
}


// MAIN GAME PLAY (GAME LOGIC)
function move(){
    if (g.inplay) {
        player.cool--; // player cooldown / slowdown
        if (player.cool < 0) {
            // placing and movement of ghosts
            let tempPower = 0;
            if (player.powerup) {
                player.powerCount--;
                g.pacman.style.backgroundColor = 'red';
                if (player.powerCount < 20) {
                    g.pacman.style.backgroundColor = 'orange';
                    if (player.powerCount % 2) {
                        g.pacman.style.backgroundColor = 'white';
                    }
                }
                if (player.powerCount <= 0) {
                    player.powerup = false;
                    g.pacman.style.backgroundColor = 'yellow';
                    console.log('power down')
                    tempPower = 1;
                }
            }

            ghosts.forEach((ghost) => {
                if (tempPower === 1) {
                    ghost.style.backgroundColor = ghost.defaultColor;
                } else if (player.powerCount > 0){
                    if (player.powerCount % 2){
                        ghost.style.backgroundColor = 'white';
                    } else {
                        ghost.style.backgroundColor = 'teal';
                    }
                }
                myBoard[ghost.pos].append(ghost);
                ghost.counter--;
                let oldPOS = ghost.pos; // original ghost position

                if (ghost.counter <= 0) {
                    changeDir(ghost);
                } else {
                    if (ghost.dx === 0) {
                        ghost.pos -= g.size;
                    } else if (ghost.dx === 1) {
                        ghost.pos += g.size;
                    } else if (ghost.dx === 2) {
                        ghost.pos += 1;
                    } else if (ghost.dx === 3) {
                        ghost.pos -= 1;
                    }
                }
                
                // *******************************************************
                // ghost.pos = oldPOS // FOR TESTING ONLY, REMOVE WHEN DONE
                // *******************************************************
                
                if (player.pos === ghost.pos) {
                    // console.log("Ghost got you " + ghost.namer);
                    if (player.powerCount > 0) {
                        // you ate the ghosts
                        player.score += 100;
                        let randomRegenerateSpot = Math.floor(Math.random() * 40);
                        // ghost.pos = startPosPlayer(randomRegenerateSpot);
                        ghost.pos = g.startGhost;
                    } else {
                        player.lives--;
                        gameReset();
                    }
                    updateScore();
                }

                let valGhost = myBoard[ghost.pos]; // future of ghost pos
                if (valGhost.t === 1) {
                    ghost.pos = oldPOS
                    changeDir(ghost);
                }
                

                myBoard[ghost.pos].append(ghost);
            })
        // keyboard events, movement of player
        let tempPos = player.pos; // current pos 
        if (keys.ArrowRight) {
            player.pos += 1;
            g.eye.style.left = '20%';
            g.mouth.style.left = '60%';
        } else if (keys.ArrowLeft) {
            player.pos -= 1;
            g.eye.style.left = '60%';
            g.mouth.style.left = '0%';
        } else if (keys.ArrowUp) {
            player.pos -= g.size
        } else if (keys.ArrowDown) {
            player.pos += g.size;
        }

        let newPlace = myBoard[player.pos]; // future position
        if (newPlace.t === 1 || newPlace.t === 4) {
            // console.log('wall');
            player.pos = tempPos;
        }
        if (newPlace.t === 2) {
            // console.log('dot'); // dot eaten
            // counting the dots that are left
            myBoard[player.pos].innerHTML = '';
            let tempDots = document.querySelectorAll('.dot');
            if (tempDots.length === 0){
                playerWins();
            };
            player.score++;
            updateScore();
            newPlace.t = 0;
        }
        if (newPlace.t === 3) {
            player.powerCount = 100;
            player.powerup = true;
            console.log('powerup');
            myBoard[player.pos].innerHTML = '';
            player.score += 10;
            updateScore();
            newPlace.t = 0;
        }

        // open and close mouth function
        if (player.pos != tempPos) {
            if(player.tog) {
                g.mouth.style.height = '30%';
                player.tog = false;
            } else {
                g.mouth.style.height = '10%';
                player.tog = true;
            }
        }

        player.cool = player.speed; // set cooloff
        // console.log(newPlace.t);
    }
    if (!player.pause){
        myBoard[player.pos].append(g.pacman);
        player.play = requestAnimationFrame(move);
        }
    }
}


// STARTING AND RESTARTING GAME
function starterGame() {
    myBoard.length = 0;
    ghosts.length = 0;
    // console.log('start game');
    g.grid.innerHTML = '';
    g.x = '';
    if(!player.gamewin){
        player.score = 0;
        player.lives = 1;
    } else {
        player.gamewin = false;
    }
    player.gameover = false;
    createGame(); // create game board
    updateScore();
    g.grid.focus();
    g.grid.style.display = 'grid';
    startGame.style.display = 'none';
    g.pacman.style.display = 'block';

}

function playerWins() {
    player.gamewin = true;
    g.inplay = false;
    player.pause = true;
    startGame.style.display = 'block';
}

function endGame() {
    player.gamewin = false;
    startGame.style.display = 'block';
}

function gameReset() {
    // console.log('paused');
    window.cancelAnimationFrame(player.play);
    g.inplay = false;
    player.pause = true;
    if (player.lives <= 0) {
        player.gameover = true;
        endGame();
    }
    if (!player.gameover) {
        setTimeout(startPos, 3000);
    }
}

function startPos() {
    player.pause = false;
    let firstStartPos = 20;
    player.pos = startPosPlayer(firstStartPos);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost, ind) => {
        let temp = (g.size + 1) + ind;
        ghost.pos = startPosPlayer(temp);
        myBoard[ghost.pos].append(ghost);
    })
}

function startPosPlayer(val) {
    if (myBoard[val].t != 1) {
        return val;
    }
    return startPosPlayer(val + 1);
}


// GAME UPDATES
function updateScore() {
    if (player.lives <= 0) {
        player.gameover = true;
        g.lives.innerHTML = 'Game Over'
    } else {
    g.score.innerHTML = `Score: ${player.score}`;
    g.lives.innerHTML = `Lives: ${player.lives}`;
    }
}


//  GAME BOARD SET UP
function createGhost() {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = g.startGhost;
    newGhost.style.display = 'block';
    newGhost.counter = 0;
    newGhost.defaultColor = board[ghosts.length];
    newGhost.dx = Math.floor(Math.random() * 4);
    newGhost.style.backgroundColor = board[ghosts.length];
    newGhost.style.opacity = '0.8'
    newGhost.namer = board[ghosts.length] + 'y';
    ghosts.push(newGhost);
}

function createGame() {
    for(let i = 0; i < g.ghosts; i++) {
        createGhost();
    }
    tempBoard.forEach((cell) => {
        // // console.log(cell);
        createSquare(cell);
    })
    for(let i = 0; i < g.size; i++) {
        g.x += ` ${g.h}px`; // cell grid height
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows =  g.x;
    startPos();
}

function createSquare(val) {
    const div = document.createElement('div');
    div.classList.add('box');
    if(val === 1) {div.classList.add('wall');} // add wall to element
    if(val === 2 ) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    } // add dot 
    if(val === 3 ) {
        const dot = document.createElement('div');
        dot.classList.add('superdot');
        div.append(dot);
    } // add superdot 
    if(val === 4 ) {
        // hideout for ghosts
        div.classList.add('hideout');
        if (g.startGhost === 11) {
            g.startGhost = myBoard.length;
        }

    } // add superdot 
    g.grid.append(div);
    myBoard.push(div);

    div.t = val; // element type of content
    div.idVal = myBoard.length;
    div.addEventListener('click', (e) => {
        // console.log(div);
    })
}


// GHOST LOGIC
function findDir(a) {
    let val = [a.pos % g.size, Math.ceil(a.pos/g.size)]; // col, row
    return val;
}

function changeDir(ene) {
    let gg = findDir(ene);
    let pp = findDir(player);

    let ran = Math.floor(Math.random() * 2);
    if (ran === 0) { ene.dx = (gg)[0] < pp[0] ? 2 : 3 } // horizontal
    else { ene.dx === (gg)[1] < pp[1] ? 1 : 0 } // vertical
    
    ene.dx = Math.floor(Math.random() * 4);
    ene.counter = (Math.random() * 1) + 2;
}
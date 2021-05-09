const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const tempBoard = [
    1,1,1,1,1,1,1,1,1,1,
    1,2,3,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
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
    h: 100, 
    size: 10, 
    ghosts: 6, 
    inplay: false
};
const player = {
    pos: 32,
    speed: 4,
    cool: 0,
    pause: false
};

document.addEventListener('DOMContentLoaded', () => {
    g.grid = document.querySelector('.grid'); // this is the game board
    g.pacman = document.querySelector('.pacman'); // this is the player, pacman
    g.eye = document.querySelector('.eye'); // pacman eye
    g.mouth = document.querySelector('.mouth'); // pacman mouth
    g.ghost = document.querySelector('.ghost'); // ghosts
    g.ghost.style.display = 'none';
    g.pacman.style.display = 'none';
    createGame(); // create game board
})

document.addEventListener('keydown', (e) => {
    // key presses
    if(e.code in keys) {
        keys[e.code] = true;
    }
    if (!g.inplay && !player.pause) {
        g.pacman.style.display = 'block';
        player.play = requestAnimationFrame(move);
        g.inplay = true;
    }
    
})

document.addEventListener('keyup', (e) => {
    if(e.code in keys) {
        keys[e.code] = false;
    }
})


function createGhost() {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = 11 + ghosts.length;
    newGhost.style.display = 'block';
    newGhost.counter = 0;
    newGhost.dx = Math.floor(Math.random() * 4);
    newGhost.style.backgroundColor = board[ghosts.length];
    newGhost.namer = board[ghosts.length] + 'y';
    ghosts.push(newGhost);
}

function changeDir(ene) {
    ene.dx = Math.floor(Math.random() * 4);
    ene.counter = (Math.random() * 10) + 2;
}

function move(){
    if (g.inplay) {
        player.cool--; // player cooldown / slowdown
        if (player.cool < 0) {
            // placing and movement of ghosts
            ghosts.forEach((ghost) => {
                myBoard[ghost.pos].append(ghost);
                ghost.counter--;
                let oldPOS = ghost.pos; // original ghost position
                
                if (ghost.counter <= 0) {
                    changeDir(ghost);
                }  else {
                    if (ghost.dx == 0) {ghost.pos -= g.size}
                    else if (ghost.dx == 1) {ghost.pos += g.size}
                    else if (ghost.dx == 2) {ghost.pos += 1}
                    else if (ghost.dx == 3) {ghost.pos -= 1}
                }
                let valGhost = myBoard[ghost.pos]; // future of ghost pos
                if (valGhost.t == 1) {
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
        if (newPlace.t == 1) {
            console.log('wall');
            player.pos = tempPos;
        }
        if (newPlace.t == 2) {
            console.log('dot');
            myBoard[player.pos].innerHTML = '';
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
        console.log(newPlace.t);
    }

    myBoard[player.pos].append(g.pacman);
    player.play = requestAnimationFrame(move);
    }
}


function createGame() {
    for(let i = 0; i < g.ghosts; i++) {
        createGhost();
    }
    tempBoard.forEach((cell) => {
        // console.log(cell);
        createSquare(cell);
    })
    for(let i = 0; i < g.size; i++) {
        g.x += ` ${g.h}px`; // cell grid height
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows =  g.x;
}

function createSquare(val) {
    const div = document.createElement('div');
    div.classList.add('box');
    if(val == 1) {div.classList.add('wall');} // add wall to element
    if(val == 2 ) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    } // add dot 
    if(val == 3 ) {
        const dot = document.createElement('div');
        dot.classList.add('superdot');
        div.append(dot);
    } // add superdot 
    g.grid.append(div);
    myBoard.push(div);

    div.t = val; // element type of content
    div.idVal = myBoard.length;
    div.addEventListener('click', (e) => {
        console.log(div);
    })

}
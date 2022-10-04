const game = {
    activeTile: null,
    previousTile: null,
    activePieceColor: null,
    previousPieceColor: null,
    activeTileBg: null,
}
window.onload = () => {
    const board = new ChessBoard(800,800); 
    board.buildBoard();
}
class ChessBoard {
    #height;
    #width;
    #rows;
    #columns;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
        this.#rows = 8;
        this.#columns = 8;
    }
    buildBoard () {
        const board = document.querySelector('.board');
        board.classList.add('board');
        board.style.height = this.#height + "px";
        board.style.width = this.#width + "px";
        board.style.backgroundColor = "gray";
        for(let row=0; row<this.#rows; row++) {
            for(let column=0; column<this.#columns; column++) {
                if(row % 2 === 1) {
                    if(column % 2 === 0) {
                        const tileId = row * this.#columns + column;
                        const tile = new Tile(100,100,tileId, '#ae8a68');
                        tile.drawTile();
                    } else {
                        const tileId = row * this.#columns + column;
                        const tile = new Tile(100,100,tileId, '#ecdab9');
                        tile.drawTile();
                    }
                } else {
                    if(column % 2 === 1) {
                        const tileId = row * this.#columns + column;
                        const tile = new Tile(100,100,tileId, '#ae8a68');
                        tile.drawTile();
                    } else {
                        const tileId = row * this.#columns + column;
                        const tile = new Tile(100,100,tileId, '#ecdab9');
                        tile.drawTile();
                    }
                }
            }
        }
        this.#buildPieces();
        this.#movePieces();
    }
    #buildPieces () {
        const pawn = new Pawn(100,100);
        pawn.drawPawns();
        const rook = new Rook(100,100);
        rook.drawRooks();
        const knight = new Knight(100,100);
        knight.drawKinghts()
        const bishop = new Bishop(100,100);
        bishop.drawBishops();
        const queen = new Queen(100,100);
        queen.drawQueens();
        const king = new King(100,100);
        king.drawKings();
    }

   #highlightTiles (item,e) {
        let tile = e.path[1];
            if(game.activeTile === e.path[1]) {
                game.activeTile.style.backgroundColor = game.activeTileBg;
                game.activePieceColor = null;
                game.previousPieceColor = null;
                game.activeTile = null;
                game.activeTileBg = null;
                return;
            } else if (item && item.children.length > 0 && game.activeTile === null) { // no prior active piece
                let pieceColor = e.path[1].children[0].src.includes('white');
                pieceColor ? game.activePieceColor = true : game.activePieceColor = false;
                game.activeTile = item;
                game.previousTile = item;
                game.activeTileBg = tile.style.backgroundColor;
                game.activeTile.style.backgroundColor = "yellow";
            } else if (item && item.children.length > 0 && game.activeTile) { // current active piece
                let pieceColor = e.path[1].children[0].src.includes('white');
                game.previousPieceColor = null;
                game.previousTile = null;
                game.previousPieceColor = game.activePieceColor;
                game.activePieceColor = null;
                pieceColor ? game.activePieceColor = true : game.activePieceColor = false;
                game.activeTile.style.backgroundColor = game.activeTileBg;
                game.previousTile = game.activeTile;
                game.activeTile = null;
                game.activeTile = item;
                game.activeTileBg = null;
                game.activeTileBg = game.activeTile.style.backgroundColor;
                game.activeTile.style.backgroundColor = "yellow";
            }
    }
    #movePieces () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            item.addEventListener('click', (e)=>{
                this.#highlightTiles(item,e);
                if(game.activeTile && item.children.length === 0 && game.activeTile.style.backgroundColor === 'yellow') { // no pieces on tile
                    let parent = game.activeTile;
                    let child = game.activeTile.children[0];
                    parent.removeChild(child);
                    item.append(child);
                    parent.style.backgroundColor = game.activeTileBg;
                    game.activePieceColor = null;
                    game.previousPieceColor = null;
                    game.activeTile = null;
                    game.activeTileBg = null;
                } else if (game.activeTile && item.children.length === 1) {
                    if(game.activeTile && game.previousPieceColor !== null && game.activePieceColor !== game.previousPieceColor) {
                        let targetPiece = game.activeTile;
                        let targetPieceChild = game.activeTile.children[0];
                        let firstPiece = game.previousTile.children[0]
                        targetPiece.removeChild(targetPieceChild);
                        targetPiece.style.backgroundColor = game.activeTileBg;
                        targetPiece.append(firstPiece)
                        game.activePieceColor = null;
                        game.previousPieceColor = null;
                        game.activeTile = null;
                        game.activeTileBg = null;
                    }
                }   
            })
        })
    }
}
class Tile {
    #width;
    #height;
    #id;
    #color;
    constructor (height,width,id,color) {
        this.#height = height;
        this.#width = width;
        this.#id = id;
        this.#color = color;
    }
    drawTile () {
        const board = document.querySelector('.board');
        const tile = document.createElement('div');
        tile.id = this.#id;
        tile.style.backgroundColor = this.#color;
        tile.style.width = this.#width + "px";
        tile.style.height = this.#height + "px";
        tile.style.border = "solid 1px black";
        tile.classList.add('tile');
        board.append(tile)
    }
}
class Pawn {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
    }
    drawPawns () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) > 7 && Number(item.id) < 16) {
            const pawn = document.createElement('img');
            pawn.style.height = this.#height + "px";
            pawn.style.width = this.#width + "px";
            pawn.src = "images/pawn-black.png";
            pawn.classList.add('piece');
            item.append(pawn);
            } else if(Number(item.id) > 47 && Number(item.id) < 56) {
                const pawn = document.createElement('img');
                pawn.style.height = this.#height + "px";
                pawn.style.width = this.#width + "px";
                pawn.src = "images/pawn-white.png";
                pawn.classList.add('piece');
                item.append(pawn);
            }
        })
    }
}

class Rook {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
    }
    drawRooks () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) === 0 || Number(item.id) === 7) {
                const rook = document.createElement('img');
                rook.height = this.#height;
                rook.width = this.#width;
                rook.src = "images/rook-black.png";
                rook.classList.add('piece');
                item.append(rook)
            } else if (Number(item.id) === 56 || Number(item.id) === 63) {
                const rook = document.createElement('img');
                rook.height = this.#height;
                rook.width = this.#width;
                rook.src = "images/rook-white.png";
                rook.classList.add('piece');
                item.append(rook)
            }
        })
    }
}
class Knight {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
    }
    drawKinghts() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) === 1 || Number(item.id) === 6) {
                const knight = document.createElement('img');
                knight.height = this.#height;
                knight.width = this.#width;
                knight.src = "images/knight-black.png";
                knight.classList.add('piece');
                item.append(knight)
            } else if (Number(item.id) === 57 || Number(item.id) === 62) {
                const knight = document.createElement('img');
                knight.height = this.#height;
                knight.width = this.#width;
                knight.src = "images/knight-white.png";
                knight.classList.add('piece');
                item.append(knight)
            }
        })
    }
}
class Bishop {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
    }
    drawBishops () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) === 2 || Number(item.id) === 5) {
                const bishop = document.createElement('img');
                bishop.height = this.#height;
                bishop.width = this.#width;
                bishop.src = "images/bishop-black.png";
                bishop.classList.add('piece');
                item.append(bishop)
            } else if (Number(item.id) === 58 || Number(item.id) === 61) {
                const bishop = document.createElement('img');
                bishop.height = this.#height;
                bishop.width = this.#width;
                bishop.src = "images/bishop-white.png";
                bishop.classList.add('piece');
                item.append(bishop)
            }
        })
    }
}
class Queen {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;   
    }
    drawQueens () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) === 3) {
                const queen = document.createElement('img');
                queen.height = this.#height;
                queen.width = this.#width;
                queen.src = "images/queen-black.png";
                queen.classList.add('piece');
                item.append(queen)
            } else if (Number(item.id) === 59) {
                const queen = document.createElement('img');
                queen.height = this.#height;
                queen.width = this.#width;
                queen.src = "images/queen-white.png";
                queen.classList.add('piece');
                item.append(queen)
            }
        })
    }
}
class King {
    #height;
    #width;
    constructor (height,width) {
        this.#height = height;
        this.#width = width;
    }
    drawKings () {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((item)=>{
            if(Number(item.id) === 4) {
                const king = document.createElement('img');
                king.height = this.#height;
                king.width = this.#width;
                king.src = "images/king-black.png";
                king.classList.add('piece');
                item.append(king)
            } else if (Number(item.id) === 60) {
                const king = document.createElement('img');
                king.height = this.#height;
                king.width = this.#width;
                king.src = "images/king-white.png";
                king.classList.add('piece');
                item.append(king)
            }
        })
    }
}
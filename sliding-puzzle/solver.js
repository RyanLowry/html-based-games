class Board{
	tiles = [[]];
	constructor(tiles){
		this.tiles = tiles;
	}
	manhattan(){
        let manhattanDist = 0;
		for (let i = 0; i < this.tiles.length * this.tiles.length; i++) {
            let xPos = Math.floor(i / (this.tiles.length));
            let yPos = (i % (this.tiles.length));
            let tileNum = this.tiles[xPos][yPos];
            if (tileNum.number == 0) {
                continue;
            }
            // subtract one for off-by-one due to not using 0;
            let  xTrue = Math.floor((tileNum.number - 1) / (this.tiles.length));
            let yTrue = ((tileNum.number - 1) % (this.tiles.length));
            manhattanDist += Math.abs(xPos - xTrue) + Math.abs(yPos - yTrue);
			
        }
		return manhattanDist;
	}
	isGoal(){
		return this.manhattan() == 0;
	}
	equals(board){
		if(board == this){
			return true;
		}
		if (board == null){
			return false;
		}
		let newBoard = board;
		return this.deepEquals(this.tiles,newBoard.tiles);
    }
    deepEquals(x, y, z) {
        return x === y || typeof x == "function" && y && x.toString() == y.toString()
          || x && y && typeof x == "object" && x.constructor == y.constructor
          && (z = Object.keys(y)) && z.length == Object.keys(x).length
          && !z.find(v => !this.deepEquals(x[v], y[v]));
      }
	neighbors(){
		let boards = [];
		let openTileX = 0;
        let openTileY = 0;
        for (let i = 0; i < this.tiles.length * this.tiles.length; i++) {
            let xPos = Math.floor(i / (this.tiles.length));
            let yPos = (i % (this.tiles.length));
            let tileNum = this.tiles[xPos][yPos];
            if (tileNum.number == 0) {
                openTileX = xPos;
                openTileY = yPos;
                break;
            }
        }

        let newTiles = [[]];
        if (openTileX > 0 && openTileX <= this.tiles.length - 1) { // swap up
            newTiles = this.copyBoard();
            this.swap(newTiles, openTileX - 1, openTileY, openTileX, openTileY);
            boards.push(new Board(newTiles));
        }
        if (openTileX < this.tiles.length - 1) { // swap down
            newTiles = this.copyBoard();
            this.swap(newTiles, openTileX + 1, openTileY, openTileX, openTileY);
            boards.push(new Board(newTiles));
        }
        if (openTileY > 0 && openTileY <= this.tiles.length - 1) { // swap left
            newTiles = this.copyBoard();
            this.swap(newTiles, openTileX, openTileY - 1, openTileX, openTileY);
            boards.push(new Board(newTiles));
        }
        if (openTileY < this.tiles.length - 1) { // swap right
            newTiles = this.copyBoard();
            this.swap(newTiles, openTileX, openTileY + 1, openTileX, openTileY);
            boards.push(new Board(newTiles));
        }
        return boards;
	}
	copyBoard(){
		let boardCopy = [];
        for (var i = 0; i < this.tiles.length; i++)
            boardCopy[i] = this.tiles[i].slice();

        return boardCopy;
	}
	swap(board,i, j, i0, j0) {
        let tmp = board[i][j];
        board[i][j] = board[i0][j0];
        board[i0][j0] = tmp;
	}
}

class Solver{
    constructor(board){
        this.minNodeFinal = null;
        this.initial = new Board(board);
        this.pq = new PriorityQueue();
        this.pq.insert(new Node(this.initial,0,null))
        let limit = 10000;
        while(!this.pq.min().board.isGoal()){
            this.minNode = this.pq.delMin();
            let neighborNodes = this.minNode.board.neighbors();
            neighborNodes.forEach(neighbor => {
                if (this.minNode.moves == 0){
                    this.pq.insert(new Node(neighbor,this.minNode.moves + 1,this.minNode))
                }else if(!neighbor.equals(this.minNode.prevNode.board)){
                    this.pq.insert(new Node(neighbor,this.minNode.moves + 1,this.minNode))
                }
            });
            this.minNodeFinal = this.pq.min();
            limit--;
            if(limit === 0){
                break;
            }
        }
    }
    solution(){
        let solution = [];
        let curr = this.pq.min();
        while(curr.prevNode != null){
            solution.push(curr.board);
            curr = curr.prevNode;
        }
        solution.push(this.initial);
        return solution;
    }
}

class Node{
    constructor(board,moves,node){
        this.board = board;
        this.moves = moves;
        this.priority = moves + board.manhattan();
        this.prevNode = node;
    }
}
//array implementation
class PriorityQueue{
	constructor(){
        this.queue = [];
        this.numItems = 0;

    }
    isEmpty(){
        return this.numItems == 0;
    }
	insert(item){
        this.queue.push(item);
        this.queue.sort((a,b) => {
            return (a.priority - b.priority);
        })
        this.numItems++;
	}
	length(){
        return this.numItems;
	}
	min(){
        return this.queue[0];
		
	}
	delMin(){
        if(!this.isEmpty()){
            this.numItems--;
            return this.queue.shift();
        }
	}
	clear(){
        this.queue = [];

	}
}
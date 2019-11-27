class GameManager{
	constructor(numBombs,lives,grid){
		this.numBombs = numBombs || 25;
		this.lives = lives || 3;
		this.positions = [[]];
		this.bombPos = [];
		this.grid = grid;
		this.gameOver = false;
		this.isWin = false;

	}
	setBombs(){
		let bombsLeft = this.numBombs;
		while (bombsLeft > 0){
			let rand1 = Math.floor(Math.random() * this.positions[0].length)
			let rand2 = Math.floor(Math.random() * this.positions[0].length)
			let pos = this.positions[rand1][rand2]
			if (!pos.properties.isBomb){
				pos.properties.isBomb = true;
				this.bombPos.push(pos);
				bombsLeft--;
			}

			
		}
		this.solvePositionNumbers();
	}
	solvePositionNumbers(){
		this.bombPos.forEach((bombPos) => {

			for (let i = 0; i < 9; i++) {
				if (i <= 2){
					//originally tried finding undefined values, results led to results never passing
					try{
						this.positions[(bombPos.pos.x - 1) + i][bombPos.pos.y - 1].properties.number += 1;
					}catch(err){
					}
					
				}else if (i <= 5){
					try{
						this.positions[(bombPos.pos.x - 4) + i][bombPos.pos.y].properties.number += 1;
					}catch(err){
					}
				}else if(i <= 8){
					try{
						this.positions[(bombPos.pos.x - 7) + i][bombPos.pos.y + 1].properties.number += 1;
					}catch(err){
					}
				}
			}

		});
		this.placeHidden();
	}
	placeHidden(){
		for (let i = 0; i < this.positions.length; i++) {
			for (let j = 0; j < this.positions[i].length; j++) {
				const pos = this.positions[i][j];
				pos.grid.style.backgroundColor = "gray";

			}
		}
	}

	displayPosition(position){
		if(!this.gameOver){
			if(position.properties.isBomb){
				position.grid.textContent = "X";
				position.properties.isCovered = false;
				this.removeLives();
			}else{
				position.properties.number != 0 ? position.grid.textContent = position.properties.number : this.floodFillZeros(position.pos.x,position.pos.y);
				position.properties.isCovered = false;
			}
			position.grid.style.backgroundColor = "white"
			position.grid.style.color = "black";
		}
		this.checkAllBombs();
	}

	displayAllPositions(){
		for (let i = 0; i < this.positions.length; i++) {
			for (let j = 0; j < this.positions[i].length; j++) {
				const pos = this.positions[i][j];
				pos.grid.style.backgroundColor = "white";
				if(pos.properties.isBomb){
					pos.grid.textContent = "X";
					if(this.isWin){
						pos.grid.style.backgroundColor = "green";
					}else{
						pos.grid.style.backgroundColor = "red";
					}
					
				}else{
					pos.properties.number != 0 ? pos.grid.textContent = pos.properties.number : pos.grid.textContent = "";
				}
			}
		}
	}

	flagPosition(position){
		if(!this.gameOver){
			if(!position.properties.isFlagged){
				position.grid.textContent = ">";
				position.grid.style.color = "red";
				position.properties.isFlagged = true;
			}else{
				position.grid.textContent = "";
				position.properties.isFlagged = false;
			}
		}
		this.checkAllBombs();
	}
	checkAllBombs(){
		let gridCleared = true;
		for (let i = 0; i < this.positions.length; i++) {
			let arrClear = this.positions[i].every((pos) =>{
				
				if(pos.properties.isBomb){
					return true;
				}
				else if(!pos.properties.isCovered){
					return true;
				}
			});
			if(!arrClear){
				gridCleared = false;
				break
			}
		}
		if(gridCleared){
			this.isWin = true;
			this.endGame();
		}
	}
	removeLives(){
		this.lives--;
		if(this.lives == 0){
			this.endGame();
		}
	}
	endGame(){
		this.gameOver = true;
		this.displayAllPositions();
	}

	floodFillZeros(x,y){
		//will not properly work if try not here, floodfill will stop on edge of a screen causing positions[x][y] to be undefined
		try{
			if (
				x < 0 || x >= this.positions.length || 
				y < 0 || y >= this.positions[0].length || 
				this.positions[x][y].grid.style.backgroundColor == "white"
			)
			
			{
				return
			}
		}catch(err){
			return
		}

		this.positions[x][y].grid.style.backgroundColor = "white";
		this.positions[x][y].properties.isCovered = false;
		if(this.positions[x][y].properties.number != 0){
			this.positions[x][y].grid.textContent = this.positions[x][y].properties.number;
			return

		}
		this.floodFillZeros(x + 1,y);
		this.floodFillZeros(x - 1,y);
		this.floodFillZeros(x,y + 1);
		this.floodFillZeros(x,y - 1);

	}

}

class Position{
	constructor(pos,grid){
		this.grid = grid;
		this.pos = pos;
		this.properties = {
			isBomb: false,
			isFlagged: false,
			number: 0,
			isCovered: true,
		}
	}
}
class UI{
	constructor(){
		this.gridWidth = document.getElementById("grid-width");
		this.gridHeight = document.getElementById("grid-height");
		this.bombs = document.getElementById("num-bombs");
		this.lives = document.getElementById("num-lives");
		this.restart = document.getElementById("restart");
	}
}


(function(){
	initGrid = (bw,bh,gw,gh) =>{
		document.getElementById('grid-container').innerHTML = ""
		let blockWidth = bw;
		let blockHeight = bh;
		let grids = [];
		let gridWidth = 1;
		let gridHeight = gh;
		while(gridWidth <= gw){
			let div = document.createElement("div");
			div.setAttribute('id',`grid${gridWidth}`);
			div.setAttribute('class','grid-x');
			document.getElementById('grid-container').appendChild(div);
			let grid = new Grid(div,blockWidth,blockHeight * gridHeight);
			grids.push(grid);
			gridWidth++;
	
		}
		grids.forEach(element => {
			element.create(blockWidth,blockHeight);
		});
		return grids;
	}
	let ui = new UI();
	let grid;
	let manager;
	generateSweeperGrid(32,32,50,1);

	document.getElementById("grid-container").oncontextmenu = function (e)
	{
		for (let i = 0; i < manager.positions.length; i++) {
			item = manager.positions[i].find((item) => {
				return item.grid === e.target;
			});
			if(item){
				break;
			}
		}
		manager.flagPosition(item);
		return false;
	}
	document.getElementById("grid-container").addEventListener("click",(e) => {
		let item;
		for (let i = 0; i < manager.positions.length; i++) {
			item = manager.positions[i].find((item) => {
				return item.grid === e.target;
			});
			if(item){
				break;
			}
		}

		manager.displayPosition(item);
	});

	function generateSweeperGrid(w,h,bombNum,livesNum){
		grid = initGrid(25,25,w,h);
		manager = new GameManager(bombNum,livesNum,grid);
	
		for (let i = 0; i < grid.length; i++) {
			const ele = grid[i];
			manager.positions[i] = [] 
			for (let j = 0; j < grid[i].gridDiv.childNodes.length; j++) {
				const ele = grid[i].gridDiv.childNodes[j];
				manager.positions[i].push(new Position({x:i,y:j},grid[i].gridDiv.childNodes[j]));
			}
		}
		manager.setBombs();

	}

	ui.restart.addEventListener("click",(e)=>{
		
		generateSweeperGrid(ui.gridWidth.value,ui.gridWidth.value,ui.bombs.value,ui.lives.value);

	});


	
}());
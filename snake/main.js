class Snake{
	constructor(grids){
		this.grid = grids;
		this.snakeParts = [];
		// Create 2 parts to verify removal of color after leaving snake.
		this.snakeParts.push(new SnakeParts({x:0,y:0},"#000000"));
		this.snakeParts.push(new SnakeParts({x:0,y:0},"#000000"));
		this.snakePath = [];
		this.pos = {x:Math.floor(grids.length / 2),y:Math.floor(grids[0].gridDiv.childNodes.length / 2)};
		this.direction = -1;
		this.currentGrowthSpot = new growthSpot({x:Math.floor(Math.random()* this.grid.length),y:Math.floor(Math.random() * this.grid[0].gridDiv.childNodes.length)});
		this.gameOver = false;
	}
	move(){
		switch(this.direction){
			case 0:
				this.pos.y -= 1;
				break;
			case 1:
				this.pos.x += 1;
				break;
			case 2:
				this.pos.y += 1;
				break;
			case 3:
				this.pos.x -= 1;
				break;
		}
		if(this.pos.x > this.grid.length - 1){
			this.pos.x = 0;
			
		}else if(this.pos.x < 0){
			this.pos.x = this.grid.length - 1;
		}
		if(this.pos.y > this.grid[0].gridDiv.childNodes.length - 1){
			this.pos.y = 0;
		}else if(this.pos.y < 0){
			this.pos.y = this.grid[0].gridDiv.childNodes.length - 1
		}
		this.snakePath.push({x:this.pos.x,y:this.pos.y});
		
		let path = this.snakePath.slice(-this.snakeParts.length);
		for(let i = 0; i < this.snakeParts.length; i++){
			this.snakeParts[i].pos = path[i];
		}

	}
	checkCollisions(){
		//check first snake if colliding with others;
		let path = this.snakePath.slice(-this.snakeParts.length);
		for(let i = 0; i < path.length; i++){
			if(i != this.snakeParts.length - 1 && this.direction != -1){
				if (path[i].x === this.snakeParts[this.snakeParts.length - 1].pos.x && path[i].y === this.snakeParts[this.snakeParts.length - 1].pos.y){
					this.gameOver = true;
				}
			}
		}
		if(this.snakeParts[this.snakeParts.length - 1].pos != undefined){
			if(this.currentGrowthSpot.pos.x === this.snakeParts[this.snakeParts.length - 1].pos.x && this.currentGrowthSpot.pos.y === this.snakeParts[this.snakeParts.length - 1].pos.y){
				this.addPart("#000000");
				this.currentGrowthSpot = new growthSpot({x:Math.floor(Math.random()* this.grid.length),y:Math.floor(Math.random() * this.grid[0].gridDiv.childNodes.length)});
			}
		}

	}
	draw(){
		let path = this.snakePath.slice(-this.snakeParts.length);
		//draw snake
		for(let i = 0; i < this.snakeParts.length; i++){
			if(i === this.snakeParts.length - 1 && this.snakeParts[this.snakeParts.length - 1].pos != undefined){
				this.grid[this.snakeParts[i].pos.x].gridDiv.childNodes[this.snakeParts[i].pos.y].style.backgroundColor = this.snakeParts[i].color;
			}
			else if (i === 0){
				this.grid[this.snakeParts[i].pos.x].gridDiv.childNodes[this.snakeParts[i].pos.y].style.backgroundColor = "#ffffff";
			}
			else{
				if(this.snakeParts[i].pos != undefined){
					this.grid[this.snakeParts[i].pos.x].gridDiv.childNodes[this.snakeParts[i].pos.y].style.backgroundColor = this.snakeParts[i].color;
				}
				
			}

		}
		//draw growth
		this.grid[this.currentGrowthSpot.pos.x].gridDiv.childNodes[this.currentGrowthSpot.pos.y].style.backgroundColor = "#ff0000";



	}
	addPart(col){
		this.snakeParts.splice(this.snakeParts.length - 2,0,new SnakeParts(this.snakeParts[this.snakeParts.length - 1].pos,col));
	}
}
class SnakeParts{
	constructor(pos,color){
		this.pos = pos || {x:0,y:0};

		this.color = color || "#000000";
	}
}
class growthSpot{
	constructor(pos){
		this.pos = pos;
	}
}

(function(){
	initGrid = (bw,bh,gw,gh) =>{
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
			grids.push(grid)
			gridWidth++;
	
		}
		grids.forEach(element => {
			element.create(blockWidth,blockHeight);
		});
		return grids;
	}
	let grids = initGrid(25,25,32,32)

	let snake = new Snake(grids);
	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;
	fps = 10;
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	let direction = -1;


	draw = () => {

    requestAnimationFrame(draw);
	if(snake.gameOver != true){
		
		now = Date.now();
		elapsed = now - then;
			if (elapsed > fpsInterval) {
				snake.direction = direction;
				then = now - (elapsed % fpsInterval);
				snake.move();
				snake.checkCollisions();
				snake.draw();
				
			}
		}
		
	}
	draw();

	document.addEventListener('keydown',e=>{
		switch(e.keyCode){
			case 87:
				if(snake.direction != 2){
					direction = 0;
				}
				
				break;
			case 68:
				if(snake.direction != 3){
					direction = 1;
				}
				break;
			case 83:
				if(snake.direction != 0){
					direction = 2;
				}
				break;
			case 65:
				if(snake.direction != 1){
					direction = 3;
				}
				break;
		}
	});
	
}());
class GridManager{
	constructor(grid){
		this.grid = grid;
		// row and column are reversed from grid positions, use x->y and y->x in most situations.
		this.positions = [[]];
		this.openSpotX = 0;
		this.openSpotY = 0;
	}
	checkSwap(tile){
		if(tile.pos.y < this.positions.length - 1){
			if(this.positions[tile.pos.y + 1][tile.pos.x].number === 0 && this.positions[tile.pos.y + 1][tile.pos.x].pic === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='){
				this.swap(tile.pos.x,tile.pos.y,tile.pos.x,tile.pos.y + 1);
				return;
			}
		}if(tile.pos.y > 0){
			if(this.positions[tile.pos.y - 1][tile.pos.x].number === 0 && this.positions[tile.pos.y - 1][tile.pos.x].pic === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='){
				this.swap(tile.pos.x,tile.pos.y,tile.pos.x,tile.pos.y - 1);
				return;
			}
		}
		if(tile.pos.x < this.positions[0].length - 1){
			if(this.positions[tile.pos.y][tile.pos.x + 1].number === 0 && this.positions[tile.pos.y][tile.pos.x + 1].pic === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='){
				this.swap(tile.pos.x,tile.pos.y,tile.pos.x + 1,tile.pos.y);
				return;
			}
			

		}if(tile.pos.x > 0){
			if(this.positions[tile.pos.y][tile.pos.x - 1].number === 0 && this.positions[tile.pos.y][tile.pos.x - 1].pic === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='){
				this.swap(tile.pos.x,tile.pos.y,tile.pos.x - 1,tile.pos.y);
				return;
			}
		}

	}
	shuffle(){
		var randomNum = Math.floor((Math.random() * 150) + 50) * this.positions.length;
		while(randomNum > 0){
			let move = Math.floor(Math.random() * 4)
			let moveX = 0;
			let moveY = 0;
			switch(move){
				case 0:
					moveX++;
				break;
				case 1:
					moveX--;
				break;
				case 2:
					moveY++;
				break;
				case 3:
					moveY--;
				break;
			}
			//don't count moves unless positions are valid on board.
			if(typeof this.positions[this.openSpotX + moveX] != undefined && typeof this.positions[this.openSpotX + moveX] != "undefined"){
				if(typeof this.positions[this.openSpotX + moveX][this.openSpotY + moveY] != undefined && typeof this.positions[this.openSpotX + moveX][this.openSpotY + moveY] != "undefined"){
					let nextToEmpty = this.positions[this.openSpotX + moveX][this.openSpotY + moveY];
					this.checkSwap(nextToEmpty);
					this.openSpotX += moveX;
					this.openSpotY += moveY;
					randomNum--;
				}

			}
		}

	}
	swap(x,y,x1,y1){
		let temp = this.positions[y][x];
		this.positions[y][x] = this.positions[y1][x1];
		this.positions[y1][x1] = temp;
		this.updateGrid(x,y,x1,y1)
	}
	updateGrid(x,y,x1,y1){
		if(this.grid[x].gridDiv.childNodes[y].textContent != ""){
			this.grid[x].gridDiv.childNodes[y].textContent = this.positions[y][x].number;
			this.grid[x1].gridDiv.childNodes[y1].textContent = this.positions[y1][x1].number;
		}
		else{
			this.grid[x].gridDiv.childNodes[y].children[0].src= this.positions[y][x].pic;
			this.grid[x1].gridDiv.childNodes[y1].children[0].src = this.positions[y1][x1].pic;
		}

	}
	//only use for solution calls;
	updateFull(tiles){
		if(tiles === undefined){
			return;
		}
		for (let i = 0; i < this.positions.length; i++) {
			for (let j = 0; j < this.positions[i].length; j++) {
				this.grid[j].gridDiv.childNodes[i].id = tiles.tiles[i][j].number;
				if(this.grid[j].gridDiv.childNodes[i].textContent != ""){
					this.grid[j].gridDiv.childNodes[i].textContent = tiles.tiles[i][j].number;
				}
				else{
					this.grid[j].gridDiv.childNodes[i].children[0].src = tiles.tiles[i][j].pic;
				}
			}
		}
	}
	solve(){
		//possible issue by using reference, unable to solve more than one grid per instantiate.
		let pos = this.positions;
		let solver = new Solver(pos);
		this.solutions = solver.solution();
		//popping this removed current board from stack, not needed for solution.
		this.solutions.pop();
	}
	nextSolution(){
		this.updateFull(this.solutions.pop());
	}
}
class Position{
	constructor(pos,grid,number){
		this.grid = grid;
		this.pos = pos;
		this.number = number;
		this.pic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	}
}

(function(){
	function initGrid(bw,bh,gw,gh){
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
	
	let isPicture = false;
	let currImage = null;
	let grid;
	let manager;
	generateGrid(3,3);

	function generateGrid(w,h){
		grid = initGrid(100,100,w,h);
		manager = new GridManager(grid);
			let currNum = 1;
			for (let i = 0; i < grid.length; i++) {
				manager.positions[i] = [];
				for (let j = 0; j < grid[i].gridDiv.childNodes.length; j++) {
					if(currNum == w * h){
						currNum = 0;
						manager.openSpotY = h - 1;
						manager.openSpotX = w - 1;
					}
					grid[j].gridDiv.childNodes[i].id = currNum;
					grid[j].gridDiv.childNodes[i].textContent = currNum;
	
					manager.positions[i].push(new Position({x:j,y:i},grid[j].gridDiv.childNodes[i],currNum));
					currNum++;
				}
			}
		if(isPicture ===  true){
			getImageData(currImage);
		}

	}
	//FILE AND IMAGE GENERATION FUNCTIONS
	document.getElementById('myFile').addEventListener("change",(e)=>{
		var target = e.target || window.event.srcElement,
			files = target.files;
		if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = () => showImage(fr);
			fr.readAsDataURL(files[0]);
	}
})

	function showImage(fileReader) {
		var img = document.getElementById("image");
		img.onload = () => getImageData(img);
		img.src = fileReader.result;
	}
	function getImageData(img) {
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;
	currImage = img;
	ctx.drawImage(img, 0, 0);
	let widthData = Math.floor(img.width / grid.length);
	let heightData = Math.floor(img.height / grid[0].gridDiv.childNodes.length);
	let currX = 0;
	let currY = 0;
	isPicture = true;
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].gridDiv.childNodes.length; j++) {
			grid[i].gridDiv.childNodes[j].textContent = "";
			if(i == grid.length - 1 && j == grid[0].gridDiv.childNodes.length - 1){
				let im = new Image();
				//transparent base-64 image, used to prevent displaying broken image.
				im.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
				manager.positions[j][i].pic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
				grid[i].gridDiv.childNodes[j].style.width = widthData + "px";
				grid[i].gridDiv.childNodes[j].style.height = heightData + "px";
				grid[i].gridDiv.childNodes[j].style.overflow = "hidden";
				grid[i].gridDiv.childNodes[j].appendChild(im)
				continue;
			}
			let imageData = ctx.getImageData(currX,currY, widthData, heightData);
			ctx.putImageData(imageData,0,0);
			let im = new Image();
			im.src = canvas.toDataURL();
			manager.positions[j][i].pic = canvas.toDataURL();
			grid[i].gridDiv.childNodes[j].style.width = widthData + "px";
			grid[i].gridDiv.childNodes[j].style.height = heightData + "px";
			grid[i].gridDiv.childNodes[j].style.overflow = "hidden";
			grid[i].gridDiv.childNodes[j].appendChild(im)
			currY += heightData;
			}
			currY = 0;
			currX += widthData;
		}

	}


	this.document.getElementById('grid-input').textContent = document.getElementById('grid-size').value;
	this.document.getElementById('opac-input').textContent = document.getElementById('opacity').value;

	// BUTTON EVENTS EXCLUDING FILE

	document.getElementById("grid-container").addEventListener("click",(e) => {
		let item;
		for (let i = 0; i < manager.positions.length; i++) {
			item = manager.positions[i].find((item) => {
				if(isPicture){
					return item.grid === e.target.parentNode;
				}else{
					return item.grid === e.target;
				}
				
				
			});
			if(item){
				manager.checkSwap(item);
				break;
			}
		}
	});

	document.getElementById("update").addEventListener("click",x => {
		generateGrid(document.getElementById('grid-size').value,document.getElementById('grid-size').value)
	});
	document.getElementById("solve").addEventListener("click",x => {
		manager.solve();
	});
	document.getElementById("shuffle").addEventListener("click",x => {
		manager.shuffle();
	});
	document.getElementById("next-solution").addEventListener("click",x => {
		manager.nextSolution();
	});
}());
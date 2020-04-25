class Grid{
	constructor(div,width,height){
		this.width = width;
		this.height = height;
		this.gridColor = "#000000";
		this.blockColor = "#000000";
		this.gridDiv = div;
		this.width = width;
		this.height = height;
		this.divWidth = 32;
		this.divHeight = 32;
	}
	create(gridWidth,gridHeight){
		let width = parseInt(gridWidth);
		let height = parseInt(gridHeight);
		this.divWidth = width;
		this.divHeight = height;
		// remove size to confine with different picture sizes;
		// this.gridDiv.style.width = this.width + "px";
		// this.gridDiv.style.height = this.height + "px";
		for(var x = 0; x < this.width; x+=width){
			for(var y = 0; y < this.height; y+=height){
				let section = document.createElement("div");
				section.classList.add("grid");
				
				section.style.height = height + "px";
				section.style.width = width + "px";
				section.style.border = "solid black 1px";
				section.style.textAlign = "center";
				section.style.verticalAlign = "middle";
				
				this.gridDiv.appendChild(section);

			}
		}
	}

};
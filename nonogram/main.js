// HTML inputs & event variables
var gw = document.getElementById("gridWidth");
var gh = document.getElementById("gridHeight");
var file = document.getElementById("file");
var upd = document.getElementById("updateGrid");
let table = document.getElementById("nonogram");
let output = document.getElementById("output")
let currentElement = undefined;
let mouseDown = false

let width = 0;
let height = 0;

// START EVENT LISTENERS
// currently doesn't work well when
table.addEventListener('mousedown', function (e) {
    // currentElement = e.target;
    mouseDown = true
    if (e.target) {

        let currentPos = e.target.id.split('-');
        checkPosition(currentPos)
    }
})

table.addEventListener('mousemove', function (e) {
    if (currentElement != e.target && mouseDown) {
        if (e.target) {
            let currentPos = e.target.id.split('-');
            checkPosition(currentPos)
        }
    }
    currentElement = e.target;
})
document.addEventListener('mouseup', function (e) {
    currentElement = undefined;
    mouseDown = false
})

// END EVENT LISTENERS

function checkPosition(currentPos) {
    let tile = nonoGram.grid.find(i => i.pos.join() == currentPos.join());
    tile.updateState();
    let cols = nonoGram.grid.filter(i => i.pos[0] == currentPos[0]).sort((a, b) => a.pos[1] > b.pos[1]);
    let rows = nonoGram.grid.filter(i => i.pos[1] == currentPos[1]).sort((a, b) => a.pos[0] > b.pos[0]);
    let solvedCols = solveSection(cols);
    let solvedRows = solveSection(rows);
    solvedCols.join() == nonoGram.settings.cols[currentPos[0] - 1].label.join() ? nonoGram.settings.cols[currentPos[0] - 1].completed = true : nonoGram.settings.cols[currentPos[0] - 1].completed = false;
    solvedRows.join() == nonoGram.settings.rows[currentPos[1] - 1].label.join() ? nonoGram.settings.rows[currentPos[1] - 1].completed = true : nonoGram.settings.rows[currentPos[1] - 1].completed = false;
    if (nonoGram.settings.cols.every(item => item.completed) && nonoGram.settings.rows.every(item => item.completed)) {
        completeGrid();
    }
}
/**
 * 
 * @param {array} section - array of column/rows
 * @returns array of integers that are marked in order
 * 
 */
function solveSection(section) {
    let selectedSection = [];
    let sectionNum = 0;
    section.forEach((item) => {
        if (item.state == 1) {
            sectionNum++;
        } else if (sectionNum != 0) {
            selectedSection.push(sectionNum);
            sectionNum = 0;
        }
    })
    if (sectionNum != 0) {
        selectedSection.push(sectionNum)
    }
    return selectedSection
}

// this really should do more, but oh well it works.
function completeGrid() {
    output.style.visibility = "visible";
}

upd.onclick = function () {
    openFile(file, { width: gw.value, height: gh.value });
}
/**
 * opens and reads file image data
 * @param {HTMLElement} file - file input of an Image
 * @param {Object} dimens - width and height to the grid
 */
var openFile = function (file, dimens) {
    var input = file;
    var reader = new FileReader();
    reader.onload = function (eve) {
        let img = new Image();
        img.src = eve.target.result;
        img.onload = function () {
            let imgReader = new ImgReader(img, dimens.width, dimens.height, []);
            nonoGram.updateSettings(imgReader.gridOptions);
        }
        var dataURL = reader.result;
        var output = document.getElementById('output');
        output.src = dataURL;
        output.style.visibility = "hidden";
    };
    reader.readAsDataURL(input.files[0]);
};

// START NONOGRAM INFORMATION

/** Holds information of grid for a nonogram */
class Nonogram {
    constructor() {
        this.settings = { cols: [new Label([1]), new Label([1]), new Label([2]), new Label([4])], rows: [new Label([1, 1]), new Label([1, 1]), new Label([2]), new Label([2])] };
        this.updateSettings(this.settings)
    }
    updateSettings(settings) {
        table.innerHTML = '';
        this.settings.cols = settings.cols;
        this.settings.rows = settings.rows;
        this.grid = this.generateTiles();
    }
    // loops through rows and columns and assigns the html to display as a table
    generateTiles() {
        let grid = [];

        for (let y = 0; y <= this.settings.rows.length; y++) {
            let row = document.createElement('tr');
            row.setAttribute("id", `row-${y}`);

            if (y == 0) {
                let emptyTd = document.createElement('td');
                row.appendChild(emptyTd);
                this.settings.cols.forEach((item, index) => {
                    let colTd = document.createElement('td');
                    colTd.setAttribute("id", `col-${index + 1}`);
                    colTd.classList.add('column-label');
                    item.label.map(item => {
                        let newSpan = document.createElement('span');
                        newSpan.textContent = item;
                        colTd.appendChild(newSpan);
                    })
                    row.appendChild(colTd);
                });
                table.appendChild(row);
                continue;
            }
            for (let x = 0; x <= this.settings.cols.length; x++) {
                if (x == 0) {
                    let colTd = document.createElement('td');
                    colTd.classList.add("row-label");
                    this.settings.rows[y - 1].label.map((items) => {
                        let newSpan = document.createElement('span');
                        newSpan.textContent = items;
                        colTd.appendChild(newSpan);
                    })
                    row.appendChild(colTd);
                } else {
                    let colTd = document.createElement('td');
                    colTd.setAttribute("id", `${x}-${y}`);
                    row.appendChild(colTd);
                    grid.push(new Tiles(x, y, colTd));
                }
            }
            table.appendChild(row);
        }
        return grid;
    }
}
class Label {
    constructor(label) {
        label.length == 0 ? this.completed = true : this.completed = false;
        this.label = label;
    }
}
/** Tiles for the nonogram */
class Tiles {
    constructor(x, y, element) {
        this.pos = [x, y];
        this.ele = element;
        this.state = 0;
    }
    updateState(state) {
        // state argument not always given, if given the value is static else increment up to 2 and go to 0 if over
        if (!state) this.state == 2 ? this.state = 0 : this.state += 1;
        this.ele.classList.remove('empty');
        this.ele.classList.remove('solid');
        this.ele.classList.remove('transparent');
        switch (this.state) {
            case 0:
                this.ele.classList.add('empty');
                break;
            case 1:
                this.ele.classList.add('solid');
                break;
            case 2:
                this.ele.classList.add('transparent');
                break;
        }
        if (state) this.state = state;
    }
}

nonoGram = new Nonogram();

// END NONOGRAM INFORMATION


// START IMAGE READER INFORMATION


/** Reads and parses image data of a specified image */
class ImgReader {
    /**
     * @param {Image} img 
     * @param {int} w - chunk of image width being split
     * @param {int} h - chunk of image height being split
     * @param {array} colors - array of objects with (r,g,b) properties
     */
    constructor(img, w, h, colors) {
        let colorValues = [];
        colorValues.push({
            r: 0,
            g: 0,
            b: 0,
        })
        colorValues.push({
            r: 255,
            g: 255,
            b: 255,
        })

        colorValues.sort((a, b) => (a.r + a.g + a.b / 3) >= (b.r + b.g + b.b / 3));

        this.gridOptions = {
            'cols': [],
            'rows': [],
            'colors': colorValues
        };

        this.img = img
        this.widthChunk = w;
        this.heightChunk = h;

        this.readImageData(img)
    }

    readImageData() {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = this.img.width;
        canvas.height = this.img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0);

        let prevX = 0;
        let prevY = 0;

        let rowObject = {};
        let colObject = {};
        // loops through chunks of image data to store black/white cell data
        for (let h = 0; h < this.heightChunk; h++) {
            // this and the width object is here so it won't override the created object when it is first created
            if (!(h in rowObject)) {
                rowObject[h] = { count: 0, arr: [] };
            }
            for (let w = 0; w < this.widthChunk; w++) {
                if (!(w in colObject)) {
                    colObject[w] = { count: 0, arr: [] };
                }
                let data = ctx.getImageData(prevY, prevX, canvas.width / this.widthChunk, canvas.height / this.heightChunk);
                let rs = [];
                let gs = [];
                let bs = [];
                //let as = [];

                // stores pixel data then averages the data to determine if it meets the necessary threshold.
                for (let i = 0; i < data.data.length; i += 4) {
                    rs.push(data.data[i]);
                    gs.push(data.data[i + 1]);
                    bs.push(data.data[i + 2]);
                    //as.push(data.data[i + 3]);
                }
                let pixData = {
                    'r': Math.floor(rs.reduce((a, b) => a + b) / rs.length),
                    'g': Math.floor(gs.reduce((a, b) => a + b) / gs.length),
                    'b': Math.floor(bs.reduce((a, b) => a + b) / bs.length),
                    //'a': Math.floor(as.reduce((a, b) => a + b) / as.length)
                }

                let value = this.checkColor(pixData);

                // logic to add count and arr values to objects, set up to separate when the pixeldata value returns white (0)
                if (value != 0) {
                    rowObject[h].count++;
                    colObject[w].count++;
                }
                if (value === 0 && rowObject[h].count != 0) {
                    rowObject[h].arr.push(rowObject[h].count);
                    rowObject[h].count = 0;
                }
                if (value === 0 && colObject[w].count != 0) {
                    colObject[w].arr.push(colObject[w].count);
                    colObject[w].count = 0;
                }
                prevY += canvas.width / this.widthChunk;

            }

            prevX += canvas.height / this.heightChunk;
            prevY = 0;
        }

        for (let [key, val] of Object.entries(colObject)) {
            // don't include 0's
            if (val.count != 0) val.arr.push(val.count);
            this.gridOptions.cols.push(new Label(val.arr));
        }
        for (let [key, val] of Object.entries(rowObject)) {
            if (val.count != 0) val.arr.push(val.count);
            this.gridOptions.rows.push(new Label(val.arr));
        }

    }

    // determines if a cell is marked or not, it is set up to handle multiple values but currently only uses 1 or 0
    checkColor(pixData) {
        let closest = this.gridOptions.colors.reduce((prev, curr) => {
            return (Math.abs(curr.r - pixData.r) + Math.abs(curr.g - pixData.g) + Math.abs(curr.b - pixData.b) >= Math.abs(prev.r - pixData.r) + Math.abs(prev.g - pixData.g) + Math.abs(prev.b - pixData.b) ? curr : prev);
        })
        let closestIndex = this.gridOptions.colors.indexOf(closest);

        return closestIndex;
    }
}

// END IMAGE READER INFORMATION

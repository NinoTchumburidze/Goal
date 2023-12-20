let gridType = "Medium";
const board = document.getElementById("board");

let startingAmount = 2;
let hasBeenClicked = 0;
let index = 1.5;

//Grid adjustments
let w = 7;
let h = 4;
const board1 = document.getElementById("board1");
const gapSize = 5;
const tiles = document.querySelectorAll("#board1 .tile");
let tilew = 5;


window.onload = function(){
    drawBoard();
    updateGrid();
    betRegulation();
    gridRegulation();
    betButton();

}

function nextColumn(n){
    const arrow =  document.getElementById("arrow");
    arrow.style.display = 'flex';
    arrow.style.left = parseInt(arrow.style.offset) + tilew + "px";

        const selector = `#board1 .tile:nth-child(${w}n + ${n})`;
        const tilesInColumn = document.querySelectorAll(selector);

        let bombindex = Math.floor(Math.random()*h);

        tilesInColumn.forEach((tile, index) => {
             tile.style.backgroundColor = "white";
             
             tile.addEventListener("click", function(){
                
                if(index===bombindex){
                    tile.style.backgroundColor="red";
                }else{
                    nextColumn(n+1);
                }
             });
        });
}


function betButton(){
    document.getElementById("bet").addEventListener("click", function(){
        let n = 1;
        nextColumn(n);
    });
}

function clearBoard(){
    // Clear tiles from board1
    const board1 = document.getElementById("board1");
    while (board1.firstChild) {
        board1.removeChild(board1.firstChild);
    }

    // Clear multipliers from board2
    const board2 = document.getElementById("board2");
    while (board2.firstChild) {
        board2.removeChild(board2.firstChild);
    }
}

function drawBoard(){

    for (let c = 0; c < w; c++) {
        for (let r = 0; r < h; r++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            tile.classList.add("tile");
            document.getElementById("board1").append(tile);
        }

        let multiplier = document.createElement("div");
        multiplier.id ="multiplier-"+ c.toString();
        multiplier.classList.add("multiplier");
        multiplier.innerText = (index*1.25).toFixed(2);
        index = (index*1.25).toFixed(2);
        document.getElementById("board2").append(multiplier);
       
    }
    index = 1.2;
}


function updateGrid() {
    const board2 = document.getElementById("board2");
    const board1 = document.getElementById("board1");
    const totalGapw = (w - 1) * gapSize;
    const totalGaph = (h - 1) * gapSize;
    const tileWidth = (board1.clientWidth - totalGapw) / w;
    const tileHeight = (board1.clientHeight - totalGaph) / h;
    tilew = tileWidth;

    board1.style.gridTemplateColumns = `repeat(${w}, ${tileWidth}px)`;
    board2.style.gridTemplateColumns = `repeat(${w}, ${tileWidth}px)`;

    board2.style.left = board1.offsetLeft+(tileWidth/2-10);

    // Optional: Set the width and height of each tile
    const tiles = document.querySelectorAll("#board1 .tile");
    tiles.forEach(tile => {
        tile.style.width = tileWidth + "px";
        tile.style.height = tileHeight + "px";
    });

   

}



function betRegulation(){
    document.getElementById("circleElement1").addEventListener("click", function() {
        decrease();
    });
    document.getElementById("circleElement2").addEventListener("click", function() {
        increaseAmount(0.1);
    });

    const customAmountInput = document.getElementById("amount");
    customAmountInput.addEventListener("input", function () {
        updateCustomAmount(this.value);
    });
    
    document.getElementById("oneDollar").addEventListener("click", function() {
        increaseAmount(1);
    });
    
    document.getElementById("threeDollars").addEventListener("click", function() {
        increaseAmount(3);
    });
    
    document.getElementById("fiveDollars").addEventListener("click", function() {
        increaseAmount(5);
    });
    
    document.getElementById("tenDollars").addEventListener("click", function() {
        increaseAmount(10);
    });
}

function updateCustomAmount(value) {
    // Parse the input value as a float
    const customAmount = parseFloat(value);

    // Check if the input is a valid number
    if (!isNaN(customAmount)) {
        // Update the startingAmount and display it
        startingAmount = customAmount;
        document.getElementById("amount").innerText = startingAmount.toFixed(2) + '$';
    }
}

function decrease() {
    startingAmount -= 0.1;
    startingAmount = parseFloat(startingAmount.toFixed(2));
    document.getElementById("amount").value = startingAmount.toFixed(2);
}


function increaseAmount(amount) {
    if (amount === 0.1) {
        startingAmount += amount;
        startingAmount = parseFloat(startingAmount.toFixed(2));
        document.getElementById("amount").value = startingAmount.toFixed(2);
        hasBeenClicked = 0.1;
    } else if (hasBeenClicked === amount) {
        startingAmount += amount;
        startingAmount = parseFloat(startingAmount.toFixed(2));
        document.getElementById("amount").value = startingAmount.toFixed(2);
    } else {
        document.getElementById("amount").value = amount.toFixed(2);
        hasBeenClicked = amount;
        startingAmount = amount;
    }
}


function gridRegulation(){
    
    document.getElementById("small").addEventListener("click", function(){
        w = 4;
        h = 3;
        clearBoard();
        drawBoard();
        updateGrid();
    });
    document.getElementById("medium").addEventListener("click", function(){
        w = 7;
        h = 4;
        clearBoard();
        drawBoard();
        updateGrid();
    } );
    document.getElementById("big").addEventListener("click", function(){
        w = 10;
        h = 5;
        clearBoard();
        drawBoard();
        updateGrid();
    } );
}
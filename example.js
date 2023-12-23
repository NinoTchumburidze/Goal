let gridType = "Medium";
const board = document.getElementById("board");

let startingAmount = 2;
let betAmount = 2;
let credit = 9999.00;
let hasBeenClicked = 0;
let index = 1;
let success = false;
let started = false;
let cashedOut = false;

//Grid adjustments
let w = 7;
let h = 4;
const board1 = document.getElementById("board1");
const gapSize = 5;
const tiles = document.querySelectorAll("#board1 .tile");
let tilew = 5;
let tileh = 5;

let clickedOnBomb = false;

window.onload = function(){
    drawBoard();
    updateGrid();
    betRegulation();
    gridRegulation();
    betButton();

}

function nextColumn(n) {
    if(n===w+1){
        credit = credit + parseFloat(startingAmount);
        document.getElementById("money-amount").innerText = credit.toFixed(2)+"$";
        startAgain();
    }

    started = true;
    const arrow = document.getElementById("arrow");
    
    const multiplierElement = document.getElementById(`multiplier-${n-1}`);
    const multiplier = parseFloat(multiplierElement.innerText);

    arrow.style.display = 'flex';
    if (n > 1) {
        arrow.style.left = arrow.offsetLeft + tilew + gapSize + "px";
    }
    const bomb = document.getElementById("bomb");

    // Hide the bomb at the beginning of each column
    bomb.style.display = 'none';

    const selector = `#board1 .tile:nth-child(${w}n + ${n})`;
    const tilesInColumn = document.querySelectorAll(selector);

    let bombindex = Math.floor(Math.random() * h);
    let columnClicked = false;
    
    tilesInColumn.forEach((tile, index) => {
        tile.style.backgroundColor = "white";

        // Adding click event listener with 'once' option
        tile.addEventListener("click", function handler() {
            clickHandler(tile, index);
        }, { once: true });
    });

    function clickHandler(tile, index) {
        // If the user has already made a selection, do nothing
        if (columnClicked) {
            return;
        }

        // Hide the bomb when a tile is clicked
        bomb.style.display = 'none';
        columnClicked = true;

        if (index === bombindex) {
            const tileRect = tile.getBoundingClientRect();

            // Set bomb position to be exactly in the clicked tile
            bomb.style.left = tileRect.left + tilew / 4 + "px";
            bomb.style.top = tileRect.top + tileh / 4 + "px";

            tile.style.backgroundColor = "red";
            bomb.style.display = 'flex';
            clickedOnBomb = true;
            document.getElementById("bet").innerText = "BET";
            success = false;
            startingAmount = betAmount;
        } else {
            clickedOnBomb = false;
            startingAmount = (startingAmount*multiplier).toFixed(2);
            document.getElementById("bet").innerText = "CASHOUT"+"("+startingAmount+")";
            // Move to the next column
            success=true;   
            nextColumn(n + 1);
        }
    }

   
}

function disableButtons() {
    // Disable other buttons or elements as needed
    const otherButtons = document.querySelectorAll("#circleElement1, #circleElement2, #oneDollar, #threeDollars, #fiveDollars, #tenDollars, #small, #medium, #big");

    otherButtons.forEach(button => {
        button.disabled = true;
    });
}

function enableButtons(){
    const otherButtons = document.querySelectorAll("#circleElement1, #circleElement2, #oneDollar, #threeDollars, #fiveDollars, #tenDollars, #small, #medium, #big");

    otherButtons.forEach(button => {
        button.disabled = false;
    });
}
function betButton() {
    const betButtonElement = document.getElementById("bet");

    betButtonElement.addEventListener("click", function () {
        // Check if the game has started
        if (!started) {
            disableButtons()
            started = true;
            credit = credit - parseFloat(startingAmount);
            document.getElementById("money-amount").innerText = credit.toFixed(2)+"$";
            nextColumn(1);
            
            
        }else if(clickedOnBomb){
            enableButtons();
            document.getElementById("money-amount").innerText = credit.toFixed(2) + "$";
            startAgain();
        }else if(success ===true){
            enableButtons();
            credit = credit + parseFloat(startingAmount);
            document.getElementById("money-amount").innerText = credit.toFixed(2) + "$";
            startAgain();
        }

       
       
    });
}

function startAgain(){
    clearBoard();
    drawBoard();
    updateGrid();
    started = false;
    success = false;
    document.getElementById("arrow").style.left = 710 + "px";
    document.getElementById("bet").innerText = 'BET';
    if(clickedOnBomb){
        clickedOnBomb = false;
        credit = credit - parseFloat(startingAmount);
            document.getElementById("money-amount").innerText = credit.toFixed(2)+"$";
        nextColumn(1);
    }
}

function enableButtons(){
    const otherButtons = document.querySelectorAll("#circleElement1, #circleElement2, #oneDollar, #threeDollars, #fiveDollars, #tenDollars, #small, #medium, #big");
   
    otherButtons.forEach(button => {
        button.disabled =false;
    });

}

function disableButtons() {
    // Disable other buttons or elements as needed
    const otherButtons = document.querySelectorAll("#circleElement1, #circleElement2, #oneDollar, #threeDollars, #fiveDollars, #tenDollars, #small, #medium, #big");

    otherButtons.forEach(button => {
          button.disabled = true;    
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
    document.getElementById("arrow").style.display = 'none';
    document.getElementById("bomb").style.display = 'none';
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
    tileh = tileHeight;

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
    betAmount = betAmount -amount;
    betAmount = parseFloat(startingAmount.toFixed(2));
    startingAmount = startingAmount- amount;
    startingAmount = parseFloat(startingAmount.toFixed(2));
    document.getElementById("amount").value = startingAmount.toFixed(2);
}


function increaseAmount(amount) {
    if (amount === 0.1) {
        startingAmount= startingAmount+ amount;
        startingAmount = parseFloat(startingAmount.toFixed(2));
        betAmount = betAmount +amount;
        betAmount = parseFloat(startingAmount.toFixed(2));
        document.getElementById("amount").value = startingAmount.toFixed(2);
        hasBeenClicked = 0.1;
    } else if (hasBeenClicked === amount) {
        startingAmount= startingAmount+ amount;
        startingAmount = parseFloat(startingAmount.toFixed(2));
        betAmount = betAmount + amount;
        betAmount = parseFloat(startingAmount.toFixed(2));
        document.getElementById("amount").value = startingAmount.toFixed(2);
    } else {
        document.getElementById("amount").value = amount.toFixed(2);
        hasBeenClicked = amount;
        startingAmount = amount;
        betAmount = amount;
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
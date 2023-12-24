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
let played = false;


//Grid adjustments
let w = 7;
let h = 4;
const board1 = document.getElementById("board1");
const gapSize = 5;
const tiles = document.querySelectorAll("#board1 .tile");
let tilew = 5;
let tileh = 5;

let clickedOnBomb = false;

let onLossNum = 1;
let onWinNum =1;

//for bet increase and decrease regulation in auto 

let increaseAmountWin = 100;
let decreaseAmountWin = 50;
let increaseAmountLoss = 100;
let decreaseAmountLoss = 50;

let onWinBoard = "base";
let onLossBoard = "base";

//I needed this global variable in auto because user can either choose the tile themselves or let computer decide
//I needed one variable for two separate functions so I decided to make it global
let currColumn = 1;
window.onload = function(){
    drawBoard();
    updateGrid();
    betRegulation();
    gridRegulation();
    betButton();
    Manual();
    Auto();

}

function regulateBetAmount(won){
    if(won){
        if(onWinBoard==="increase"){
            betAmount = parseFloat(betAmount + betAmount*(increaseAmountWin/100));
        }else if (onWinBoard==="decrease"){
            betAmount = parseFloat(betAmount - betAmount*(decreaseAmountWin/100))
        }
    }else{
        if(onLossBoard==="increase"){
            betAmount = parseFloat(betAmount+betAmount*(increaseAmountLoss/100));
        }else if (onLossBoard==="decrease"){
            betAmount = parseFloat(betAmount-betAmount*(decreaseAmountLoss/100))
        }

    }
}
function nextColumnAuto(n) {
    started = true;
    const arrow = document.getElementById("arrow");
    //multiplicators below the columns
    const multiplierElement = document.getElementById(`multiplier-${n - 1}`);
    const multiplier = parseFloat(multiplierElement.innerText);

    //arrow styling:
    arrow.style.display = 'flex';
    if (n > 1) {
        arrow.style.left = arrow.offsetLeft + tilew + gapSize + "px";
    }

    //selecting tiles in a single column
    const selector = `#board1 .tile:nth-child(${w}n + ${n})`;
    const tilesInColumn = document.querySelectorAll(selector);

    currColumn  = n;

    //setting event listeners for each tile in column
    tilesInColumn.forEach((tile, index) => {
        tile.style.backgroundColor = "white";
        tile.addEventListener("click", function () {
            
            //as soon as the game has started we can enable start function(in case user wants to play again)
            document.getElementById("start").disabled = false;
            tile.style.backgroundColor = "black";
            //if the tile is selected, we place flag on it.
            showFlag(tile);
            //starting amount increases
            startingAmount = startingAmount*multiplier;
            //moving to next column
            nextColumnAuto(n + 1);
        }, { once: true });
    });

}

//This function chooses random tile in a column.
//it executes when the user clicks on "select randomly" button

function randomFill(){
    const selector = `#board1 .tile:nth-child(${w}n + ${currColumn})`;
    const tilesInColumn = document.querySelectorAll(selector);
    const randomIndex = Math.floor(Math.random()*h);

    tilesInColumn.forEach((tile, index)=>{
        if(randomIndex===index){
            tile.style.backgroundColor = "black";
            showFlag(tile);
            nextColumnAuto(currColumn+1);
        }
    });
}

//functions for placing flag and bomb on tile
function showFlag(tile) {
    const flag = document.createElement("div");
    flag.classList.add("flag");
    flag.style.display='flex';
    tile.appendChild(flag); // Append the flag to the clicked or randomly chosen tile
}

function showBomb(tile){
    const bomb = document.createElement("div");
    bomb.classList.add("bomb");
    bomb.style.display='flex';
    tile.appendChild(bomb); // Append the flag to the clicked or randomly chosen tile
}
    

function Auto() {
    const autoButton = document.getElementById("auto");

    autoButton.addEventListener("click", function() {
        
        clearBoard();
        drawBoard();
        updateGrid();
       
        drawAuto();
        winLossButtons();
        //automatically starting the game
       nextColumnAuto(1);
       

    });
}
function drawAuto(){
    const board = document.getElementById("board");
    const field = document.getElementById("field-size");
    const betField = document.getElementById("bet-amount");
    const type = document.getElementById("type");
    const betButton = document.getElementById("bet");
    const onWin = document.getElementById("onWin");
    const onLoss = document.getElementById("onLoss");
    const randomly = document.getElementById("randomly");
    const start = document.getElementById("start");

    type.style.left = 145 + "px";
    type.style.top = 50 + "px";

    betField.style.top = (board.offsetHeight - 345 - betField.offsetHeight) + "px";

    field.style.top = (board.offsetHeight - 265 - field.offsetHeight) + "px";
    betButton.style.display = "none";

    onWin.style.display = 'flex';
    onWin.style.top = (board.offsetHeight - 265 - field.offsetHeight + betField.offsetHeight) + "px";
    onLoss.style.top = (board.offsetHeight - 260 - field.offsetHeight + betField.offsetHeight * 2) + "px";
    onLoss.style.display = 'flex';

    randomly.style.display = 'flex';
    start.style.display = 'flex';

    const randomlyButton = document.getElementById("randomly");
    randomlyButton.addEventListener("click",function(){
        randomFill();
        document.getElementById("start").disabled = false;
    });

    //this is start button. it has two function: starting again and putting bombs randomly on map.
    start.addEventListener("click", function(){
        if(!played){
        startfunction();
        }else{
            //starting again
            played = false;
            won = true;
            document.getElementById("arrow").style.left = 710 + "px";
            start.disabled = true;
            clearBoard();
            drawBoard();
            updateGrid();
            enableButtons();
            document.getElementById("randomly").disabled = false;
            startingAmount = betAmount;
            currColumn =1;
            start.innerText = "START";
        }
    });
    start.disabled = true;
    
    
}




function startfunction(){
    //betting
    
        credit = credit - betAmount;
        document.getElementById("money-amount").innerText = credit.toFixed(2) + "$";

    let won = true;

    //choose random location for a bomb in each column.
    for(let i = 1; i <currColumn; i++){
        //selector selects all tiles in one column
        const selector = `#board1 .tile:nth-child(${w}n + ${i})`;
        const tilesInColumn = document.querySelectorAll(selector);

        const randomNum = Math.floor(Math.random()*h);

        tilesInColumn.forEach((tile, index) => {
            if(index === randomNum){
              showBomb(tile);
                
            }
        });

        //find out if bomb and chosen tile are on the same location
        tilesInColumn.forEach((tile, index) => {
            if(index === randomNum && getComputedStyle(tile).backgroundColor === "rgb(0, 0, 0)"){
                won = false;

                const flag = tile.querySelector(".flag");
                flag.remove();
                               
    
                tile.style.backgroundColor = "red";
            }
        });

        const startButton = document.getElementById("start");
        startButton.innerText = "Start Again";

    }

    //I created additional variable for better clarity
    let betAmount1 = betAmount;

    if(won){
        for(let i = 0; i <currColumn; i++){
            const multiplierElement = document.getElementById(`multiplier-${i}`);
            const multiplier = parseFloat(multiplierElement.innerText);
            betAmount1 = betAmount1*multiplier;
        }

        credit = credit + betAmount1;
        document.getElementById("amount").value = betAmount.toFixed(2);
        document.getElementById("money-amount").innerText = credit.toFixed(2) + "$";
    }

    played =true;
    document.getElementById("randomly").disabled = true;
    //increase/decrease bet or return to base
    regulateBetAmount(won);
}




function colorButtonW(button1){
    const otherButtons = document.querySelectorAll("#base, #increase, #decrease");
    otherButtons.forEach(button => {
        button.style.backgroundColor= "white";
    });
    document.getElementById(button1).style.backgroundColor = "rgb(202, 161, 255)";
}

function colorButtonL(button1){
    const otherButtons = document.querySelectorAll("#base1, #increase1, #decrease1");
    otherButtons.forEach(button => {
        button.style.backgroundColor= "white";
    });
    document.getElementById(button1).style.backgroundColor = "rgb(202, 161, 255)";
}
function updateNum(button, string, n){
    button.addEventListener("input", function(){
        updateAmount(this.value, string, n);
    })
}

function updateAmount(value, string, n){
    const customAmount = parseFloat(value);

    // Check if the input is a valid number
    if (!isNaN(customAmount)) {
        // Update the startingAmount and display it

        if(string === "win" && n===1){
            increaseAmountWin = customAmount;
        }else if(string==="win" && n===-1){
            decreaseAmountWin = customAmount;
        }else if(string === "loss" && n===1){
            increaseAmountLoss = customAmount;
        }else if(string === "loss" && n===-1){
            decreaseAmountLoss = customAmount;
        }
    }
}


function winLossButtons(){
    const base1 = document.getElementById("base1");
    const base = document.getElementById("base");
    const increase = document.getElementById("increase");
    const decrease = document.getElementById("decrease");

    const increase1 = document.getElementById("increase1");
    const decrease1 = document.getElementById("decrease1");

    const increaseNum = document.getElementById("increaseNum");
    updateNum(increaseNum, "win", 1);
    const decreaseNum = document.getElementById("decreaseNum");
    updateNum(decreaseNum, "win", -1);
    const increaseNum1 = document.getElementById("increaseNum1");
    updateNum(increaseNum1, "loss", 1);
    const decreaseNum1 = document.getElementById("decreaseNum1");
    updateNum(decreaseNum1, "loss", -1);

    
    base1.addEventListener("click", function(){
        onLossBoard = "base";
        colorButtonL("base1");
    });

    base.addEventListener("click", function(){
        onWinBoard = "base";
        colorButtonW("base");
    });

    increase1.addEventListener("click", function(){
        onLossBoard = "increase";
        colorButtonL("increase1");
    });
    increase.addEventListener("click", function(){
        onWinBoard = "increase";
        colorButtonW("increase");
    });

    decrease.addEventListener("click", function(){
        onWinBoard = "decrease";
        colorButtonW("decrease");
    });

    decrease1.addEventListener("click", function(){
        onLossBoard = "decrease";
        colorButtonL("decrease1");
    });

}

function Manual(){
    const manualButton = document.getElementById("manual");
    const board = document.getElementById("board");
    const field = document.getElementById("field-size");
    const betField = document.getElementById("bet-amount");
    const type = document.getElementById("type");
    

    const onWin = document.getElementById("onWin");
    const onLoss = document.getElementById("onLoss");
    const randomly = document.getElementById("randomly");
    const start = document.getElementById("start");

    manualButton.addEventListener("click", function(){
        clearBoard();

        // Draw the initial board
        drawBoard();
    
        // Update the grid
        updateGrid();
    
        started = false;

        // Reset UI elements
        document.getElementById("bet").innerText = 'BET';
        document.getElementById("arrow").style.left = 710 + "px";
        document.getElementById("money-amount").innerText = credit.toFixed(2) + "$";
    
        // Add event listeners
        const betButtonElement = document.getElementById("bet");
       // betButtonElement.addEventListener("click", betButton);
       
        betButtonElement.style.top =  (board.offsetHeight - (100 + betButton.offsetHeight)) + "px";
        betButtonElement.style.display = 'flex';

        field.style.top = (board.offsetHeight-160 - field.offsetHeight) + "px";
        
        betField.style.top = (board.offsetHeight-240 - betField.offsetHeight) + "px";
        type.style.top = 155 + "px";

        onWin.style.display = "none";
        onLoss.style.display = "none";
        randomly.style.display = "none";
        start.style.display = "none";
    });

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
            showBomb(tile);
            document.getElementById("bet").innerText = "BET";
            success = false;
            startingAmount = betAmount;
        } else {
            tilesInColumn.forEach((tile, index) => {
                if(index===bombindex){
                    showBomb(tile);
                }
            });
            
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
            disableButtons();
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
    enableButtons();
    if(clickedOnBomb){
        clickedOnBomb = false;
        credit = credit - parseFloat(startingAmount);
        document.getElementById("money-amount").innerText = credit.toFixed(2)+"$";
        
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
    currColumn = 1;
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
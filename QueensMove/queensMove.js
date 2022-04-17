var boardSize = [20, 20];
var cellWidth = 640/(boardSize[0]+2);
var queenPos = [Math.ceil(Math.random()*(boardSize[0])), Math.ceil(Math.random()*(boardSize[1]))]
var gameState = "not started";
var phi = 1.618033988749894;
var computerWins = 0;
var playerWins = 0;
var trainingMode = 0; //0 = not training, 1=1-5, 2=6-10, 3=11-15, 4=16, 20
var consecutiveWins = 0;
var img;

function preload() {
    img = loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5wkhyg0yEl-0wKcDvcjTHxWkmNwk0IaYCQ&usqp=CAU');
}
function setup() {
    document.getElementById("startingSpan").innerHTML = "(" + queenPos.toString() + ")";
    var myCanvas = createCanvas(641, 641);
    myCanvas.parent('myContainer');
}
function draw() {
    clear();
    
    image(img, cellWidth*(queenPos[0]+1), cellWidth*(queenPos[1]+1), 30, 30);
    
    strokeWeight(1);
    stroke("black");
    fill("black");
    textSize(20);
    textAlign(CENTER);
    
    for(i = 1; i < boardSize[0]+3; i++){
        line(i*cellWidth, cellWidth, i*cellWidth, 640);
        text((i-1).toString(), (i+0.1)*cellWidth, 0, cellWidth, cellWidth);
    }
    textAlign(RIGHT);
    for(i = 1; i < boardSize[1]+3; i++){
        line(cellWidth, i*cellWidth, 640, i*cellWidth);
        text((i-1).toString(), 0, (i+0.2)*cellWidth, cellWidth, cellWidth);
    }
    
    //ellipse(cellWidth*(queenPos[0]+1.5), cellWidth*(queenPos[1]+1.5), cellWidth-2, cellWidth-2)
}
function mouseReleased(){
    //console.log("--------------");
    var x = Math.floor(mouseX/cellWidth)-1;
    var y = Math.floor(mouseY/cellWidth)-1;
    if(x < 0 || y < 0 || gameState == "computer" || gameState == "challenger"){
        return;
    }
    if((x == queenPos[0] && y < queenPos[1])|| (y == queenPos[1] && x < queenPos[0]) || (y-x == queenPos[1]-queenPos[0] && x < queenPos[0] && y < queenPos[1])){
        if(gameState == "not started"){
            playerGoes(1);
        }
        start = queenPos;
        end = [x, y];
        var historyBox = document.getElementById("historyBox");
        historyBox.innerHTML = historyBox.innerHTML + "<br><span>("+end+")</span>";
        animateQueen();
        if(x == 0 && y == 0){
            gameState = "challenger";
            playerWins++;
            consecutiveWins++;
            setTimeout(gameOver, 1000);
        } else{
            setTimeout(computerMove, 1200);
        }
    }
}
function computerMove(){
    start = queenPos;
    end = calculateMove(queenPos[0], queenPos[1]);
    var historyBox = document.getElementById("historyBox");
    historyBox.innerHTML = historyBox.innerHTML + "<br><span style='color: red'>("+end+")</span>";
    if(end[0] == 0 && end[1] == 0){
        gameState = "computer";
        computerWins++;
        consecutiveWins = 0;
        setTimeout(gameOver, 1000);
    }
    animateQueen();
}
function calculateMove(x_input, y_input){
    var possMoves = [];
    if(checkLost([x_input, y_input])){
        possMoves = [[x_input-1, y_input], [x_input, y_input-1], [x_input-1, y_input-1]]
        return possMoves[Math.floor(Math.random()*possMoves.length)];
    } else{
        var x = x_input;
        var y = y_input;
        if(y < x){
            x = y_input;
            y = x_input
        }

        if(!(Math.floor(phi*Math.abs(x-y)) > x) && !(Math.floor(phi*phi*Math.abs(x-y)) > y)){
            possMoves.push([Math.floor(phi*Math.abs(x-y)), Math.floor(phi*phi*Math.abs(x-y))])
        }

        if(checkLost([x, Math.ceil(x*phi)])){
            if(!(Math.ceil(x*phi) > y)){
                possMoves.push([x, Math.ceil(x*phi)]);
            }
        } else if(checkLost([x, Math.floor(x/phi)])){
            possMoves.push([x, Math.floor(x/phi)]);
        }

        if(checkLost([Math.floor(y/phi)])) {
            if(!(Math.floor(phi*Math.abs(x-y)) > x) && !(Math.floor(phi*phi*Math.abs(x-y)) > y)){
                possMoves.push([Math.floor(y/phi)]);
            }
        }
        if(y_input > x_input){
            return possMoves[Math.floor(Math.random()*possMoves.length)];
        } else{
            var choice  = Math.floor(Math.random()*possMoves.length);
            return [possMoves[choice][1], possMoves[choice][0]];
        }
    }
}
function checkLost(position){
    // this is the issue
    if(position[0] > position[1]){
        position = [position[1], position[0]];
    }
    var difference = position[1]-position[0];
    if(position[0] == Math.floor(phi*difference) && position[1] == Math.floor(phi*phi*difference)){
        return true
    } else{
        return false
    }
}
var start = [];
var end = [];
function animateQueen(){
    var xStep = (start[0] - end[0])/200;
    var yStep = (start[1] - end[1])/200;
    queenPos = [queenPos[0]-xStep, queenPos[1]-yStep];
    if((queenPos[0]-end[0])*(queenPos[0]-end[0]) + (queenPos[1]-end[1])*(queenPos[1]-end[1]) > 0.1){
        setTimeout(animateQueen, 3);
    } else{
        queenPos = end;
        start = [];
        end = [];
        if(gameState == "computer" || gameState == "challenger"){
            if(trainingMode == 0 || consecutiveWins < 2 || trainingMode*5 >= boardSize[0]){
                alert("The " + gameState + " won!");
            } else if(consecutiveWins >= 2){
                alert("The challenger won, and levels up to the next stage of training!")
                consecutiveWins = 0;
                trainingMode++;
            }
        }
    }
}
function gameOver(){
    document.getElementById("computerScore").innerHTML = computerWins;
    document.getElementById("yourScore").innerHTML = playerWins;
    var again = document.getElementById("againButton").style;
    again.color = "black";
    again.backgroundColor = "white";
    var resign = document.getElementById("resignButton").style;
    resign.color = "gray";
    resign.backgroundColor = "lightgray";
}
function playerGoes(when){
    gameState = "in progress";
    document.getElementById("firstSecond").style.visibility = "hidden";
    document.getElementById("buttonHolder").style.visibility = "visible";
    if(when == 2){
        computerMove();
    }
}
function newGame(){
    if(gameState != "in progress"){
        if(5*trainingMode <= boardSize[0] && trainingMode != 0){
            var tempPos = [Math.ceil(Math.random()*5)+trainingMode*5-5, Math.ceil(Math.random()*5*trainingMode)]
            if(Math.random() > 0.5){
                tempPos.reverse();
            }
            queenPos = tempPos;
        } else{
            queenPos = [Math.ceil(Math.random()*(boardSize[0])), Math.ceil(Math.random()*(boardSize[1]))];
        } 
        gameState = "not started";
        document.getElementById("firstSecond").style.visibility = "visible";
        document.getElementById("buttonHolder").style.visibility = "hidden";
        var again = document.getElementById("againButton").style;
        again.color = "gray";
        again.backgroundColor = "lightgray";
        var resign = document.getElementById("resignButton").style;
        resign.color = "black";
        resign.backgroundColor = "white";
        document.getElementById("historyBox").innerHTML = 'Starting Position: ('+queenPos+')';
    }
}
function resign(){
    if(gameState == "in progress"){
        gameState = "computer";
        computerWins++;
        gameOver();
    }
}
function startTraining(){
    playerWins = 0;
    computerWins = 0;
    document.getElementById("computerScore").innerHTML = computerWins;
    document.getElementById("yourScore").innerHTML = playerWins;
    if(trainingMode == 0){
        trainingMode = 1;
        document.getElementById("trainingButton").innerHTML = "Leave Training";
    } else{
        trainingMode = 0;
        document.getElementById("trainingButton").innerHTML = "Training Mode";
    }
    newGame();
}
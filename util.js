
//Grouper UTILITY File
//Here are all the functions used in the main grouper file





//create queue function
function createQueue(singles){
    var queue = [];
    if(singles) var queueLen = 15;
    else var queueLen = 3;
    

    for (var i = 0; i<queueLen;i++){
        if (singles){
            var party = new Party("#000000", 1, true);
        }else{
            var party = new Party(randomCssRgba(), randomNumber(2, 9), false);
        }
        for(var j = 0; j < party.size;j++){
            queue.push(party);
        }
        
    }
    return queue;
}

//create queue of singles
function createSinglesQueue(){
    var queue = [];
    var queueLen = 10;
    for (var i = 0; i<queueLen;i++){
        var party = new Party("#000000", 1);
        for(var j = 0; j < party.size;j++){
            queue.push(party);
        }
        
    }
    return queue;
}



//function to draw the queue
function drawQueue (queue, x, y){
    var dx = x;
    var dy = y;
    
    var width = 25;
    //id variable to keep track of different parties
    var id = queue[0]?.partyId;
    for (var i = 0; i<queue.length;i++){
        var curId = queue[i].partyId;
        //if current id is eq to id, theyre in the same party
        if(id == curId){
            dx += 55;
        }else{
            //different party add spacing and update new id for new party
            dx += 75;
            id = curId;
        }
        queue[i].update(dx, dy, width);
    }
}

//returns a new empty array representing a new rv
function createNewRV(){
    let arr = [];
    let rows = 6;
    let seats = 4;

    let value = 0;

    for (var i = 0; i < rows; i++){
        arr[i] = [];
        for(var j = 0; j < seats;j++){
            arr[i][j] = value;
        }
    }

    return arr;

}

//function draws the structure of the rv
function drawRv(x, y){
    var rvX = x;
    var rvY = y;
    var rvWidth = 450;
    var rvHeight = 600;

    var rowX = x+50;
    var rowY = y+50;

    var numX = x + 435;
    var numY = y + 57;

    c.beginPath();
    c.strokeStyle = "#00ADB5"
    c.fillStyle = "#393E46"
    c.roundRect(rvX, rvY, rvWidth, rvHeight, 10);
    c.fill();
    c.stroke();

    for (var i=0;i<6;i++){
        drawRow(rowX, rowY);
        drawNumber(i+1, numX, numY);
        numY +=90;
        rowY+=90;
    }
}

//this draws a single row of the rv
function drawRow(dx, dy){
    c.lineWidth = 5;
    c.strokeStyle = '#EEEEEE'
    
    for(var i = 0; i<4;i++){
        var seatW = 50;
        var seatH = 50;
        c.beginPath();
        c.roundRect(dx, dy, seatW, seatH, 5);
        c.stroke()
        dx+=100;
    }
}


//function to check btn when asked 'choose amount of guests'
function checkAmountBtn(butNum, partySize){
    if (butNum > partySize){
        document.querySelector(".btn"+butNum).style.border = 'solid red';
        setTimeout(() => {
        document.querySelector(".btn"+butNum).style.border = 'none';   
        }, 500);
        return false;
    }else{
        document.querySelector('#numGuests').style.display = 'none';
        document.querySelector('#selectRow').style.display = 'flex';
        document.querySelector('.numGuests').innerHTML = butNum;
        
        return true;
    }
}

//this checks if theres enough space in the row for users order
function checkValidRow(rowNum, guestNum, rv){
    var emptySeats = checkRowEmpties(rowNum, rv);
    console.log(emptySeats+" empty seats in row "+rowNum)

    if (emptySeats < guestNum){
        document.querySelector(".row"+rowNum).style.border = "solid red";
        setTimeout(() => {
            document.querySelector(".row"+rowNum).style.border = 'none';   
        }, 500);
        return false;
    }else{
        document.querySelector('#selectRow').style.display = 'none';
        document.querySelector('#numGuests').style.display = 'flex';
        
        return true;
    }
}


//function to check all available seats in a row
//rows are seated from left to right, so if index 1 is taken, that means index 2 and 3 are empty
function checkRowEmpties(rowNum, rv){
    var emptySeats = 0;
    for(var i = 0; i < 4; i++){
        if(rv[rowNum-1][i] == 0){
            emptySeats = 4-i;
            break;
        }
    }
    return emptySeats;
}


//this function moves guests from queue into appropriate seats based on the users order
function moveGuests(rowNum, guestNum, rv, queue){
    //so that rowNum matches index of array 
    rowNum = rowNum-1;

    // console.log('Moving '+ guestNum +' to row' + rowNum+".")

    //update position for however many guest user chose
    for(var i = 0; i < guestNum ; i++){
        //initialize the position of the seats and the gaps between
        var rowx = 125;
        var rowy = 225;
        var seatGap = 100;
        var rowGap = 90;
        //get empty seat number in row
        for(var j = 0; j < 4;j++){
            if(rv[rowNum][j] == 0){
                var seatNum = j;
                break;
            }
        }

        //new position to draw guest
        rowx = rowx + (seatGap*seatNum);
        
        rowy = rowy + (rowGap*rowNum);
    
        var nextGuest = queue[0];
        
        //set array element to 1 to show seat is now taken 
        rv[rowNum][seatNum] = nextGuest;

        //this clears the canvas and moves queue along
        moveQueue(queue);

        //need to draw existing rv with guests inside
        drawRvGuests(rv);

        //update the position of first guest in line
        nextGuest.update(rowx, rowy);

        
        
    }    

    if(queue[0].size>1){
        //new guest
        var party = new Party(randomCssRgba(), randomNumber(2, 5));
        for(var j = 0; j < party.size;j++){
            queue.push(party);
        }
    } else{
        var party = new Party("#000000", 1);
        queue.push(party);
    }
    
}

//fuction to move queue forward and remove first guest in line 
function moveQueue(queue){
    queue.shift();
    c.clearRect(0, 0, canW, canH);
    drawQueue(queue);
    drawRv(rvX, rvY);
}


//this function reads the array and draws the existing guests onto their seats
function drawRvGuests(rv,  x, y){
    var row1x = x+75;
    var row1y = y+75;
    var seatGap = 100;
    var rowGap = 90;
    var width = 20

    for (var i = 0; i<6; i++){
        for(var j = 0;j<4;j++){
            //if row == 0 it's empty, otherwise draw guest
            if(rv[i][j] != 0){
                var guest = rv[i][j];
                guest.update(row1x+(seatGap*j), row1y+(rowGap*i), width)
            }
        }
    }
}

function drawNumber(number, x, y){
    c.lineWidth = 3
    c.beginPath();
    c.fillStyle = "#393E46";
    c.strokeStyle = "#00ADB5";
    c.roundRect(x, y, 30, 40, 5);
    c.fill();
    c.stroke();
    c.fillStyle = '#ffffff';
    c.font = "20px sans-serif"
    c.fillText(number,x + 10, y + 25);
}

//function to disoatch  RV
// function sendRv(){
//     console.log("send rv!")
//     while (rvY > -650){
//             console.log(rvY)
//             rvY -= 1;
//             c.clearRect(0,0, canW, canH)
//             drawQueue(queue);
//             drawRv(rvX, rvY);
//     }
// }

//this gives you total emoties in rv
function totalEmpties(rv){
    var empties = 0;
    for(var i = 0; i < 6; i++){
        empties += checkRowEmpties(i+1, rv);
    }

    return empties;
}

function restartGame(){
    console.log('start application.')
    c.clearRect(0,0,canW, canH);
    document.querySelector('.grouperPanel').style.display = 'flex';
    document.querySelector('.welcomeScreen').style.display = 'none';
    document.querySelector('.gameOverScreen').style.display = 'none';
    document.querySelector('#numGuests').style.display = 'flex';
    document.querySelector('.counterPanel').style.display = 'flex';

    //initialize game
    init();

    //call function to start game
    animate();
}

//fcuntion to exit game
function exitGame(){
    console.log('exit click')
    document.querySelector('.welcomeScreen').style.display = 'flex';
    document.querySelector('#numGuests').style.display = 'none';
    document.querySelector('#selectRow').style.display = 'none';
    document.querySelector('.grouperPanel').style.display = 'none';
    document.querySelector('.counterPanel').style.display = 'none';
    c.clearRect(0, 0, canW, canH);
    exit = true;
}

//function to have next party inline wait, and swap positions with the party behind them
function wait(queue){
    console.log(queue);
    var i = 0;
    var firstPoint = 0;
    var secondPoint;
    var size;

    
    var loop = true;
    while(loop){
        i++;
        var firstParty = queue[0].partyId;
        var tempParty = queue[i].partyId;
        if(tempParty != firstParty){
            secondPoint = i
            loop = false;
        }
    }

    console.log("first party size: "+queue[firstPoint].size)

    
    size = queue[secondPoint].size
    

    console.log("size: "+size)

    for(var j = 0;j < size; j++){
        console.log("switching index "+firstPoint+" with index "+secondPoint)
        var temp = queue[firstPoint]
        queue[firstPoint] = queue[secondPoint];
        queue[secondPoint] = temp;
        firstPoint++;
        secondPoint++;
    }

    c.clearRect(0, 0, canW, canH);
    //draw the queue to the canvas
    drawQueue(queue, lineX, frontLineY);
    drawQueue(singles, lineX, frontLineY - 100);


    //draw the rv graphic to the canvas
    drawRv(rvX, rvY);
    drawRv(rvX, rvY2);

    leftToGroup = size
    console.log("left to group: "+leftToGroup)

    drawRvGuests(rv, rvX, rvY);
    console.log(queue);
}

function checkSeperated(rv){
    var sep = 0;

    for(var i = 0; i < 6;i++){
        for(var j = 0; j < 4; j++){
            var curGuest = rv[i][j]
            if(curGuest.single || curGuest == undefined) break;
            if(j == 0){
                var nextGuest = rv[i][j+1]

                if(curGuest.partyId != nextGuest.partyId){
                    sep++;
                }
            }else if(j == 3){
                var prevGuest = rv[i][j-1]
                if(curGuest.partyId != prevGuest.partyId){
                    sep++;
                }
            }else{
                var nextGuest = rv[i][j+1]
                var prevGuest = rv[i][j-1]

                if((curGuest.partyId != nextGuest.partyId) && (curGuest.partyId != prevGuest.partyId)){
                    sep++
                }
            }
        }
    }

    return sep;
}

function pressSound(){
    var btnSound = new Audio("./audio/pressedBtn.mp3")
    btnSound.play();
}

function hoverSound(){
    var sound = new Audio("./audio/menuSelect.mp3");
    sound.volume = .2;
    sound.play();
}

function wrongSound(){
    var sound = new Audio("./audio/wrong.mp3");
    sound.volume = .5;
    sound.play();
}

function sendSound(){
    var sound = new Audio("./audio/score.mp3");
    sound.volume = .5;
    sound.play();
}
function bubbleSound(){
    var sound = new Audio("./audio/bubble.mp3");
    sound.volume = .5;
    sound.play();
}
function switchSound(){
    var sound = new Audio("./audio/switch.mp3");
    sound.volume = .5;
    sound.play();
}
function clickSound(){
    var sound = new Audio("./audio/click.mp3");
    sound.volume = .5;
    sound.play();
}
function singleSound(){
    var sound = new Audio("./audio/single.mp3");
    sound.volume = .5;
    sound.play();
}

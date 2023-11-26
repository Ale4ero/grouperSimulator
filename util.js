
//Grouper UTILITY File
//Here are all the functions used in the main grouper file



//create queue function
function createQueue(){
    var queue = [];
    var queueLen = 8;

    for (var i = 0; i<queueLen;i++){
        var party = new Party(20, randomCssRgba(), randomNumber(1, 5));
        for(var j = 0; j < party.size;j++){
            queue.push(party);
        }
        
    }
    return queue;
}

//function to draw the queue
function drawQueue (queue){
    var dy = frontLineY;
    var dx = lineX;
    for (var i = 0; i<queue.length;i++){
        queue[i].update(dx, dy);
        //if queue is at the top of page, start drawing to the right using dx
        if (i < 4) dy-=45;  
        else dx += 45;
  
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
function drawRv(){
    var dx = 50;
    var dy = 130;
    for (var i=0;i<6;i++){
        drawRow(dx, dy);
        dy+=110;
        if(i == 5){
            c.lineWidth = 5;
            c.beginPath();
            c.moveTo(0, dy-30);
            c.lineTo(450, dy-30);
            c.strokeStyle = '#EEEEEE'
            c.stroke();
        }
    }
}

//this draws a single row of the rv
function drawRow(dx, dy){
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, dy-30);
    c.lineTo(450, dy-30);
    c.strokeStyle = '#EEEEEE'
    c.stroke();
    for(var i = 0; i<4;i++){
        c.rect(dx, dy, 50, 50);
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
        var rowx = 75;
        var rowy = 155;
        var seatGap = 100;
        //get empty seat number in row
        for(var j = 0; j < 4;j++){
            if(rv[rowNum][j] == 0){
                var seatNum = j;
                break;
            }
        }

        //new position to draw guest
        rowx = rowx + (seatGap*seatNum);
        console.log('Moving: 75 + 150*'+seatNum);
        rowy = rowy + (110*rowNum);
        console.log('Moving: 75 + 110*'+rowNum);
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

    console.log(rv);
    
}

//fuction to move queue forward and remove first guest in line 
function moveQueue(queue){
    queue.shift();
    c.clearRect(0, 0, canW, canH);
    drawQueue(queue);
    drawRv();
}


//this function reads the array and draws the existing guests onto their seats
function drawRvGuests(rv){
    var row1x = 75;
    var row1y = 155;
    var seatGap = 100;
    var rowGap = 110;

    for (var i = 0; i<6; i++){
        for(var j = 0;j<4;j++){
            //if row == 0 it's empty, otherwise draw guest
            if(rv[i][j] != 0){
                var guest = rv[i][j];
                guest.update(row1x+(seatGap*j), row1y+(rowGap*i))
            }
        }
    }
}

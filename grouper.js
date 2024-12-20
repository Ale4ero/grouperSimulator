//canvas variables
var canvas = document.querySelector('canvas');
var guestScreen = document.querySelector('#numGuests');
var rowScreen = document.querySelector('#selectRow');
var overScreen = document.querySelector('.gameOverScreen');

//get width and height of window
var canW = window.innerWidth;
var canH = window.innerHeight;

//set width and height of canvas
canvas.width = canW;
canvas.height = canH;


//get context
var c = canvas.getContext('2d');

//random functions
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255);
const randomPercent = () => (randomNumber(95, 100) * 0.01).toFixed(2);
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`;

//resize canvas when window gets resized
window.addEventListener('resize', ()=>{
    canW = window.innerWidth;
    canH = window.innerHeight; 
    canvas.width = canW;
    canvas.height = canH;

    frontLineY = canH/2 - 100;
    lineX = canW/2;
 })




//GLOBAL variables
var frontLineY = canH/2 - 100;
var lineX = canW/2;
var guestNum;
var rowNum;
var queue;
var singles;
var singleGuest;
var rv;
var partySize;
var leftToGroup;
var moveRv = false;
var exit = false;
var moveRv
var rvX;
var rvY;
var rvY2;
var partyId = 0;
var askGuests;
var askRow;


//counter panel
var time = 60;
var min;
var sec;
var dispatches;
var empties;
var seperated;


//audio




//party object 
function Party(color, size, single){

    // this.width = width;
    this.color = color;
    this.size = size;
    this.partyId = partyId++;
    this.single = single;


    this.draw = (x, y, width)=>{
        c.beginPath();
        c.fillStyle = "#EEEEEE";
        c.arc(x, y, width, 0, Math.PI*2)
        c.fill();
        c.beginPath();
        c.fillStyle = this.color;
        c.roundRect(x-13, y+8, 26, 5, 2);
        c.fill();
        c.fillStyle = '#000000';
        c.font = "bold 25px sans-serif";
        c.fillText(this.size, x-7, y+5);
    }  

    this.update = (x, y, width)=>{  
        this.draw(x, y, width);     
    }    
}




//function that initializes the app
function init(){
    //x value of where the RV is drawn on the screen
    rvX = 50;
    //y value for point on screen where RV is drawn
    rvY = 150;
    //v value for second rv waiting behind it(only for visuals does not get loaded)
    rvY2 = canH - 100; 
    exit = false;
    moveRv = false;
    singleGuest = false;
    askGuests = false;
    askRow = false;
    leftToGroup = 0;

    //counter panel
    time = 0;
    min = 0;
    sec = 0;
    dispatches = 0;
    empties = 0;
    seperated = 0;

    //once game is started create the queue and store it 
    queue = createQueue(false);
    singles = createQueue(true);

    console.log(queue);

    //create a 2d array representing our rv
    rv = createNewRV();
    console.log(rv);

    drawQueue(queue, lineX,frontLineY);
    drawQueue(singles, lineX, frontLineY - 100);
    

    //draw the rv graphic to the canvas
    drawRv(rvX, rvY);
    drawRv(rvX, rvY2);

    drawRvGuests(rv, rvX, rvY);

    window.addEventListener('resize', ()=>{
        drawQueue(queue, lineX,frontLineY);
        drawQueue(singles, lineX, frontLineY - 100);
        
        drawRv(rvX, rvY);
        drawRv(rvX, rvY2);

        drawRvGuests(rv, rvX, rvY);
    })
}


//main animate function
function animate(){

    if(exit) return;

    requestAnimationFrame(animate);

    
    
    
    

    //display the party size to the user based on the next guest in the queue
    document.querySelector('.partyNum').innerHTML = queue[0]?.size;

    //display time
    if(sec < 10){
        document.querySelector('.timeText').innerHTML = min+":0"+sec;       
    }else{
        document.querySelector('.timeText').innerHTML = min+":"+sec;
    }
    

    //score board top of screen 
    document.querySelector('.dispText').innerHTML = dispatches;
    document.querySelector('.emptText').innerHTML = empties;
    document.querySelector('.sepText').innerHTML = seperated;

        
    //to end the game
    if(dispatches == 3){
        document.querySelector('#numGuests').style.display = 'none';
        document.querySelector('#selectRow').style.display = 'none';
        document.querySelector('.grouperPanel').style.display = 'none';
        document.querySelector('.counterPanel').style.display = 'none';
        overScreen.style.display = 'flex';
        c.clearRect(0, 0, canW, canH);
        exit = true;

        document.querySelector(".dispOver").innerHTML = dispatches;
        document.querySelector(".emptOver").innerHTML = empties;
        document.querySelector(".sepOver").innerHTML = seperated;
        if(sec < 10){
            document.querySelector('.timeOver').innerHTML = min+":0"+sec;       
        }else{
            document.querySelector('.timeOver').innerHTML = min+":"+sec;
        }
    }
    

    
    //size of the next party in line
    partySize = queue[0]?.size;

    if(leftToGroup == 0){
        leftToGroup = partySize;
        console.log("Left to group: "+leftToGroup)
    }


    

    //when user picks the order move guests
    if(guestNum != undefined && rowNum != undefined){
        //move guests into users input, then reset input
        if (singleGuest){
            moveGuests(rowNum, guestNum, rv, singles);
        }else{
            moveGuests(rowNum, guestNum, rv, queue);
            leftToGroup -= guestNum;
        }
        

        //draw the queue to the canvas
        drawQueue(queue, lineX, frontLineY);
        drawQueue(singles, lineX, frontLineY - 100);


        //draw the rv graphic to the canvas
        drawRv(rvX, rvY);
        drawRv(rvX, rvY2);

        drawRvGuests(rv, rvX, rvY);

        //only reset guestNum if not single
        if(!singleGuest){
            guestNum = undefined;
            singleGuest = false;
        } 
        rowNum = undefined;
        
        
        console.log("Left to group: "+leftToGroup)
    }

    //move send button, move rv
    if (moveRv){
        //move rv in station
        if(rvY > -700){
            console.log("move")
            rvY -= 15; 
        }
        //move next rv
        if (rvY2 > 160){
            rvY2 -= 10;
            drawRv(rvX, rvY2);
        }else{
            
            moveRv = false;
            rv = createNewRV()
            rvX = 50;
            rvY = 150;
            rvY2 = canH - 100;
            // init();
        }
        c.clearRect(0,0, canW, canH)
        drawQueue(queue, lineX, frontLineY);
        drawQueue(singles, lineX, frontLineY - 100);
        drawRv(rvX, rvY);
        drawRv(rvX, rvY2);
        drawRvGuests(rv, rvX, rvY);
    }

    //if game over

   
}


//EXIT button
document.querySelector(".exitBtn").addEventListener('click', ()=>{
    exitGame();
    pressSound();
})



//START button game starts
document.querySelector("#startBtn").addEventListener('click', ()=>{
    restartGame();
    pressSound();
})





//buttons to pick amount of guests in order 
document.querySelector(".btn1").addEventListener('click', ()=>{
    if (checkAmountBtn(1, leftToGroup)){
        guestNum = 1;
        clickSound();
    }else{
        wrongSound();
    }
    
})



document.querySelector(".btn2").addEventListener('click', ()=>{
    if (checkAmountBtn(2, leftToGroup)){
        guestNum = 2;
        clickSound();
    }else{
        wrongSound();
    }
    
})


document.querySelector(".btn3").addEventListener('click', ()=>{
    if (checkAmountBtn(3, leftToGroup)){
        guestNum = 3;
        clickSound();
    }else{
        wrongSound();
    }
    
})


document.querySelector(".btn4").addEventListener('click', ()=>{
    if (checkAmountBtn(4, leftToGroup)){
        guestNum = 4;
        clickSound();
    }else{
        wrongSound();
    }
    
})





//buttons to pick row
document.querySelector(".row1").addEventListener('click', ()=>{
    if (checkValidRow(1, guestNum, rv)){
        rowNum = 1;
        clickSound();
        
    }else{
        wrongSound();
    }
    
})
document.querySelector(".row2").addEventListener('click', ()=>{
    if (checkValidRow(2, guestNum, rv)){
        rowNum = 2;
        clickSound();
    }else{
        wrongSound();
    }
    
})
document.querySelector(".row3").addEventListener('click', ()=>{
    if (checkValidRow(3, guestNum, rv)){
        rowNum = 3;
        clickSound();   
    }else{
        wrongSound();
    }
})
document.querySelector(".row4").addEventListener('click', ()=>{
    if (checkValidRow(4, guestNum, rv)){
        rowNum = 4;
        clickSound();
    }else{
        wrongSound();
    }
    
})
document.querySelector(".row5").addEventListener('click', ()=>{
    if (checkValidRow(5, guestNum, rv)){
        rowNum = 5
        clickSound();
    }else{
        wrongSound();
    }
    
})
document.querySelector(".row6").addEventListener('click', ()=>{
    if (checkValidRow(6, guestNum, rv)){
        rowNum = 6;
        clickSound();
    }else{
        wrongSound();
    }
    
})

document.querySelector(".singleBtn").addEventListener('click', ()=>{
    guestNum = 1;
    document.querySelector('#numGuests').style.display = 'none';
    document.querySelector('#selectRow').style.display = 'flex';
    singleGuest = true;
    singleSound();
})

document.querySelector(".waitBtn").addEventListener('click', ()=>{
    wait(queue);
    
    switchSound();
})



//button tp send RV
document.querySelector(".sendBtn").addEventListener('click', ()=>{
    moveRv = true;
    dispatches++;
    empties += totalEmpties(rv);
    sendSound();
    seperated += checkSeperated(rv)
    console.log("left to group: "+leftToGroup)
    console.log(rv);
})
// document.querySelector(".sendBtn").addEventListener('mouseover', ()=>{
//     hoverSound();
// })


//button to go back to select num guests
document.querySelector(".backBtn").addEventListener('click', ()=>{
    document.querySelector('#numGuests').style.display = 'flex';
    document.querySelector('#selectRow').style.display = 'none';
    singleGuest = false;
    pressSound();
})


document.querySelector(".rstBtn").addEventListener('click', ()=>{
    restartGame();
    pressSound();
})

document.querySelector(".gameOvrExitBtn").addEventListener('click', ()=>{
    document.querySelector(".gameOverScreen").style.display = "none";
    document.querySelector(".welcomeScreen").style.display = "flex";
    pressSound();
})
// document.querySelector(".gameOvrExitBtn").addEventListener('mouseover', ()=>{
//     hoverSound();
// })





setInterval(()=>{
    if(sec == 60){
        min++;
        sec = 0;
    }
    sec++;
}, 1000)

// setInterval(()=>{
//     if(sec == 0){
//         min--;
//         sec = 60;
//     }
//     sec--;
//     time--;
// }, 1000)


// document.addEventListener('keyup', handleKeyInput);


document.addEventListener('keydown', (event)=>{
    const {key} = event;
    var input = undefined;

    if(guestScreen.style.display == 'flex'){
        console.log("choose guests")
        switch (key){
            case '1':{
                input = 1
                break;
            } 
            case '2':{
                input = 2;
                break;
            }
            case '3':{
                input = 3;
                break;
            }
            case '4':{
                input = 4;
                break;
            }
            case 's':{
                input = 's';
                break;
            }
            
    
        }
    
        if(input){
            if(input == 's'){
                guestNum = 1;
                document.querySelector('#numGuests').style.display = 'none';
                document.querySelector('#selectRow').style.display = 'flex';
                singleGuest = true;
                singleSound();
            }else{

                if (checkAmountBtn(input, leftToGroup)){
                    guestNum = input;
                    pressSound();
                }else{
                    wrongSound();
                }
            }
            
        }
    }

    else if(rowScreen.style.display == 'flex'){
        switch (key){
            case '1':{
                input = 1
                break;
            } 
            case '2':{
                input = 2;
                break;
            }
            case '3':{
                input = 3;
                break;
            }
            case '4':{
                input = 4;
                break;
            }
            case '5':{
                input = 5;
                break;
            }
            case '6':{
                input = 6;
                break;
            }
            
    
        }
    
        if(input){
            if (checkValidRow(input, guestNum, rv)){
                rowNum = input;
                pressSound();
            }else{
                wrongSound();
            }
        }
    }
    
    
});


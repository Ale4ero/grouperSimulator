//canvas variable 
var canvas = document.querySelector('canvas');

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
 })




//GLOBAL variables
const frontLineY = canH/2 - 100;
const lineX = canW/2;
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
var startTime;






//party object 
function Party(color, size){

    // this.width = width;
    this.color = color;
    this.size = size;
    this.partyId = partyId++;


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
    rvX = 50;
    rvY = 150;
    rvY2 = canH - 100; 
    exit = false;
    moveRv = false;
    singleGuest = false;
    startTime = 60;

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
}


//main animate function
function animate(){

    if(exit) return;

    requestAnimationFrame(animate);

    

    
    

    //display the party size to the user based on the next guest in the queue
    document.querySelector('.partyNum').innerHTML = queue[0]?.size;

    //display time
    document.querySelector('.timeText').innerHTML = startTime+':00';

        
    if(startTime < 0){
        document.querySelector('.welcomeScreen').style.display = 'flex';
        document.querySelector('#numGuests').style.display = 'none';
        document.querySelector('#selectRow').style.display = 'none';
        document.querySelector('.grouperPanel').style.display = 'none';
        document.querySelector('.counterPanel').style.display = 'none';
        c.clearRect(0, 0, canW, canH);
        exit = true;
    }
    

    
    //size of the next party in line
    partySize = queue[0]?.size;


    //when user picks the order move guests
    if(guestNum != undefined && rowNum != undefined){
        //move guests into users input, then reset input
        if (singleGuest){
            moveGuests(rowNum, guestNum, rv, singles);
        }else{
            moveGuests(rowNum, guestNum, rv, queue);
        }
        

        //draw the queue to the canvas
        drawQueue(queue, lineX, frontLineY);
        drawQueue(singles, lineX, frontLineY - 100);


        //draw the rv graphic to the canvas
        drawRv(rvX, rvY);
        drawRv(rvX, rvY2);

        drawRvGuests(rv, rvX, rvY);


        guestNum = undefined;
        rowNum = undefined;
        singleGuest = false;
    }

    //move send button, move rv
    if (moveRv){
        //move rv in station
        if(rvY > -700){
            console.log("move")
            rvY -= 10;
            
        }
        //move next rv
        if (rvY2 > 160){
            rvY2 -= 6;
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
   
}


//EXIT button
document.querySelector(".exitBtn").addEventListener('click', ()=>{
    console.log('exit click')
    document.querySelector('.welcomeScreen').style.display = 'flex';
    document.querySelector('#numGuests').style.display = 'none';
    document.querySelector('#selectRow').style.display = 'none';
    document.querySelector('.grouperPanel').style.display = 'none';
    document.querySelector('.counterPanel').style.display = 'none';
    c.clearRect(0, 0, canW, canH);
    exit = true;
})


//START button game starts
document.querySelector("#startBtn").addEventListener('click', ()=>{
    console.log('start application.')
    document.querySelector('.grouperPanel').style.display = 'flex';
    document.querySelector('.welcomeScreen').style.display = 'none';
    document.querySelector('#numGuests').style.display = 'flex';
    document.querySelector('.counterPanel').style.display = 'flex';

    //initialize game
    init();

    //call function to start game
    animate();

})



//buttons to pick amount of guests in order 
document.querySelector(".btn1").addEventListener('click', ()=>{
    if (checkAmountBtn(1, partySize)){
        guestNum = 1;
    }
})

document.querySelector(".btn2").addEventListener('click', ()=>{
    if (checkAmountBtn(2, partySize)){
        guestNum = 2;
    }
})

document.querySelector(".btn3").addEventListener('click', ()=>{
    if (checkAmountBtn(3, partySize)){
        guestNum = 3;
    }
})

document.querySelector(".btn4").addEventListener('click', ()=>{
    if (checkAmountBtn(4, partySize)){
        guestNum = 4;
    }
})




//buttons to pick row
document.querySelector(".row1").addEventListener('click', ()=>{
    if (checkValidRow(1, guestNum, rv)){
        rowNum = 1;
    }
})
document.querySelector(".row2").addEventListener('click', ()=>{
    if (checkValidRow(2, guestNum, rv)){
        rowNum = 2;
    }
})
document.querySelector(".row3").addEventListener('click', ()=>{
    if (checkValidRow(3, guestNum, rv)){
        rowNum = 3;
    }
})
document.querySelector(".row4").addEventListener('click', ()=>{
    if (checkValidRow(4, guestNum, rv)){
        rowNum = 4;
    }
})
document.querySelector(".row5").addEventListener('click', ()=>{
    if (checkValidRow(5, guestNum, rv)){
        rowNum = 5
    }
})
document.querySelector(".row6").addEventListener('click', ()=>{
    if (checkValidRow(6, guestNum, rv)){
        rowNum = 6;
    }
})

document.querySelector(".singleBtn").addEventListener('click', ()=>{
    guestNum = 1;
    document.querySelector('#numGuests').style.display = 'none';
    document.querySelector('#selectRow').style.display = 'flex';
    singleGuest = true;
})


//button tp send RV
document.querySelector(".sendBtn").addEventListener('click', ()=>{
    moveRv = true;
})


//button to go back to select num guests
document.querySelector(".backBtn").addEventListener('click', ()=>{
    document.querySelector('#numGuests').style.display = 'flex';
    document.querySelector('#selectRow').style.display = 'none';
    singleGuest = false;
})





setInterval(()=>{
    startTime--;
}, 1000)







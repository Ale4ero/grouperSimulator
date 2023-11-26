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




//global variables
const frontLineY = 200;
const lineX = canW/2;
var guestNum;
var rowNum;
var queue;
var rv;
var partySize;
var leftToGroup;
var exit = false;






//party object 
function Party(width, color, size){

    this.width = width;
    this.color = color;
    this.size = size;


    this.draw = (x, y)=>{
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(x, y, this.width, 0, Math.PI*2)
        c.fill();
        c.fillStyle = '#ffffff';
        c.font = "20px sans-serif"
        c.fillText(this.size, x-5, y+5)
    }  

    this.update = (x, y)=>{  
        this.draw(x, y);     
    }    
}




//function that initializes the app
function init(){
    exit = false;

    //once game is started create the queue and store it 
    queue = createQueue();
    console.log(queue);

    //create a 2d array representing our rv
    rv = createNewRV();
    console.log(rv);
}


//main animate function
function animate(){

    if(exit) return;

    requestAnimationFrame(animate);

    //draw the queue to the canvas
    drawQueue(queue);

    //draw the rv graphic to the canvas
    drawRv();

    //display the party size to the user based on the next guest in the queue
    document.querySelector('.partyNum').innerHTML = queue[0].size;

    
    //size of the next party in line
    partySize = queue[0].size;


    //when user picks the order move guests
    if(guestNum != undefined && rowNum != undefined){
        //move guests into users input, then reset input
        moveGuests(rowNum, guestNum, rv, queue);
        guestNum = undefined;
        rowNum = undefined;
    }
   

}








//EXIT button
document.querySelector(".exitBtn").addEventListener('click', ()=>{
    console.log('exit click')
    document.querySelector('.welcomeScreen').style.display = 'flex';
    document.querySelector('#numGuests').style.display = 'none';
    document.querySelector('#selectRow').style.display = 'none';
    c.clearRect(0, 0, canW, canH);
    exit = true;
})





//START button game starts
document.querySelector("#startBtn").addEventListener('click', ()=>{
    console.log('start application.')

    document.querySelector('.welcomeScreen').style.display = 'none';
    document.querySelector('#numGuests').style.display = 'flex';

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
















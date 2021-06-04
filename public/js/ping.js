var canvas = document.getElementById("pp_ground");
var imagePath = document.getElementById("background");
var context = canvas.getContext("2d");


const ground_start = new Image();
ground_start.src = imagePath.CurrentSrc;
var play  = true;
const beep = new Audio();
//draw the rect function
beep.src =  "ball.wav";
var Time = 0;
var Height = canvas.height;
var Width  = canvas.width; 


//create the net

const net = {
    x : Width/2,
    y : 0,
    width : 4,
    height : 10,
    color : "#ffffff"
}
/*
create a player
*/
const player = {
    x : 2,
    y : Height/2 - 100/2,
    width : 20,
    height : 100,
    color : "#ffffff",
    score : 0
}

/* computer player
 */
const computer = {
    x : Width - 22,
    y : Height/2 - 100/2,
    width : 20,
    height : 100,
    color : "#ffffff",
    score : 0
}

/*
    the ball
 */
const ball = {
    x : Width/2,
    y  : Height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "#933411" 
}
function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

function drawCircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,2*Math.PI,false);
    context.closePath();
    context.fill();
}


function drawText(x,y,s,color){
    context.fillStyle = color;
    context.font = "26px cursive";
    context.fillText(s,x,y);
}


function resetgame() {
    player.score = 0;
    computer.score = 0;
    resetBall();
    canvas.width += 0;
    if(player.score > 4 || computer.score > 4){
        play = true;
        return setTimeout(gamerestart,1000/framePerSecond);
    }
    
}

function gamerestart() {
    updateGame();
    game();
    
}

function win(){
    if(player.score >= 5){
    return true;
    }else {
        return false;
    }
}
function lose(){
    if(computer.score >= 5){
    return true;
    }else {
        return false;
    }
}

function drawStroke(x,y,w,h,color){
    context.strokeStyle = color;
    context.strokeRect(x,y,w,h);
}




function drawNet(){
    for(let i = 0; i <= Height; i += 15){
        drawRect(net.x,net.y + i ,net.width,net.height,net.color);
    }
}

document.addEventListener("keydown",movekey);
document.addEventListener("keydown",start);


function start(event) {
    if(key == 39){
        play = !play;

        return;
    }

}


function movekey(event){
    key = event.keyCode;
     if (key === 38){
         if(!(player.y < 0))
            player.y -= 50;
            return;
    }
 
     if (key === 40){
        if(player.y < Height - 50){
        player.y += 50;
        return;
    }

    

    }
}



canvas.addEventListener("mousemove",movePaddle);

    function movePaddle(evt){
        let rect = canvas.getBoundingClientRect();
        player.y = evt.clientY - rect.top - player.height/2;
    }

    function playerOn(computer,player){
        let player_on = (ball.x < canvas.width/2) ? player : computer;
        return player_on;        
    }


/**
 * collision detection
 * 
 */


 function collision(b,p){
     b.top = b.y - b.radius;
     b.bottom = b.y + b.radius;
     b.right = b.x + b.radius;
     b.left = b.x - b.radius;

     p.top = p.y;
     p.bottom = p.y + p.height;
     p.left = p.x;
     p.right = p.x + p.width;

     return b.right > p.left && b.bottom > p.top && b.left < p.right
            && b.top < p.bottom;
 }


 function resetBall(){
    Time = 0;
    ball.speed = 5; 
    ball.x = Width/2;
    ball.y = Height/2;
    ball.velocityX = 3;
    ball.velocityY= 3; 
    var dx = ball.velocityX/Math.abs(ball.velocityX);
    ball.velocityX = 5*dx;
    ball.velocityX = -ball.velocityX;

    var dy = ball.velocityY/Math.abs(ball.velocityY);
    ball.velocityX = 5*dy;
    ball.velocityY = ball.velocityY;
    return;
 }
 

 //paddles

    
// update position movement and velocity

function updateGame(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let computerLevel = 0.1;
    //Simple AI to control computer paddle
    computer.y += (ball.y - (computer.y + computer.height/2))*computerLevel;

    //collide with wall on y-axis
    if(ball.y + ball.radius > Height || ball.y - ball.radius < 0 ){
        ball.velocityY = -ball.velocityY;
       
    } 


    let player_on = (ball.x < canvas.width/2) ? player : computer;
    if(collision(ball,player_on)){
        
        let collidePoint = ball.y - (player_on.y + player_on.height/2);
        
        collidePoint = collidePoint/(player_on.height/2);

        //direction of the ball when collision happens
        let direction = (ball.x < Width/2) ? 1 : -1;

        //calculate the angle in Rads
        let angleRad = collidePoint*Math.PI/4;

    
        //change velocity of X and Y
        ball.velocityX = direction*ball.speed*Math.cos(angleRad);
        ball.velocityY = ball.speed*Math.sin(angleRad);
        if(ball.speed < 12)
            ball.speed += 0.5;
    }
}
function game(){
    if(player.score == 4){
        computer.color = "red";
    }else if(computer.score == 4){
        player.color = "red";
    }else{
        computer.color = "white";
        player.color = "white";
    }
   
    
    // clear the canvas
    context.drawImage(ground_start,0,0);



    //draw the net
    drawNet();
    drawText(Width - 80, 46, Time,"red");

    //draw the score
    drawText(Width/2 - 126,46,"you "+player.score,"#ffffff");
    drawText(Width/2 + 46,46,"com "+computer.score,"#ffffff");
    
    //draw the player and computer
     drawRect(player.x,player.y,player.width,player.height,player.color);
     drawStroke(player.x,player.y,player.width,player.height,"#000000");
     drawRect(computer.x,computer.y,computer.width,computer.height,computer.color);
     drawStroke(computer.x,computer.y,computer.width,computer.height,"#000000");
    //draw the ball
    drawCircle(ball.x,ball.y, ball.radius , ball.color);      
}

function check_score(){
    if(ball.x - ball.radius < 0){
        resetBall();
        computer.score++;        
    }
    else if(ball.x + ball.radius > Width){
    resetBall();
    player.score++;   
    }
    else if(Time >= 60 ){
        resetBall();
    } 
}
function gamestart(){
    if(play){
    if(win()){
        context.drawImage(ground_start,0,0);
        drawText(Width/2 - 124,Height/2,"You win "+ player.score+"-"+computer.score+" !","White");
        clearInterval(gameStart);
    }

    else if(lose()){
        context.drawImage(ground_start,0,0);
        drawText(Width/2 - 124,Height/2,"You loose "+ computer.score+"-"+player.score+" !","red");
        clearInterval(gameStart);
    }else{
        updateGame();
        game();
    }
}else{
        context.drawImage(ground_start,0,0);
        context.drawImage(ground_start,0,0);
        drawText(Width/2 - 100,Height/2,"Press Spacebar <br />to play ","#f32fff");
        clearInterval(gameStart);
}  
}

function times(){
    Time = Time + 1;
}

const framePerSecond = 50;
let gameStart = setInterval(gamestart,1000/framePerSecond);
let score_game = setInterval(check_score,1000/999);
let update_time = setInterval(times,1000);
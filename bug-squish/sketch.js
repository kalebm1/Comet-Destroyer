//Kaleb Morgan
//CSC 2463
//Final Project - Comet Destroyer
//variable to keep track if clicked or not(Keyboard Mouse Version)
var click = false;

//Star Variables
//how many stars to draw
var starCount = 150;
//variable to keep track of star objects
var stars = [];
//variable to control speed of stars
var starSpeed = 10;

//Game variables
//variable for score
var score = 0;
//variable for game state(Game Screens)
var gameState = 1;  

//Comet Variables
//variable to hold comet objects
var comets = [];
//variable to keep track of the amount of comets to spawn.
var cometCount = 10;
//variable to control the speed of the comets.
var cometSpeed = 3;

//variable to hold the player's destroyer object.
var playerShip;

//Laser Variables.
//variable to hold all laser objects.
var lasers = [];
//variable to hold the amount of lasers on screen.
var lasersCount = 0;

//MISC Variables
//variable to hold time after player is hit by comet
var ghostTime = 0;
//boolean variable to hold if player was recently hit by comet
var justHit = false;
//boolean to keep exploded comets on screen for a brief second.
var explosionWait = 0;
//variable to hold loaded space ship spritesheet
var spaceimage;
//variables to hold loaded fonts.
var normalFont,titleFont;
//variables to hold the image for misc icons.
var extrasImage;

//variables for input serial data
var inData,serial,latestData,outNum,lastInputData;
var shipSelected=0;
var oldData;

function setup() {
  createCanvas(1080, 520);
  imageMode(CENTER);

  //Serial Code
  //Serial control code:
  serial = new p5.SerialPort();

  serial.list();
  serial.open("COM3");

  serial.on("connected", serverConnected);

  serial.on("list", gotList);

  serial.on("data", gotData);

  serial.on("error", gotError);

  serial.on("open", gotOpen);

  serial.on("close", gotClose);


  //MUSIC CODE
  //
}

function preload() {
  //load normal font
  normalFont = loadFont('fonts/8bitOperatorPlus8-Regular.ttf');
  //load cool title font
  titleFont = loadFont('fonts/Blox2.ttf');
  //populate the stars in the star array
  for (var i = 0; i < starCount; i++) {
    stars[i] = new Star(random(1080-1),random(520-1));
  }
  //populate the comets in the comet array
  for(var j = 0; j<cometCount;j++){
    comets[j] = new Comet("cometInfoSprites.png",round(random(1200,1900)),round(random(520-1)),false,false,j);
  }
  spaceimage = loadImage("spaceShipSprites.png");
  extrasImage = loadImage("extra_information.png");

}

//if mouse is pressed, return true.
function clicked() {
  if (mouseIsPressed) {
    click = true;
  } else {
    click = false;
  }

  return false;
}


function draw() {
  background(0, 0, 0);
  for(i = 0; i<starCount;i++){
    stars[i].draw();
  }
  //WELCOME SCREEN-------------------------------
  if(gameState==1){
    starSpeed = 2;
    fill(255);
    textFont(titleFont);
    textSize(90);
    text("Comet Destroyer", 200,200);
    textFont(normalFont);
    textSize(25);
    text("Select your destroyer to play!",325,235);
    //select spaceship images
    image(spaceimage,340,290,80,80,240,0,80,80);
    image(spaceimage,430,290,80,80,160,0,80,80);
    image(spaceimage,520,290,80,80,80,0,80,80);
    image(spaceimage,610,290,80,80,0,0,80,80);
    //info image
    image(extrasImage, 50,460,80,80,80,0,80,80);

    //red ship
    if(mouseX>=300&&mouseX<=380&&mouseY>=250&&mouseY<=330&&click==true){
      playerShip = new Ship(spaceimage,200,260,"red");
      gameState = 2;
    }
    //blue ship
    else if(mouseX>=390&&mouseX<=470&&mouseY>=250&&mouseY<=330&&click==true){
      playerShip = new Ship(spaceimage,200,260,"blue");
      gameState = 2;
    }
    //purple ship
    else if(mouseX>=480&&mouseX<=560&&mouseY>=250&&mouseY<=330&&click==true){
      playerShip = new Ship(spaceimage,200,260,"purple");
      gameState = 2;
    }
    //yellow ship
    else if(mouseX>=570&&mouseX<=650&&mouseY>=250&&mouseY<=330&&click==true){
      playerShip = new Ship(spaceimage,200,260,"yellow");
      gameState = 2;
    }
    //information page
    else if(mouseX>=10&&mouseX<=90&&mouseY>=420&&mouseY<=500&&click==true){
      gameState = 4;
    }

    if(shipSelected==0){
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(303,250,80,75);
      noStroke();
      fill(255);
    }else if(shipSelected==1){
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(393,250,80,75);
      noStroke();
      fill(255);

    }else if(shipSelected==2){
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(483,250,80,75);
      noStroke();
      fill(255);
      
    }else if(shipSelected==3){
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(573,250,80,75);
      noStroke();
      fill(255);

    }else if(shipSelected==-1){
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(9,420,80,75);
      noStroke();
      fill(255);

    }

    if(inData=="right"&&shipSelected<3&&inData!=oldData){
      oldData = "right";
      shipSelected++;
    }else if(inData=="left"&&shipSelected>0&&inData!=oldData){
      oldData = "left";
      shipSelected--;
    }else if(inData=="down"&&inData!=oldData){
      oldData="down";
      shipSelected = -1;
    }else if(inData=="up"&&inData!=oldData){
      oldData="up";
      shipSelected = 0;
    }else if(inData!="left"&&inData!="right"){
      oldData=inData;
    }

    if(inData=="pressed"){
      if(shipSelected==0){
        playerShip = new Ship(spaceimage,200,260,"red");
        gameState = 2;
      }
      else if(shipSelected==1){
        playerShip = new Ship(spaceimage,200,260,"blue");
        gameState = 2;
      }
      else if(shipSelected==2){
        playerShip = new Ship(spaceimage,200,260,"purple");
        gameState = 2;
      }
      else if(shipSelected==3){
        playerShip = new Ship(spaceimage,200,260,"yellow");
        gameState = 2;
      }
      else if(shipSelected==-1){
        gameState=4;
      }
    }

    // console.log(inData);

  }

  //GAME SCREEN -------------------------------------------------
  else if(gameState==2){
    starSpeed = 10;
    for(j=0;j<cometCount;j++){
      comets[j].draw();
    }
    playerShip.draw();
  
    fill(255);
    textFont(normalFont);
    textSize(30);
    text("SCORE: "+score,920,50);
  
    if(score==35){
      cometSpeed=5;
      starSpeed=12;
    }

    //MOVEMENT CODE FOR ARDUINO
    if(inData == "right"){
      oldData="right";
      playerShip.move("right");
    }
    if(inData == "left"){
      oldData="left";
      playerShip.move("left");
    }
    if(inData == "up"){
      oldData="up";
      playerShip.move("up");
    }
    if(inData == "down"){
      oldData="down";
      playerShip.move("down");
    }
    if(inData=="pressed"){
      oldData="pressed";
      playerShip.shoot();
    }
    if(inData=="center"&&oldData!=inData){
      if(oldData=="right"){
        playerShip.stop("x");
      }else if(oldData=="left"){
        playerShip.stop("x");
      }else if(oldData=="up"){
        playerShip.stop("y");
      }else if(oldData=="down"){
        playerShip.stop("y");
      }
    }
  }

  //GAME OVER SCREEN ----------------------------------------
  else if(gameState==3){
    starSpeed = 2;
    fill(255);
    textFont(titleFont);
    textSize(90);
    text("GAME OVER", 240,200);
    textFont(normalFont);
    textSize(25);
    text("YOUR SCORE WAS: "+score,325,235);
    text("REFRESH TO PLAY AGAIN",325,335);
  }

  //GAME INFORMATION SCREEN ---------------------------------
  else if(gameState==4){
    textFont(titleFont);
    textSize(90);
    text("How To Play", 240,200);
    textFont(normalFont);
    textSize(25);
    text("Use the joystick to move your destroyer around space.",100,235);
    text("Press the button to shoot a laser at the comets coming at you.",100,265);
    text("Normal comets only take away 20 health for a hit.",100,295);
    text("Super comets kill you instantly, so watch out for those!",100,325);
    text("Hearts give you 20 health when you catch them.",100,355);
    text("Have fun and get a high score!",100,385);
    image(extrasImage, 50,50,80,80,160,0,80,80);
    if(mouseX>=10&&mouseX<=90&&mouseY>=10&&mouseY<=90&&click==true){
      gameState = 1;
    }
    if(inData=="pressed"){
      gameState=1;
    }
  }

  clicked();
}

//function to test game with keyboard and mouse.
function keyPressed(){
  //38 - up
  //40 - down
  //37 - left
  //39 - right
  // console.log(keyCode);

  if(keyCode == RIGHT_ARROW){
    playerShip.move("right");
  }
  if(keyCode == LEFT_ARROW){
    playerShip.move("left");
  }
  if(keyCode == UP_ARROW){
    playerShip.move("up");
  }
  if(keyCode == DOWN_ARROW){
    playerShip.move("down");
  }
  if(keyCode==32){
    playerShip.shoot();
  }
}

//function to test game with keyboard and mouse.
function keyReleased(){
  //38 - up
  //40 - down
  //37 - left
  //39 - right
  // console.log(keyCode);

  if(keyCode == RIGHT_ARROW){
    playerShip.stop("x");
  }
  if(keyCode == LEFT_ARROW){
    playerShip.stop("x");
  }
  if(keyCode == UP_ARROW){
    playerShip.stop("y");
  }
  if(keyCode == DOWN_ARROW){
    playerShip.stop("y");
  }
}

//STAR CLASS -----------------------
function Star(x, y) {
 this.x = x;
 this.y = y;

 this.draw = function(){
  if(this.x<0){
    this.x = 1080;
    this.y = random(520-1);
  }
  this.x = this.x-starSpeed;
  rect(this.x,this.y,5,5);
 };
}

//COMET CLASS ------------------------
function Comet(imageName, x, y, isSuper,isHeart,index){
  //this is going to be the code for the comet.
  this.x = x;
  this.y = y;
  this.isSuper = isSuper;
  this.isHeart = isHeart;
  this.spritesheet = loadImage(imageName);
  this.index = index;
  this.exploded=false;
  this.timeRemaining = 0;

  this.draw = function(){
    if(this.isSuper&&!this.exploded){
      push();
      translate(this.x,this.y);
      this.x = this.x-cometSpeed;
      image(this.spritesheet,0,0,160,80,240,0,160,80);
      pop();
    }
    else if(this.isHeart&&!this.exploded){
      push();
      translate(this.x,this.y);
      this.x = this.x-cometSpeed;
      image(this.spritesheet,0,0,80,80,80,0,80,80);
      pop();
    }else if(!this.exploded){
      push();
      translate(this.x,this.y);
      this.x = this.x-cometSpeed;
      image(this.spritesheet,0,0,80,80,400,0,80,80);
      pop();
    }else if(this.exploded){
      s = second();
      this.timeRemaining= abs(1-abs(explosionWait-s));

      if(this.timeRemaining==0){
        comets[this.index] = new Comet("cometInfoSprites.png",round(random(1500,1800)),round(random(520-1)),false,false,this.index);
      }else{
        push();
        translate(this.x,this.y);
        image(this.spritesheet,0,0,80,80,160,0,80,80)
        pop();
      }
    }

    if(this.x<-30){
      console.log("restart");
      let randomVal = round(random(1,1000));
      if(randomVal<800){
        comets[this.index] = new Comet("cometInfoSprites.png",round(random(1500,1800)),round(random(520-1)),false,false,this.index);
      }else if(randomVal>799&&randomVal<950){
        comets[this.index] = new Comet("cometInfoSprites.png",round(random(1500,1800)),round(random(520-1)),true,false,this.index);
      }else{
        comets[this.index] = new Comet("cometInfoSprites.png",round(random(1500,1800)),round(random(520-1)),false,true,this.index);
      }
      
    }
  }

  this.getX = function(){
    return this.x;
  }
  this.getY = function(){
    return this.y;
  }

  this.makeDie = function(){
    this.exploded = true;
  }

  this.getHealth = function(){
    return this.isHeart;
  }

  this.getSuper = function(){
    return this.isSuper;
  }
}

//PLAYER SHIP CLASS ----------------------
function Ship(imageName, x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.health = 100;
  this.spritesheet = imageName;
  this.healthsprite = loadImage("healthBarSprites.png");
  this.xMove = 0;
  this.yMove = 0;
  this.laser = loadImage("cometInfoSprites.png");
  this.laserShot = false;

  this.draw = function(){
    this.drawLaser();
    push();
    translate(this.x,this.y);
    this.x = this.x+this.xMove*3;
    this.y = this.y+this.yMove*3;
    if(this.health>0){
      if(this.color=="red"){
        image(this.spritesheet,0,0,80,80,240,0,80,80);
      }
      else if(this.color=="blue"){
        image(this.spritesheet,0,0,80,80,160,0,80,80);
      }
      else if(this.color=="purple"){
        image(this.spritesheet,0,0,80,80,80,0,80,80);
      }
      else if(this.color=="yellow"){
        image(this.spritesheet,0,0,80,80,0,0,80,80);
      }
  }else{
    console.log("DEAD");
    image(this.laser,0,0,80,80,160,0,80,80)
    gameState=3;
  }


    pop();


    this.drawHealthBar();
    this.checkCollision();
  }

  this.move = function(direction){
    if(direction=="up"){
      console.log("up");
      if(this.y>40){
        this.yMove=-1;
      }
    }
    else if(direction=="down"){
      console.log("down");
      if(this.y<480){
        this.yMove=1;
      }
    }
    else if(direction=="left"){
      console.log("left");
      if(this.x>40){
        this.xMove=-1;
      }
    }
    else if(direction=="right"){
      console.log("right");
      if(this.y<520){
        this.xMove=1;
      }
    }
  }
  this.stop = function(direction){
    if(direction=="x"){
      this.xMove=0;
    }else{
      this.yMove=0;
    }
  }

  this.heartCaught = function(){
    this.health = health+20;
  }

  this.shoot = function(){
    lasersCount = lasersCount+1;
    lasers[lasersCount-1] = new Laser(this.x,this.y);
  }

  this.drawHealthBar = function(){
    if(this.health==100){
      fill(126,200,80);
    }else if(this.health==80||this.health==60){
      fill(255,211,0);
    }else if(this.health==40||this.health==20){
      fill(153,0,0);
    }else if(this.health==0){

    }
    textFont(normalFont);
    textSize(30);
    text("Health: "+this.health, 900,500);
  }
  this.drawLaser = function(){
    for(j = 0;j<lasersCount;j++){
      lasers[j].draw();
    }
  }

  this.checkCollision = function(){
    s= second();
    timeRemaining= abs(3-abs(ghostTime-s));
    if(timeRemaining==0 && justHit){
      justHit = false;
      ghostTime = 0;
    }
    if(!justHit){
      for(var c = 0;c<cometCount;c++){
        let cx = round(comets[c].getX());
        let cy = round(comets[c].getY());
        if((this.x<cx+40&&this.x+40>cx&&this.y<cy+40&&this.y+40>cy)||(this.x<cx-40&&this.x-40>cx&&this.y<cy-20&&this.y-40>cy)){
          console.log(comets[c].getHealth());
          if(comets[c].getHealth()){
            //check health
            if(this.health<100){
              this.health+=20;
            }
          }else if(comets[c].getSuper()){
            //is super comet
            this.health = 0;
          }else{
            console.log(this.health);
            if(this.health>0){
              this.health=this.health-20;
            }
            justHit = true;
            ghostTime = second();
          }
        }
      }
    }
  }
}

//LASER CLASS -------------------------
function Laser(x,y){
  this.x = x;
  this.y = y;
  this.laser = loadImage("cometInfoSprites.png");
  this.hit = false;

  this.draw = function(){
    if(this.x<1080&&!this.hit){
      push();
      translate(this.x,this.y-10);
      image(this.laser,0,0,80,80,0,0,80,80);
      this.x+=10;
      pop();

      this.checkCollision();
    }
  }

  this.checkCollision = function(){
    for(var c = 0;c<cometCount;c++){
      let cx = round(comets[c].getX());
      let cy = round(comets[c].getY());
      if((this.x<cx+20&&this.x+40>cx&&this.y<cy+40&&this.y+20>cy)||(this.x<cx-40&&this.x-10>cx&&this.y<cy-50&&this.y-20>cy)){
        comets[c].makeDie();
        explosionWait = second();
        this.hit=true;
        score++;
      }
    }
  }
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------




//New Serial Methods for Arduino Serial Ports:

 //New Serial Methods:
 function serverConnected() {
  print("Connected to Server");
}
  
function gotList(thelist) {
  print("List of Serial Ports:");
  
  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}
  
function gotOpen() {
  print("Serial Port is Open");
}
  
function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}
  
function gotError(theerror) {
  print(theerror);
}
  
function gotData() {
  // inData = int(serial.readLine());



  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  // console.log(currentString);
  inData =currentString;
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

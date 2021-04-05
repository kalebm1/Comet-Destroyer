//Kaleb Morgan
//CSC 2463
//Final Project - Comet Smash

var starCount = 150;
var stars = [];

var comets = [];
var cometCount = 10;
var cometSpeed = 3;
var playerShip;

var lasers = [];
var lasersCount = 0;

var ghostTime = 0;
var justHit = false;
var explosionWait = 0;

function setup() {
  createCanvas(1080, 520);
  imageMode(CENTER);
}

function preload() {
  for (var i = 0; i < starCount; i++) {
    stars[i] = new Star(random(1080-1),random(520-1));
  }
  playerShip = new Ship("spaceShipSprites.png",200,260,"red");

  for(var j = 0; j<cometCount;j++){
    comets[j] = new Comet("cometInfoSprites.png",round(random(1200,1900)),round(random(520-1)),false,false,j);
  }

}

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
  

  for(j=0;j<cometCount;j++){
    comets[j].draw();
  }
  playerShip.draw();


}

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

function Star(x, y) {
 this.x = x;
 this.y = y;

 this.draw = function(){
  if(this.x<0){
    this.x = 1080;
    this.y = random(520-1);
  }
  this.x = this.x-10;
  rect(this.x,this.y,5,5);
 };
}


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

    }
    else if(this.isHeart&&!this.exploded){

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
      comets[this.index] = new Comet("cometInfoSprites.png",round(random(1500,1800)),round(random(520-1)),false,false,this.index);
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
}

function Ship(imageName, x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.health = 100;
  this.spritesheet = loadImage(imageName);
  this.healthsprite = loadImage("healthBarSprites.png");
  this.xMove = 0;
  this.yMove = 0;
  this.laser = loadImage("cometInfoSprites.png");
  this.laserShot = false;

  this.draw = function(){
    //draw health bar;
    //draw ship;
    //draw laser;
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
    // translate(30,60);
    if(this.health==100){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
    else if(this.health==80){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
    else if(this.health==60){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
    else if(this.health==40){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
    else if(this.health==20){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
    else if(this.health==0){
      image(this.healthsprite,940,480,300,80,320,0,240,80);
    }
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
      for(var c = 0;c<cometCount;c++){
        let cx = round(comets[c].getX());
        let cy = round(comets[c].getY());
        // if(cx == this.x+40&&cy==this.y){
        //   console.log(this.health);
        //   this.health=this.health-20;
        // }
        if(this.x<cx+20&&this.x+40>cx&&this.y<cy+20&&this.y+20>cy){
          console.log(this.health);
          if(this.health>0){
            this.health=this.health-20;
          }
          
          justHit = true;
          ghostTime = second();
        }
      }
    }
    else if(!justHit){
      for(var c = 0;c<cometCount;c++){
        let cx = round(comets[c].getX());
        let cy = round(comets[c].getY());
        // if(cx == this.x+40&&cy==this.y){
        //   console.log(this.health);
        //   this.health=this.health-20;
        // }
        if(this.x<cx+20&&this.x+40>cx&&this.y<cy+20&&this.y+20>cy){
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
      // if(cx == this.x+40&&cy==this.y){
      //   console.log(this.health);
      //   this.health=this.health-20;
      // }
      if(this.x<cx+20&&this.x+40>cx&&this.y<cy+20&&this.y+20>cy){
        comets[c].makeDie();
        explosionWait = second();
        this.hit=true;
      }
    }
  }
}


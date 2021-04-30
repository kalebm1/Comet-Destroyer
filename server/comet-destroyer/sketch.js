//Kaleb Morgan
//CSC 2463 - FINAL PROJECT
//VIDEO DEMO: https://youtu.be/ywq5B5dRSvs

//The game should still be playable with keyboard
//even though full Arduino integration has been added.

//Play online at https://cometdestroyer.makwd.us

//Final Project - Comet Destroyer
//variable to keep track if clicked or not(Keyboard Mouse Version)
var click = false;

//Star Variables
//how many stars to draw
var starCount;
//variable to keep track of star objects
var stars = [];
//variable to control speed of stars
var starSpeed = 10;

//Game variables
//variable for score
var score = 0;
//variable for game state(Game Screens)
//home screen = 1
var gameState = 1;

//Comet Variables
//variable to hold comet objects
var comets = [];
//variable to keep track of the amount of comets to spawn.
var cometCount;
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
var normalFont, titleFont;
//variables to hold the image for misc icons.
var extrasImage;

//variables for input serial data
var inData, serial, latestData, outNum, lastInputData;
var shipSelected = 0;
var oldData;

//Variables to hold music info
var introMusic, winMusic, synth1, synth2, overMusic,multiplayer,gameMusic,gameTime,vol,soundVols,overInstrument;

var notSent = true;
var drawn = false;
var playername = " ";
var input;

function setup() {
  createCanvas(1080, 520);
  imageMode(CENTER);

  //volume control
  vol = new Tone.Volume(-12).toDestination();
  soundVols = new Tone.Volume(-5).toDestination();

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
  //------------------------------------------
  //INSTRUMENT CODE!!!!:
  multiplayer = new Tone.Players({
    explosion: "comet-sounds/explosion.mp3",
    health: "comet-sounds/health.mp3",
    laser: "comet-sounds/laser.mp3",
    shiphit: "comet-sounds/ship-hit.mp3",
  }).connect(soundVols);



  synth = make_poly().instrument;
  space_synth = make_space_synth().instrument;

  //music for intro
  introMusic = [
    { time: "0:0", note: ["F#4","D#2","D#3"] },
    { time: "0:2", note: ["D#4"] },
    { time: "0:3", note: ["D#2"] },
    { time: "1:0", note: ["F4"] },
    { time: "1:2", note: ["F#4"] },
    { time: "1:2", note: ["D#2"] },
    { time: "2:0", note: ["G#4","D#2","A#3"]},
    { time: "2:1", note: ["A#4"]},
    { time: "2:2", note: ["G#4"]},
    { time: "3:0", note: ["F#4","G#3"]},
    { time: "3:2", note: ["F4"]},
    { time: "4:0", note: ["F#4","D#2","F#3"] },
    { time: "4:2", note: ["D#4"] },
    { time: "4:3", note: ["D#2"] },
    { time: "5:0", note: ["F4"] },
    { time: "5:2", note: ["F#4"] },
    { time: "5:2", note: ["D#2"] },
    { time: "6:0", note: ["G#4","D#2","F3"]},
    { time: "6:1", note: ["A#4"]},
    { time: "6:2", note: ["G#4"]},
    { time: "7:0", note: ["F#4"]},
    { time: "7:2", note: ["F4"]},
  ];
  introAccompain = [
    { time: "0:0", note: ["D#3"], duration: "1.2m"},
    { time: "2:0", note: ["A#3"], duration: "1m"},
    { time: "3:0", note: ["G#3"], duration: "1m"},
    { time: "4:0", note: ["F#3"], duration: "1.2m" },
    { time: "6:0", note: ["F3"], duration: "1.2m"},

  ];
  gameMusic = [
    { time: "0:0", note: ["F#3","A#3","D#4"], duration: "8n",vol: 1},
    { time: "0:1", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "0:3", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "1:0", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "1:2", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "1:3", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "2:1", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "2:2", note: ["F#3","A#3","D#4"], duration: "8n"},
    { time: "3:0", note: ["F#3","A#3","D#4"], duration: "2n"},
    { time: "3:1", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "3:2", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "4:0", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "4:1", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "4:3", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "5:0", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "5:1", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "5:3", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "6:0", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "6:1", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "6:3", note: ["F#3","A#3","C#4"], duration: "8n"},
    { time: "7:0", note: ["F#3","A#3","C#4"], duration: "2n"},
    { time: "0:0", note: ["F#2"], duration:"4m",volume : 0.1},
    { time: "4:0", note: ["C#2"], duration:"4m",volume: 0.1},
    // { time: "2:0", note: ["A#3"]},
    // { time: "3:0", note: ["G#3"]},
    // { time: "4:0", note: ["F#3"]},
    // { time: "6:0", note: ["F3"]},
  ];

  overMusic= [
    { time: "0:0", note: ["C#5"], duration: "4n"},
    { time: "1:2", note: ["F#4"], duration: "8n"},
    { time: "2:0", note: ["A#4"], duration: "8n"},
    { time: "3:0", note: ["G#4"], duration: "8n"},
    { time: "4:0", note: ["C#5"], duration: "4n"},
    { time: "5:2", note: ["F#4"], duration: "8n"},
    { time: "6:0", note: ["A#4"], duration: "8n"},
    { time: "7:0", note: ["G#4"], duration: "8n"},
    { time: "0:0", note: ["D#2"], duration: "1n."},
    { time: "1:2", note: ["C#2"], duration: "1n."},
    { time: "3:0", note: ["C#2"], duration: "1n"},
    { time: "4:0", note: ["F#2"], duration: "3m"},
  
  ];

  //Part for the intro Song
  intro = new Tone.Part((time, chord) => {
    synth.triggerAttackRelease(chord.note, "8n", time,chord.value);
  }, introMusic);

  intro2 = new Tone.Part((time, chord) => {
    space_synth.triggerAttackRelease(chord.note, chord.duration, time);
  }, introAccompain);

  gameTime = new Tone.Part((time, chord) => {
    synth.triggerAttackRelease(chord.note, chord.duration, time);
  }, gameMusic);

  overInstrument= new Tone.Part((time, chord) => {
    synth.triggerAttackRelease(chord.note, chord.duration, time);
  }, overMusic);

  //Start the transport
  Tone.Transport.start();
  //set the BPM at 200
  Tone.Transport.bpm.value = 400;

  //loop the music
  intro.loop = true;
  intro.loopEnd = "8m";
  intro.autostart = true;
  //Start the intro music
  intro.start();
   //loop the music
   intro2.loop = true;
   intro2.loopEnd = "8m";
   intro2.autostart = true;
   //Start the intro music
   intro2.start();

   //game time setup
   gameTime.loop = true;
   gameTime.loopEnd = "8m";

   overInstrument.loop = true;
   overInstrument.loopEnd = "8m";
}

function preload() {
  //Set correct responsive amounts for stars and comets.
  starCount = round(windowWidth / 7);
  cometCount = round(windowWidth / 108);
  starSpeed = round(windowHeight/52);
  cometSpeed = round(windowHeight/173);
  //load normal font
  normalFont = loadFont("fonts/8bitOperatorPlus8-Regular.ttf");
  //load cool title font
  titleFont = loadFont("fonts/Blox2.ttf");
  //populate the stars in the star array
  for (var i = 0; i < starCount; i++) {
    stars[i] = new Star(random(1080 - 1), random(520 - 1));
  }
  //populate the comets in the comet array
  for (var j = 0; j < cometCount; j++) {
    comets[j] = new Comet(
      "cometInfoSprites.png",
      round(random(1200, 1900)),
      round(random(520 - 1)),
      false,
      false,
      j
    );
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
  for (i = 0; i < starCount; i++) {
    stars[i].draw();
  }
  //WELCOME SCREEN-------------------------------
  if (gameState == 1) {
    serial.write(0);
    starSpeed = 2;
    fill(255);
    textFont(titleFont);
    textSize(90);
    text("Comet Destroyer", 200, 200);
    textFont(normalFont);
    textSize(25);
    text("Select your destroyer to play!", 325, 235);
    //select spaceship images
    image(spaceimage, 340, 290, 80, 80, 240, 0, 80, 80);
    image(spaceimage, 430, 290, 80, 80, 160, 0, 80, 80);
    image(spaceimage, 520, 290, 80, 80, 80, 0, 80, 80);
    image(spaceimage, 610, 290, 80, 80, 0, 0, 80, 80);
    //info image
    image(extrasImage, 50, 460, 80, 80, 80, 0, 80, 80);

    //red ship
    if (
      mouseX >= 300 &&
      mouseX <= 380 &&
      mouseY >= 250 &&
      mouseY <= 330 &&
      click == true
    ) {
      playerShip = new Ship(spaceimage, 200, 260, "red");
      gameState = 2;
    }
    //blue ship
    else if (
      mouseX >= 390 &&
      mouseX <= 470 &&
      mouseY >= 250 &&
      mouseY <= 330 &&
      click == true
    ) {
      playerShip = new Ship(spaceimage, 200, 260, "blue");
      gameState = 2;
    }
    //purple ship
    else if (
      mouseX >= 480 &&
      mouseX <= 560 &&
      mouseY >= 250 &&
      mouseY <= 330 &&
      click == true
    ) {
      playerShip = new Ship(spaceimage, 200, 260, "purple");
      gameState = 2;
    }
    //yellow ship
    else if (
      mouseX >= 570 &&
      mouseX <= 650 &&
      mouseY >= 250 &&
      mouseY <= 330 &&
      click == true
    ) {
      playerShip = new Ship(spaceimage, 200, 260, "yellow");
      gameState = 2;
    }
    //information page
    else if (
      mouseX >= 10 &&
      mouseX <= 90 &&
      mouseY >= 420 &&
      mouseY <= 500 &&
      click == true
    ) {
      gameState = 4;
    }

    if (shipSelected == 0) {
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(303, 250, 80, 75);
      noStroke();
      fill(255);
    } else if (shipSelected == 1) {
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(393, 250, 80, 75);
      noStroke();
      fill(255);
    } else if (shipSelected == 2) {
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(483, 250, 80, 75);
      noStroke();
      fill(255);
    } else if (shipSelected == 3) {
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(573, 250, 80, 75);
      noStroke();
      fill(255);
    } else if (shipSelected == -1) {
      noFill();
      strokeWeight(4);
      stroke(255);
      rect(9, 420, 80, 75);
      noStroke();
      fill(255);
    }
    if (
      mouseX >= 303 &&
      mouseX <= 303 + 80 &&
      mouseY >= 250 &&
      mouseY <= 250 + 75
    ) {
      shipSelected = 0;
    } else if (
      mouseX >= 393 &&
      mouseX <= 393 + 80 &&
      mouseY >= 250 &&
      mouseY <= 250 + 75
    ) {
      shipSelected = 1;
    } else if (
      mouseX >= 483 &&
      mouseX <= 483 + 80 &&
      mouseY >= 250 &&
      mouseY <= 250 + 75
    ) {
      shipSelected = 2;
    } else if (
      mouseX >= 573 &&
      mouseX <= 573 + 80 &&
      mouseY >= 250 &&
      mouseY <= 250 + 75
    ) {
      shipSelected = 3;
    }

    if (inData == "potup" && shipSelected < 3 && inData != oldData) {
      oldData = "potup";
      shipSelected++;
    } else if (inData == "potdown" && shipSelected > 0 && inData != oldData) {
      oldData = "potup";
      shipSelected--;
    } else if (inData == "down" && inData != oldData) {
      oldData = "down";
      shipSelected = -1;
    } else if (inData == "up" && inData != oldData) {
      oldData = "up";
      shipSelected = 0;
    } else if (inData != "potup" && inData != "potdown") {
      oldData = inData;
    }

    if (inData == "pressed") {
      if (shipSelected == 0) {
        playerShip = new Ship(spaceimage, 200, 260, "red");
        gameState = 2;
      } else if (shipSelected == 1) {
        playerShip = new Ship(spaceimage, 200, 260, "blue");
        gameState = 2;
      } else if (shipSelected == 2) {
        playerShip = new Ship(spaceimage, 200, 260, "purple");
        gameState = 2;
      } else if (shipSelected == 3) {
        playerShip = new Ship(spaceimage, 200, 260, "yellow");
        gameState = 2;
      } else if (shipSelected == -1) {
        gameState = 4;
      }
    }

    // console.log(inData);
  }

  //GAME SCREEN -------------------------------------------------
  else if (gameState == 2) {
    if(inData=="potup"){
      vol.volume.value+=20;
    } else if(inData=="potdown"){
      vol.volume.value-=20;
    }
    serial.write(0);
    intro.stop();
    intro2.stop();
    gameTime.start();
    starSpeed = 10;
    for (j = 0; j < cometCount; j++) {
      comets[j].draw();
    }
    playerShip.draw();

    fill(255);
    textFont(normalFont);
    textSize(30);
    text("SCORE: " + score, 920, 50);

    if (score == 35) {
      cometSpeed = 5;
      starSpeed = 12;
    }

    //MOVEMENT CODE FOR ARDUINO
    if (inData == "right") {
      oldData = "right";
      playerShip.move("right");
    }
    if (inData == "left") {
      oldData = "left";
      playerShip.move("left");
    }
    if (inData == "up") {
      oldData = "up";
      playerShip.move("up");
    }
    if (inData == "down") {
      oldData = "down";
      playerShip.move("down");
    }
    if (inData == "pressed"&&oldData!="pressed") {
      oldData = "pressed";
      playerShip.shoot();
    }
    if (inData == "center" && oldData != inData) {
      if (oldData == "right") {
        playerShip.stop("x");
      } else if (oldData == "left") {
        playerShip.stop("x");
      } else if (oldData == "up") {
        playerShip.stop("y");
      } else if (oldData == "down") {
        playerShip.stop("y");
      }
    if(oldData == "pressed"){
      oldData="center";
    }
    }
  }

  //GAME OVER SCREEN ----------------------------------------
  else if (gameState == 3) {
    serial.write(2);
    intro.stop();
    intro2.stop();
    gameTime.stop();
    overInstrument.start();
    starSpeed = 2;
    if(!drawn){
      drawEndScreen();
      drawn = true;
    }
    fill(255);
    textFont(titleFont);
    textSize(90);
    text("GAME OVER", 240, 200);
    textFont(normalFont);
    textSize(25);
    text("YOUR SCORE WAS: " + score, 325, 235);
    text("REFRESH TO PLAY AGAIN", 325, 335);
    text("Get on the leaderboard!", 325,360);
  }

  //GAME INFORMATION SCREEN ---------------------------------
  else if (gameState == 4) {
    textFont(titleFont);
    textSize(90);
    text("How To Play", 240, 200);
    textFont(normalFont);
    textSize(25);
    text("Use the joystick to move your destroyer around space.", 100, 235);
    text(
      "Press the button to shoot a laser at the comets coming at you.",
      100,
      265
    );
    text("Normal comets only take away 20 health for a hit.", 100, 295);
    text("Super comets kill you instantly, so watch out for those!", 100, 325);
    text("Hearts give you 20 health when you catch them.", 100, 355);
    text("Have fun and get a high score!", 100, 385);
    image(extrasImage, 50, 50, 80, 80, 160, 0, 80, 80);
    if (
      mouseX >= 10 &&
      mouseX <= 90 &&
      mouseY >= 10 &&
      mouseY <= 90 &&
      click == true
    ) {
      gameState = 1;
    }
    if (inData == "pressed") {
      gameState = 1;
    }
  }

  clicked();
}

function sendScore(){
  playername = input.value();
  if(notSent){
    const data = {playername, score}
    notSent = false;
    httpPost('/api','text',data,function(result){
      console.log('I got a request!')
      console.log(result);
    },function(error){
      console.log(error);
    });
  }
}

function drawEndScreen(){
    input = createInput();
    input.position(325,380);
    let subbutton = createButton('submit');
    subbutton.position(input.x+input.width+20,380);
    subbutton.mousePressed(sendScore);
}

//function to test game with keyboard and mouse.
function keyPressed() {
  //38 - up
  //40 - down
  //37 - left
  //39 - right
  // console.log(keyCode);

  if (keyCode == RIGHT_ARROW) {
    playerShip.move("right");
  }
  if (keyCode == LEFT_ARROW) {
    playerShip.move("left");
  }
  if (keyCode == UP_ARROW) {
    playerShip.move("up");
  }
  if (keyCode == DOWN_ARROW) {
    playerShip.move("down");
  }
  if (keyCode == 32) {
    playerShip.shoot();
  }
}

//function to test game with keyboard and mouse.
function keyReleased() {
  //38 - up
  //40 - down
  //37 - left
  //39 - right
  // console.log(keyCode);

  if (keyCode == RIGHT_ARROW) {
    playerShip.stop("x");
  }
  if (keyCode == LEFT_ARROW) {
    playerShip.stop("x");
  }
  if (keyCode == UP_ARROW) {
    playerShip.stop("y");
  }
  if (keyCode == DOWN_ARROW) {
    playerShip.stop("y");
  }
}

//STAR CLASS -----------------------
function Star(x, y) {
  this.x = x;
  this.y = y;

  this.draw = function () {
    if (this.x < 0) {
      this.x = 1080;
      this.y = random(520 - 1);
    }
    this.x = this.x - starSpeed;
    rect(this.x, this.y, 5, 5);
  };
}

//COMET CLASS ------------------------
function Comet(imageName, x, y, isSuper, isHeart, index) {
  //this is going to be the code for the comet.
  this.x = x;
  this.y = y;
  this.isSuper = isSuper;
  this.isHeart = isHeart;
  this.spritesheet = loadImage(imageName);
  this.index = index;
  this.exploded = false;
  this.timeRemaining = 0;
  this.explosionSound = false;
  this.caught = false;

  this.draw = function () {
    if (this.isSuper && !this.exploded) {
        push();
        translate(this.x, this.y);
        this.x = this.x - cometSpeed;
        image(this.spritesheet, 0, 0, 160, 80, 240, 0, 160, 80);
        pop();
    } else if (this.isHeart && !this.exploded&&!this.caught) {
        push();
        translate(this.x, this.y);
        this.x = this.x - cometSpeed;
        image(this.spritesheet, 0, 0, 80, 80, 80, 0, 80, 80);
        pop();
    } else if (!this.exploded&&!this.isHeart) {
        push();
        translate(this.x, this.y);
        this.x = this.x - cometSpeed;
        image(this.spritesheet, 0, 0, 80, 80, 400, 0, 80, 80);
        pop();
    } else if (this.exploded) {
        if(!this.explosionSound){
          multiplayer.player("explosion").start();
          this.explosionSound = true;
        }
        s = second();
        this.timeRemaining = abs(1 - abs(explosionWait - s));

        if (this.timeRemaining == 0) {
          comets[this.index] = new Comet(
            "cometInfoSprites.png",
            round(random(1500, 1800)),
            round(random(520 - 1)),
            false,
            false,
            this.index
          );

        } else if(!this.isHeart) {
            push();
            translate(this.x, this.y);
            image(this.spritesheet, 0, 0, 80, 80, 160, 0, 80, 80);
            pop();
        }
    } else if(this.isHeart && this.isCaught){
        comets[this.index] = new Comet(
          "cometInfoSprites.png",
          round(random(1500, 1800)),
          round(random(520 - 1)),
          false,
          false,
          this.index
        );
    }

    if (this.x < -30) {
      //console.log("restart");
      let randomVal = round(random(1, 1000));
      if (randomVal < 800) {
        comets[this.index] = new Comet(
          "cometInfoSprites.png",
          round(random(1500, 1800)),
          round(random(520 - 1)),
          false,
          false,
          this.index
        );
      } else if (randomVal > 799 && randomVal < 950) {
        comets[this.index] = new Comet(
          "cometInfoSprites.png",
          round(random(1500, 1800)),
          round(random(520 - 1)),
          true,
          false,
          this.index
        );
      } else {
        comets[this.index] = new Comet(
          "cometInfoSprites.png",
          round(random(1500, 1800)),
          round(random(520 - 1)),
          false,
          true,
          this.index
        );
      }
    }
  };

  this.getX = function () {
    return this.x;
  };
  this.getY = function () {
    return this.y;
  };

  this.makeDie = function () {
    this.exploded = true;
  };

  this.getHealth = function () {
    return this.isHeart;
  };

  this.getSuper = function () {
    return this.isSuper;
  };

  this.isExploded = function(){
    return this.exploded;
  };

  this.catch = function(){
    this.caught = true;
  };

  this.isCaught = function(){
    return this.caught;
  };
}

//PLAYER SHIP CLASS ----------------------
function Ship(imageName, x, y, color) {
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

  this.draw = function () {
    this.drawLaser();
    push();
    translate(this.x, this.y);
    this.x = this.x + this.xMove * 3;
    this.y = this.y + this.yMove * 3;
    if (this.health > 0) {
      if (this.color == "red") {
        image(this.spritesheet, 0, 0, 80, 80, 240, 0, 80, 80);
      } else if (this.color == "blue") {
        image(this.spritesheet, 0, 0, 80, 80, 160, 0, 80, 80);
      } else if (this.color == "purple") {
        image(this.spritesheet, 0, 0, 80, 80, 80, 0, 80, 80);
      } else if (this.color == "yellow") {
        image(this.spritesheet, 0, 0, 80, 80, 0, 0, 80, 80);
      }
    } else {
      //console.log("DEAD");
      image(this.laser, 0, 0, 80, 80, 160, 0, 80, 80);
      gameState = 3;
    }

    pop();

    this.drawHealthBar();
    this.checkCollision();
  };

  this.move = function (direction) {
    if (direction == "up") {
      //console.log("up");
      if (this.y > 40) {
        this.yMove = -1;
      }
    } else if (direction == "down") {
      //console.log("down");
      if (this.y < 480) {
        this.yMove = 1;
      }
    } else if (direction == "left") {
      //console.log("left");
      if (this.x > 40) {
        this.xMove = -1;
      }
    } else if (direction == "right") {
      //console.log("right");
      if (this.y < 520) {
        this.xMove = 1;
      }
    }
  };
  this.stop = function (direction) {
    if (direction == "x") {
      this.xMove = 0;
    } else {
      this.yMove = 0;
    }
  };

  this.heartCaught = function () {
    this.health = health + 20;
  };

  this.shoot = function () {
    multiplayer.player("laser").start();
    serial.write(1);
    lasersCount = lasersCount + 1;
    lasers[lasersCount - 1] = new Laser(this.x, this.y);
  };

  this.drawHealthBar = function () {
    if (this.health == 100) {
      fill(126, 200, 80);
    } else if (this.health == 80 || this.health == 60) {
      fill(255, 211, 0);
    } else if (this.health == 40 || this.health == 20) {
      fill(153, 0, 0);
    } else if (this.health == 0) {
    }
    textFont(normalFont);
    textSize(30);
    text("Health: " + this.health, 900, 500);
  };
  this.drawLaser = function () {
    for (j = 0; j < lasersCount; j++) {
      lasers[j].draw();
    }
  };

  this.checkCollision = function () {
    s = second();
    timeRemaining = abs(3 - abs(ghostTime - s));
    if (timeRemaining == 0 && justHit) {
      justHit = false;
      ghostTime = 0;
    }
    if (!justHit) {
      for (var c = 0; c < cometCount; c++) {
        let cx = round(comets[c].getX());
        let cy = round(comets[c].getY());
        if (
          (this.x < cx + 40 &&
            this.x + 40 > cx &&
            this.y < cy + 40 &&
            this.y + 40 > cy) ||
          (this.x < cx - 40 &&
            this.x - 40 > cx &&
            this.y < cy - 20 &&
            this.y - 40 > cy)
        ) {
          //console.log(comets[c].getHealth());
          if (comets[c].getHealth()) {
            //check health
            if (this.health < 100&&!(comets[c].isCaught())) {
              multiplayer.player("health").start();
              this.health += 20;
              comets[c].catch();
            }
          } else if (comets[c].getSuper()) {
            //is super comet
            multiplayer.player("explosion").start();
            this.health = 0;
          } else {
            //console.log(this.health);
            if (this.health > 0) {
              multiplayer.player("shiphit").start();
              this.health = this.health - 20;
            }
            justHit = true;
            ghostTime = second();
          }
        }
      }
    }
  };
  this.kill = function(){
    this.health = 0;
  };
}

//LASER CLASS -------------------------
function Laser(x, y) {
  this.x = x;
  this.y = y;
  this.v = -1;
  this.laser = loadImage("cometInfoSprites.png");
  this.hit = false;

  this.draw = function () {
    if (this.x < 1080 && !this.hit) {
      push();
      translate(this.x, this.y - 10);
      image(this.laser, 0, 0, 80, 80, 0, 0, 80, 80);
      this.x += 10;
      pop();

      this.checkCollision();
    }
  };

  this.checkCollision = function () {
    for (var c = 0; c < cometCount; c++) {
      let cx = round(comets[c].getX());
      let cy = round(comets[c].getY());
      if (
        (this.x < cx + 20 &&
          this.x + 40 > cx &&
          this.y < cy + 40 &&
          this.y + 20 > cy) ||
        (this.x < cx - 40 &&
          this.x - 10 > cx &&
          this.y < cy - 50 &&
          this.y - 20 > cy)
      ) {
        explosionWait = second();
        if(!(comets[c].isExploded())){
          this.hit = true;
          score++;
        }
        comets[c].makeDie();
        //console.log(this.v);
      }
    }
  };
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
  inData = currentString;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//MUSIC CODE-----------------------------------------------------------------------
//---------------------------------------------------------------------------------
function make_poly() {
  // create synth
  let instrument = new Tone.PolySynth(Tone.FMSynth, 3);
  let synthJSON = {
    volume: 0,
    detune: 0,
    portamento: 0,
    harmonicity: 3,
    oscillator: {
      partialCount: 0,
      partials: [],
      phase: 0,
      type: "sine",
    },
    envelope: {
      attack: 0.01,
      attackCurve: "linear",
      decay: 0.2,
      decayCurve: "linear",
      release: 0.5,
      releaseCurve: "exponential",
      sustain: 1,
    },
    modulation: {
      partialCount: 0,
      partials: [],
      phase: 0,
      type: "square",
    },
    modulationEnvelope: {
      attack: 0.2,
      attackCurve: "linear",
      decay: 0.01,
      decayCurve: "linear",
      release: 0.5,
      releaseCurve: "exponential",
      sustain: 1,
    },
    modulationIndex: 12.22,
  };

  instrument.set(synthJSON);

  let effect1, effect2, effect3;

  // make connections
  instrument.connect(vol);

  // define deep dispose function
  function deep_dispose() {
    if (instrument != undefined && instrument != null) {
      instrument.dispose();
      instrument = null;
    }
  }

  return {
    instrument: instrument,
    deep_dispose: deep_dispose,
  };
};


function make_space_synth(){
  // create synth
  let instrument = new Tone.PolySynth(Tone.AMSynth, 3);
  let synthJSON = {
    "volume": 0,
    "detune": 0,
    "portamento": 0,
    "harmonicity": 3,
    "oscillator": {
      "partialCount": 0,
      "partials": [],
      "phase": 0,
      "type": "sine4"
    },
    "envelope": {
      "attack": 0.01,
      "attackCurve": "linear",
      "decay": 0.2,
      "decayCurve": "linear",
      "release": 0.5,
      "releaseCurve": "exponential",
      "sustain": 1
    },
    "modulation": {
      "partialCount": 0,
      "partials": [],
      "phase": 0,
      "type": "square"
    },
    "modulationEnvelope": {
      "attack": 0.2,
      "attackCurve": "linear",
      "decay": 0.01,
      "decayCurve": "linear",
      "release": 0.5,
      "releaseCurve": "exponential",
      "sustain": 1
    },
    "modulationIndex": 12.22
  };

  instrument.set(synthJSON);

  let effect1, effect2, effect3;

  // make connections
  instrument.connect(vol);

  // define deep dispose function
  function deep_dispose() {
    if (instrument != undefined && instrument != null) {
      instrument.dispose();
      instrument = null;
    }
  }

  return {
    instrument: instrument,
    deep_dispose: deep_dispose,
  };
};
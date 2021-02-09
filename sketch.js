var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundImage, backgroundSprite;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var PLAY = 1;
var END = 0;
var score;
var gameState;
var gameOver, restart, gameOverImage, restartImage;
var dieSound, jumpSound;
var cameraVelocityY = 0;
var count, deathCount;


function preload(){
  backgroundImage = loadImage("images/background.png");

  trex_running = loadAnimation("images/trex1.png","images/trex3.png","images/trex4.png");
  trex_collided = loadImage("images/trex_collided.png");

  backgroundSprite = createSprite(1,1,200,0);
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  gameOverImage = loadImage("images/gameOver.png");
  restartImage = loadImage("images/restart.png");

  dieSound = loadSound("sounds/die.mp3");
  jumpSound = loadSound("sounds/jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  gameState = PLAY;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;

  backgroundSprite.addImage(backgroundImage);
  backgroundSprite.scale = 1;
  backgroundSprite.x = 500;
  backgroundSprite.y = -35;
  
  ground = createSprite(200,180,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  restart = createSprite(300,120);
  restart.addImage(restartImage);
  restart.visible = false;
  restart.scale = 0.55;
  gameOver = createSprite(300,75);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
  
  score = 0;
}

function draw() {
  background("white");
  ground.velocityX = -(4 + 2*score/100);
  backgroundSprite.velocityX = -(4 + 2*score/100);
  count = frameCount;
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    cameraVelocityY = 0;

    camera.position.x = trex.x + 250;
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (backgroundSprite.x < 100){
      backgroundSprite.x = backgroundSprite.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.collide(invisibleGround)){
    trex.velocityY = -17;
    jumpSound.play();
  }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.4;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      cameraVelocityY = 5;
      deathCount = count;
    }
  }else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    backgroundSprite.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  
    if(frameCount % 1 === 0 && deathCount >= count - 15){
    cameraVelocityY *= -1;
    camera.position.y += cameraVelocityY;
    }else{
      camera.position.y = 100;
    }
  
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  drawSprites();
  text("Score: "+ score, 500,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(4+2*score/100);
    obstacle.scale = 0.7;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
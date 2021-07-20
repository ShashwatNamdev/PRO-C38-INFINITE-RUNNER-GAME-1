var man, manRunningImage, manCollidedImage;
var wolf,wolfWalkingImage, wolfStopingImg;
var ground, groundImg;
var invisibleGround;
var obstaclesGroup, obstacle, obstacle1, obstacle2, obstacle3;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score=0;
var gameOver, restart;

function preload(){
  manRunningImage = loadAnimation("Images/runningMan1.jpg","Images/runningMan2.jpg","Images/runningMan3.jpg","Images/runningMan4.jpg","Images/runningMan5.jpg","Images/runningMan6.jpg",);
  manCollidedImage = loadImage("Images/runningMan7.jpg");
  wolfWalkingImage = loadAnimation("Images/wolf1.png","Images/wolf2.png","Images/wolf3.png","Images/wolf4.png","Images/wolf5.png","Images/wolf6.png",);
  wolfStopingImage = loadImage("Images/wolf7.png",);
  groundImage = loadImage("Images/groundImg.png");
  obstacle1 = loadImage("Images/obstacleImg_1.png");
  obstacle2 = loadImage("Images/obstacleImg_2.png");
  obstacle3 = loadImage("Images/obstacleImg_3.png");
  
  gameOverImage = loadImage("Images/gameoverImg.png");
  restartImage = loadImage("Images/restartImg.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  ground = createSprite(width /2,height/2,windowWidth,windowHeight);
  ground.addImage("ground",groundImage);
  ground.scale = 2.5;
  
  man = createSprite(400,480,20,20);
  man.x = ground.x/1.2;
  man.y = ground.y*1.45;
  man.addAnimation("running", manRunningImage);
  man.scale = 1.5;
  // man.debug = true;
  // man.setCollider("rectangle",0,0,100,200);
  
  wolf = createSprite(100,480,20,20);
  wolf.x = ground.x/4;
  wolf.y = ground.y*1.45;
  wolf.addAnimation("walking",wolfWalkingImage);
  wolf.scale = 1.5;
  // wolf.debug = true;
  // wolf.setCollider("rectangle",0,0,200,50);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-100);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
  
  restart = createSprite(windowWidth/2,windowHeight/2-35);
  restart.addImage(restartImage);
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,windowHeight/1.5,windowWidth,10);
  invisibleGround.y = ground.y*1.58
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
}

function draw() {
  background(218,214,172);
  
  // camera.position.x = man.x;
  camera.position.y = man.y;
  
  if(gameState===PLAY){
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(8 + 3*score/150);
    
    if(keyDown("space") && man.collide(invisibleGround)) {
      man.velocityY = -23;
    }
    if(obstaclesGroup.isTouching(wolf)){
      wolf.velocityY = -20;
    }
    man.velocityY = man.velocityY + 1;
    wolf.velocityY = wolf.velocityY + 1;
    wolf.x = windowWidth/7;
    
    if (ground.x < 450){
      ground.x = width-450;
    }
    
    createObstacles();
    
    if(obstaclesGroup.isTouching(man)){
        gameState = END;
    }
  }
  else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    man.velocityY = 0;
    wolf.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    man.addImage("manCollided",manCollidedImage);
    man.changeImage("manCollided");
    wolf.addImage("wolfStop",wolfStopingImage);
    wolf.changeImage("wolfStop");
    wolf.x = man.x-70;
    wolf.y = man.y;
    obstaclesGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  man.collide(invisibleGround);
  wolf.collide(invisibleGround);
  drawSprites();
  textSize(20);
  fill(0);
  text("Score: "+ score,windowWidth/2,windowHeight/15);
  text("Press 'Space' key to jump Man",windowWidth/2,windowHeight/30);
}

function createObstacles() {
  if(frameCount % 90 === 0){
    var obstacle = createSprite(windowWidth*2,windowHeight/1.4,10,40);
    // obstacle.debug = true;
    obstacle.velocityX = -(8 + 3*score/150);
    
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    obstacle.scale = 0.4;
    if(obstacle.x<-500){
      obstacle.lifetime = 300;
    }
    obstacle.setCollider("rectangle",0,0,300,160);
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  wolf.x = ground.x/4;
  
  obstaclesGroup.destroyEach();
  
  man.changeAnimation("running");
  wolf.changeAnimation("walking");
  score = 0;
}
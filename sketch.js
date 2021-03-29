var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count = 0;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  backgroundImg = loadImage("back.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(windowWidth - windowWidth/4,windowHeight - 60,20,50);
  trex.addAnimation("running", trex_running);

  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.9;
  
  ground = createSprite(trex.x - 200,windowHeight - 50);
  ground.scale = 4;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;

  restart = createSprite(windowWidth/2,gameOver.y + 100);
  restart.addImage(restartImg);
  restart.scale = 1.5;
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,windowHeight - 50,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);

  gameOver.x = trex.x;
  restart.x = trex.x;


  trex.velocityX = 3;
  invisibleGround.x = trex.x ;

  //displaying score
  push()
  fill("green");
  textSize(30);
  text("Score: "+ score, trex.x + 600,50);
  pop()
  
  console.log("this is game state" + gameState);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX =  -(2 + score/200);
    
    //ground.velocityX = -(4 + 3* score/100);
    // ground.velocityX = 0
    //scoring
    score = score + Math.round(getFrameRate()/60);
    // console.log(getFrameRate()); 
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (frameCount%190 === 0){
      ground.x = trex.x + 450;
    }
    if(frameCount%200 === 0){
      ground.x = ground.x + count;
    }
     if(frameCount%100 === 0){
       count += 30;
     }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      trex.velocityX = 0;
      ground.velocityX = 0;
      trex.changeAnimation("collided",trex_collided);
     if(mousePressedOver(restart)) {
      reset();
    }
     
     //change the trex animation
      
   
     
     
     
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();

  fill("blue");
  text(mouseX + " " + mouseY,mouseX,mouseY);


  camera.x = trex.x;
  // camera.y = trex.y/2 + 30;

}

function reset(){
 gameState = PLAY; 
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  console.log("in reset");
  trex.changeAnimation("running",trex_running);
}


function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(trex.x + windowWidth/2,windowHeight - 80,10,40);
   obstacle.velocityX = -(2 + score/200);
   //obstacle.velocityX = 0;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 1.2
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
    obstacle.scale = 0.085;
    obstacle.lifetime = 350;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(trex.x + 800,400,40,10);
    cloud.y = Math.round(random(200,350));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -1;
    //cloud.velocityX = 0;
     //assign lifetime to the variable
    cloud.lifetime = 700;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


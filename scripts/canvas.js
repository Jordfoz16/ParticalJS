
//Canvas Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;
var heightBound = height - 60;

//Mute image Variables
var muteImage = new Image();
muteImage.src = 'images/mute.png';

//Start screen Variables
var atStartScreen = true;


var atHelp = false;
var neutronPlaced = false;
var neutronFired = false;
var placedNeutron;

//Mouse input Variables
var mouseX;
var mouseY;

//Particle array and Particle Effect array
var particleArray = new Array();
var effectsArray = new Array();

//Frame counter Variables
var timer = Date.now();
var frames = 0;
var FPS = 0;

//Speed controls and Energy Variables
var speed = 1;
var isPaused = false;
var tempSpeed = 0;
var energy = 0;

canvasLoop();

function canvasLoop(){
    //Main canvas loop that refreshes the screen was a black rectangle
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);
    
    canvasPos = $("#game-container").position();
    canvasMarginLeft = $("#game-container").css("margin-left");
    canvasMarginTop = $("#game-container").css("margin-top");
    canvasMarginLeft = parseInt(canvasMarginLeft.substr(0, canvasMarginLeft.length-2));
    canvasMarginTop = parseInt(canvasMarginTop.substr(0, canvasMarginTop.length-2));
    particlePosAdjustX = canvasMarginLeft + canvasPos.left;
    particlePosAdjustY = canvasMarginTop + canvasPos.top;
    
    //updateParticles method draws, moves and calculates collisions
    updateParticles();
    
    //Draws the mute image if sound is muted
    if(mute == true) ctx.drawImage(muteImage, 10, 10);
    
    //Shows the start screen or the infomation screen if not at start screen
    if(atStartScreen){
        startScreen();  
               
    }else{
        infomation();
                    

    }
    
    //Calls the canvasLoop method to refresh the canvas
    requestAnimationFrame(canvasLoop);
}
//sams get mouse position relative to window size



////////////////////////////////////////////////////
//Particle Control
////////////////////////////////////////////////////

/*
    updateParticles does four main tasks for particles these 
    are to draw, move, collision, remove. In the order of:
    -Remove
    -Collision
    -Draw
    -Move
    
    Then three main tasks for particles effects which are draw, move, remove.
    In the order of:
    -Remove
    -Draw
    -Move
*/

function updateParticles(){
    
    //Removes particle from array of the isRemoved boolean is set to true
    for(var i = 0; i < particleArray.length; i++){
        if(particleArray[i].isRemoved){
            particleArray.splice(i, 1);   
        }
    }
    
    //Checks for collisions unless it is paused
    for(var i = 0; i < particleArray.length; i++){
        if(isPaused) break;
        particleArray[i].collision();
    }
    
    //Draws the particles and moves them is its not paused
    for(var i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        if(isPaused) continue;
        particleArray[i].move();
    }
    
	//Removes the effect if the isRemoved boolean is set to true
	for(var i = 0; i < effectsArray.length; i++){
		if(effectsArray[i].isRemoved) effectsArray.splice(i, 1);
	}
	
    //Draws the effect and moves them is its not paused
	for(var i = 0; i < effectsArray.length; i++){
		effectsArray[i].draw();
        if(isPaused) continue;
		effectsArray[i].move();
	}
    
    //Adds one to the frame counter
    frames++;
}

/*
    This methode is used to add particles to the screen and
    checks to see if it will overlap other particles. Does this
    by finding the distance between each particle.
*/

function checkForParticle(particle, velocity){
    var particleFound = false;
    var randomX;
    var randomY;
    var randVelX = 0;
    var randVelY = 0;
    var checkCounter = 0;

    do{
        //Sets random X and Y positions
        randomX = Math.floor(Math.random() * (width - 100)) + 50;
        randomY = Math.floor(Math.random() * (heightBound - 100)) + 50;
        
        //If you want a random velocity then it can be added
        if(velocity == true){
            randVelX = Math.random() - 0.5;
            randVelY = Math.random() - 0.5;
        }
        
        for(var i = 0; i < particleArray.length; i++){
            //Works out the distance between the particles
            var xDist = randomX - particleArray[i].xPos;
            var yDist = randomY - particleArray[i].yPos;
            var distance = Math.sqrt((xDist * xDist) + (yDist * yDist));
            //If it less than the radius + 50
            if(distance < particleArray[i].radius + 50){
                //Then it will break the loop and get new random X and Y
                particleFound = true;
                break;
            }else{
                //Else it will set particleFound to false and stop the do while loop
                particleFound = false;
            }
        }
        checkCounter++;
    }while(particleFound);
    
    //It will only add the particle if it found a space in the first 100 attempts
    if(checkCounter < 100){
        new particle(randomX, randomY, randVelX, randVelY);
    }
            
}

/*
    removeAll method will call each particles remove function
    so in the next update it will get removed
*/

function removeAll(){
    for(var i = 0; i < particleArray.length; i++){
        particleArray[i].remove();
    }
    //Resets varibles so that everything can be placed again
    neutronPlaced = false;
    neutronFired = false;
    energy = 0;
    uraniumCount = 0;
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
//Start Screen
////////////////////////////////////////////////////

//Varible for adding random particles to the start screen
var randomParticlsRan = false;

/*
    The startScreen method rans all of the other methods to
    create a start screen for the interactive surface, like
    adding buttons, text and background particles
*/

$('#start-button').click(function(){
    
    
            removeAll();
            atStartScreen = false;
          
            $( "#start-button" ).css({"visibility": "hidden"});

        $( "#Title-description" ).css({"visibility": "hidden"});
      $( "#info-description" ).css({"visibility": "hidden"});
          $( "#myCanvas" ).css({'filter': "Blur(0px)"});
    

})



function startScreen(){

	
	
		//This is a breif intro to the interactive surface
 
    
    //Draws both buttons to the screen

	
    //Adds 60 random particles to the start screen
    addRandomParticles(60);
}

/*
    addRandomParticles is used to add particles to the background
    of the start screen, it uses the checkForParticle method to
    stop the particles from being placed on top of each other.
    Than sets a randomParticlsRan to true so its not ran twice
*/

function addRandomParticles(amount){
    if(randomParticlsRan == false){
        for(var i = 0; i < amount; i++){
            checkForParticle(krypton, true);
            checkForParticle(barium, true);
        }
        randomParticlsRan = true;
    }
}

/*
    addButton creates a button with a hit region
    so that it changes colour when the mouse rolls over it
    and changes screen when click on. It also adds text to the
    button and can be centered with the offsets
*/


////////////////////////////////////////////////////
//Particle Effects
////////////////////////////////////////////////////

/*
    addEffect is a method to add particle effects to when energy is
    added theses are the yellow explosion effect. It gives each a
    random x and y velocity and starting postion of the particles
*/

function addEffect(particle, amount){
	var xPos = particle.xPos;
	var yPos = particle.yPos;
	
	for(var i = 0; i < amount; i++){
		new hitEffect(xPos, yPos, (Math.random() * maxVelocity) - maxVelocity/2, (Math.random() * maxVelocity) - maxVelocity/2);
	}
}

////////////////////////////////////////////////////
//Uranium Control
////////////////////////////////////////////////////

var uraniumCount = 0;

/*
    addUranium adds uranium to the screen and calls the
    checkForParticle method to place it in an area with no
    other particles
*/

function addUranium(){
    if(uraniumCount < 70){
        checkForParticle(uranium, false);
        uraniumCount++;
    }
}

/*
    removeUranium will search the particle array for a
    uranium particle and then remove it from the array
*/

function removeUranium(){
    var found = false;
    var index = 0;
    
    if(uraniumCount > 0){
        while(!found){
            if(particleArray[index].name == "uranium"){
                particleArray[index].remove();
                uraniumCount--;
                found = true;
            }
            index++;
            if(index > particleArray.length) break;
        }
    }
}

/*
    collisionUranium is ran when a neutron and a uranium particle
    collide. It adds three neutrons which random velocites and adds particle effects,
    adds akrypton and barium particle with random velocites and then removes the
    uranium particle
*/

function collisionUranium(particle){
    var radius = particle.radius + 20;
	
    //Adds the three neutrons
    for(var i = 0; i < 3; i++){
        var angle = (Math.random() * (Math.PI * 2));
        var xPos = Math.cos(angle) * radius + particle.xPos;
        var yPos = Math.sin(angle) * radius + particle.yPos;
        var xVel = Math.cos(angle) * Math.random() * maxVelocity;
        var yVel = Math.sin(angle) * Math.random() * maxVelocity;
        new neutron(xPos, yPos, xVel, yVel);
    } 
	
    //Adds particle effects
	addEffect(particle, Math.floor(Math.random() * 20) + 10);
    
    //Adds the krypton particle
    var xVel = (Math.random() * 0.5) - 0.5;
    var yVel = (Math.random() * 0.5) - 0.5;
    new krypton(particle.xPos + 5, particle.yPos + 5, xVel, yVel);
    
    //Adds the barium particle
    xVel = (Math.random() * 0.5);
    yVel = (Math.random() * 0.5);
    new barium(particle.xPos - 5, particle.yPos - 5, xVel, yVel);
	
    //removes the uranium particle
    particle.remove();
    uraniumCount--;
}

////////////////////////////////////////////////////
//Utilities
////////////////////////////////////////////////////

/*
    Displays the infomation for the interactive surface
    it displays the FPS, Number of particles, Speed and Energy.
    Also it draws a line to aim the neutron when it is getting fired
*/

function infomation(){
    //Draws the aiming line
    if(neutronPlaced && neutronFired == false){
        drawLine(placedNeutron.xPos, placedNeutron.yPos, mouseX-particlePosAdjustX, mouseY-particlePosAdjustY);
    }
    
    //Shows the infomation for the interactive surface
    printText("FPS: " + FPS, 30, height - 20);
    printText("Number of Particles: " + particleArray.length, 220, height - 20);
    if(speed == 0){
        printText("Speed: Paused", 530, height - 20);
    }else{
        printText("Speed: x" + (1/speed).toFixed(3), 530, height - 20);
    }
    printText("Released Energy: " + energy + "MeV", 760, height - 20);
    
    //Shows the controls
	
    //Shows the frames after a second and then resets the frames
    if(Date.now() - timer > 1000){
        FPS = frames;
        frames = 0;
        timer += 1000;
    }
}

/*
    showHelp just shows all of the conrols for the interactive surface.
*/


function printText(mesg, xPos, yPos){
    ctx.fillStyle = 'white';
    ctx.font = "18px Arial";
    ctx.fillText(mesg, xPos, yPos);
}


function drawLine(startX, startY, endX, endY){
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function addEnergy(){
    energy += Math.floor((Math.random() * 15) + 200);
}

////////////////////////////////////////////////////
//Keyboard and Mouse Input
////////////////////////////////////////////////////

//Adds a keydown event listener
document.addEventListener('keydown', function(event){
    
    //Keycode 77 = 'm'
    if(event.keyCode == 77){
        if(mute == true){
            mute = false;   
        }else{
            mute = true;
        }
    }
    
    if(atStartScreen == false){
        //Keycode 73 = 'i'
        if(event.keyCode == 73) addUranium();
        //Keycode 75 = 'k'
        if(event.keyCode == 75) removeUranium();
        //Keycode 82 = 'r'
        if(event.keyCode == 82){
            removeAll();
        }
		//Keycode 65 = 'a'
		if(event.keyCode == 65){
			for(var i = 0; i < 65; i++){
				addUranium();
			}
		}
		
		//Keycode 72 == 'h'
		if(event.keyCode == 72){
			if(atHelp){
				atHelp = false;
			}else{
				atHelp = true;
			}
		}
		
        if(!isPaused){
            //Keycode 190 = '.'
            if(event.keyCode == 190){
                if(speed != 1) speed--;
            }
            //Keycode 188 = ','
            if(event.keyCode == 188){ 
                if(speed != 50) speed++;
            }
        }
        
        //Keycode 80 = 'p'
        if(event.keyCode == 80){
            if(isPaused == true){
                isPaused = false;
                speed = tempSpeed;
            }else{
                isPaused = true;
                tempSpeed = speed;
                speed = 0;
            }
        }
        
        //Keycode 27 == 'esc'
        if(event.keyCode == 27){
            removeAll();
			randomParticlsRan = false;
            neutronFired = false;
            neutronPlaced = false;
            atStartScreen = true;
           $( "#start-button" ).css({"visibility": "visible"});
             
    

        $( "#Title-description" ).css({"visibility": "visible"});
      $( "#info-description" ).css({"visibility": "visible"});
          $( "#myCanvas" ).css({'filter': "Blur(5px)"});
    
           
        }
        
        
    }
});

//Adds mouse down event listener
canvas.addEventListener('mousedown', function(event){
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    
    
    
    //Place a neutron where the mouse is click then fires a second click
    if(atStartScreen == false){
        if(!neutronPlaced){
            placedNeutron = new neutron(mouseX-particlePosAdjustX, mouseY-particlePosAdjustY, 0, 0);
            lastX = mouseX;
            lastY = mouseY;
            neutronPlaced = true;
        }else if (!neutronFired){
            var angle = Math.atan2((mouseY - lastY), (mouseX - lastX));
            var xVel = Math.cos(angle) * maxVelocity;
            var yVel = Math.sin(angle) * maxVelocity;
            placedNeutron.setVelocity(xVel, yVel);
            addEffect(placedNeutron, 10);
            neutronFired = true;
        }
    }
	
    //Uses the hit regions to create buttons DDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS

});

canvas.addEventListener('mousemove', function(event){
    //Gets x and y to draw the aiming line
    if(neutronPlaced == true){
        mouseX = event.clientX ;
        mouseY = event.clientY;
    }
    
    //Uses hit region to create a roll over button

});

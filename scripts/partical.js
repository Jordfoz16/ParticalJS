var mute = false;

var maxVelocity = 40;

/*
    The neutron, uranium, krypton, barium functions are all
    templates for creating particles so they contain radius, mass,
    colour.
*/
function neutron(xPos, yPos, xVel, yVel){
    var radius = 3;
    var mass = 4;
    newNeutron = new particle(xPos, yPos, radius, mass, "neutron");
    newNeutron.setColour("#3366ff");
    newNeutron.setVelocity(xVel, yVel);
    return newNeutron;
}

function uranium(xPos, yPos, xVel, yVel){
    var radius = 23;
    var mass = 2500;
    newUranium = new particle(xPos, yPos, radius, mass, "uranium");
	newUranium.periodic("Ur");
    newUranium.setColour("#33cc33");
    newUranium.setVelocity(xVel, yVel);
    return newUranium;
}

function krypton(xPos, yPos, xVel, yVel){
    var radius = 9;
    var mass = 1000;
    newKyrpton = new particle(xPos, yPos, radius, mass, "kyrpton");
	newKyrpton.periodic("Kr");
    newKyrpton.setColour("#9966ff");
    newKyrpton.setVelocity(xVel, yVel);
    return newKyrpton;
}

function barium(xPos, yPos, xVel, yVel){
    var radius = 14;
    var mass = 1400;
    newBarium = new particle(xPos, yPos, radius, mass, "barium");
	newBarium.periodic("Ba");
    newBarium.setColour("#ff9933");
    newBarium.setVelocity(xVel, yVel);
    return newBarium;
}

/*
    particle is an object for creating different particles
*/

function particle(xPos, yPos, radius, mass, name){
    this.name = name;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    
    this.xVel = 0;
    this.yVel = 0;
    
	this.periodicValue = 'NaN';
    this.mass = mass;
    this.colour = 'black';
    this.isRemoved = false;
	
    //Creates a sound object
	this.audioPop = new Audio('sounds/pop.mp3');
	this.audioPop.volume = 0.2;
	
    //Adds the particle to a particle array
    particleArray.push(this);
    
    /*
        Draws the particle to the canvas and adds the periodic symbol
        to the particles centre
    */
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
		
        //Adds the periodic symbol to the particle
		if(this.periodicValue != 'NaN'){
			ctx.fillStyle = 'black';
			ctx.font = "12px Arial";
			ctx.fillText(this.periodicValue, this.xPos - 6, this.yPos + 3, this.radius * 2);
		}
    };
    
    /*
        Moves the particle in its current velocity and checks for the wall collision.
        The velocity are divied by the speed to slow the particles when the speed it changed
    */
    this.move = function(){
        if((this.xPos - this.radius) < 0 || (this.xPos + this.radius) >= width)
            this.xVel *= -1;
        if((this.yPos - this.radius) < 0 || (this.yPos + this.radius) >= heightBound)
            this.yVel *= -1;

        this.xPos += this.xVel / speed;
        this.yPos += this.yVel / speed;
    };
    
    /*
        Checks for a collision between two particles. First for performance it
        adds a rectangle around the particle and checks for a collision between the
        rectangles takes less time that checking for circle collisions. If there is a
        collision between the rectangles then pythagoras is used to find the distance
        between the centers if thats less then both radius added together then there is
        collision between two particles.
        It then calls a function to calculates the new velocities
    */
    this.collision = function(){
        for(var i = 0; i < particleArray.length; i++){
            if(particleArray[i] != this){
                //Checks to see if two rectangles around the particles collide
                if(this.xPos + this.radius + particleArray[i].radius > particleArray[i].xPos
                && this.xPos < particleArray[i].xPos + this.radius + particleArray[i].radius
                && this.yPos + this.radius + particleArray[i].yPos > particleArray[i].yPos
                && this.yPos < particleArray[i].yPos + this.radius + particleArray[i].radius){
                    
                    //Then checks the distance between the centre of each particle
                    var xDist = this.xPos - particleArray[i].xPos;
                    var yDist = this.yPos - particleArray[i].yPos;
                    var distance = Math.sqrt((xDist * xDist) + (yDist * yDist));
                    
                    if(distance < this.radius + particleArray[i].radius){
                        //Particles have collided
                        
                        //Check for a Uranium and Neutron collision
                        if(this.name == 'uranium' && particleArray[i].name == 'neutron'){
                            if(!mute) this.audioPop.play();
							particleArray[i].remove();
                            collisionUranium(this);
                            addEnergy();
                        } 
                        
                        if(this.name == 'neutron' && particleArray[i].name == 'uranium'){
                            if(!mute) this.audioPop.play();
							this.remove();
							collisionUranium(particleArray[i]);
                            addEnergy();
                        }
                        //Calculates the new velocities
                        this.calcVelocities(particleArray[i]);
                    }
                }
            }
        }
    };
    
    /*
        This function calculates the new velocity after two particles
        have collided, It takes in to account the mass of both of the
        particles. It then moves the particle by the new velocity to
        try an prevent two particles from overlaping
    */
    
    this.calcVelocities = function(hitParticle){
        var xVel1 = (this.xVel * (this.mass - hitParticle.mass) + (2 * hitParticle.mass * hitParticle.xVel)) / (this.mass + hitParticle.mass);
        var yVel1 = (this.yVel * (this.mass - hitParticle.mass) + (2 * hitParticle.mass * hitParticle.yVel)) / (this.mass + hitParticle.mass);
        
        var xVel2 = (hitParticle.xVel * (hitParticle.mass - this.mass) + (2 * this.mass * this.xVel)) / (this.mass + hitParticle.mass);
        var yVel2 = (hitParticle.yVel * (hitParticle.mass - this.mass) + (2 * this.mass * this.yVel)) / (this.mass + hitParticle.mass);
        
        this.xVel = xVel1;
        this.yVel = yVel1;
        hitParticle.xVel = xVel2;
        hitParticle.yVel = yVel2;
        
        this.xPos += this.xVel / speed;
        this.yPos += this.yVel / speed;
        hitParticle.xPos += hitParticle.xVel / speed;
        hitParticle.yPos += hitParticle.yVel / speed;
    };
	
    //Periodic adds the periodic value to the centre of the particle
	this.periodic = function(value){
		this.periodicValue = value;
	};
    
    //Set the isRemoved to true so that the particle is removed
    this.remove = function(){
        this.isRemoved = true;  
    };
    
    //Used to change the colour of the particle
    this.setColour = function(colour){
        this.colour = colour;
    };
    
    //Sets both of the velocities
    this.setVelocity = function(xVel, yVel){
        this.xVel = xVel;
        this.yVel = yVel;
    };
}
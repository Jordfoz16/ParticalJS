/*
    Used to create a particle effect object
*/

function hitEffect(xPos, yPos, xVel, yVel){
	this.xPos = xPos;
	this.yPos = yPos;
	this.xVel = xVel;
	this.yVel = yVel;
	
	this.colour = 'yellow';
    
    //Sets a random life span to make then disappear at random times
	this.life = Math.floor((Math.random() * 10)) + 5;
	this.lifeCounter = 0;
	this.isRemoved = false;
	
    //Adds the object to the effects array
	effectsArray.push(this);
	
    //Draws the effect onto the canvas
	this.draw = function(){
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.xPos, this.yPos, 2, 2);
	};
	
    //Moves the effect by its velocity and divied by the speed
	this.move = function(){
		this.xPos += this.xVel / speed;
		this.yPos += this.yVel / speed;
		
        //Removes the object once its come to the end of its life
		this.lifeCounter++;
		if(this.lifeCounter > this.life * speed) this.remove();
	};
	
    //Used to remove the effect
	this.remove = function(){
		this.isRemoved = true;
	};
}
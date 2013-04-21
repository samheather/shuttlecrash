function Shuttle(gs) {
	this.type = 'shuttle';
	
	// constants
	var scaleFactor = 0.2;
	var MAX_VY = 20;
	var MAX_VX = 100;
	var groundDrag = 0.2;
	var attackAngleDescent = -2;
	
	//variables
	var length = 65;
	var wingSpan = 30;
	var airBrakeOnDecent = 10;
	var attackAngle = -19;
	var previousAttackAngle = -19;
	var surfaceArea = 100;
		
	// velocity
	var vx = 0;
	var vy = 0;
	var pos = this.pos = [0,0];
	
	var sprites = new Sprite(
		["center", "bottom"], 
		{
			stopped: [["assets/spaceShuttle.png", 0]], 
			falling:[["assets/spaceShuttleFlame1.png",0], ["assets/spaceShuttleFlame2.png",1], ["assets/spaceShuttleFlame3.png",2], ["assets/spaceShuttleFlame4.png",3]]
		}, 
		function() {}, 
		scaleFactor);
	
	statemachine(this);
	
	this.setWorld = function(world) {
		this.world = world;
	}
	
	
	this.init = function () {
		sprites.action("stopped");
		pos= [sprites.get_size()[0]/2+20, sprites.get_size()[1]];
		sprites.angle(attackAngle*Math.PI/180);
		//this.set_state("stopped"); @TODO after menu impelementation
		this.set_state("falling");
	}
	
	this.stopped_init = function() {
		sprites.action("stopped");
		sprites.angle(attackAngle*Math.PI/180);
	}
	
	this.falling_init = function() {
		sprites.action("falling");
		sprites.angle(attackAngle*Math.PI/180);
	}
	
	this.landed_init = function() {
		sprites.action("stopped");
		sprites.angle(attackAngle*Math.PI/180);
	}
	
	this.rolling_init = function() {
		//OPEN PARACHUTES HERE
		sprites.action("stopped");
	}
	
	this.landed_init = function() {
		sprites.action("stopped");
		//call game state machine for landing @TODO
	}
	
		
	this.draw = function(c) {
		sprites.angle(attackAngle*Math.PI/180);
		sprites.update(); //posible performance issue			

		sprites.draw(c, world.camera(pos));
	}
				
	this.falling_update = function() {		
		vy = Math.min(vy + (world.gravity), MAX_VY);
		vx = Math.min(vx + 0.4, MAX_VX); //this should take into acount air drag and things @TODO

		var angleOffsetFromGround =0.05*sprites.get_size()[0]*Math.sin(Math.abs(attackAngle*Math.PI/180));
		
		if(vy > gs.height-pos[1]-world.groundHeight-angleOffsetFromGround){
			pos[1] = gs.height-world.groundHeight-angleOffsetFromGround;
			this.set_state("rolling");
		} else if (vy < gs.height-world.groundHeight-pos[1]-angleOffsetFromGround) {
			pos[0] += vx;
			pos[1] += vy;
		} 
	}
		
	this.rolling_update = function() {
		vy = 0;
		
		if (attackAngle > attackAngleDescent) { //it is reversed because it's negative
			attackAngle = 0;
		} else {
			attackAngle -= attackAngleDescent;	
		}
		
		var previousAngleOffsetFromGround =0.05*sprites.get_size()[0]*Math.sin(Math.abs(previousAttackAngle*Math.PI/180));
		var angleOffsetFromGround =0.05*sprites.get_size()[0]*Math.sin(Math.abs(attackAngle*Math.PI/180));
			
		var currentOffsetFromGroundOffset = previousAngleOffsetFromGround - angleOffsetFromGround;
					
		previousAttackAngle = attackAngle;

		if(vx > groundDrag) {
			vx -= groundDrag
		} else {
			vx =0;
		}
		
		pos[0] += vx;
		pos[1] += currentOffsetFromGroundOffset
				
		if(vx == 0 && attackAngle == 0) {
			this.set_state("landed");
		}
	}

}

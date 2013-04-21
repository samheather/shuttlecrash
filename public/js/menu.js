/* World */
function Menu(gs) {
// 	world.c.addText("Hello World");
	
	/* mouse/finger detection */
	
	this.draw = function(c) {
	c.fillStyle = "#000000";//Color
	c.font = "12pt Calibri";
	lengthString = "Ship Length:" + this.shuttle.getLength().toString();
	c.fillText(lengthString, 210, 25);
	
	c.fillStyle = "#000000";//Color
	c.font = "12pt Calibri";
	lengthString = "Wing Span:" + this.shuttle.getWingSpan().toString();
	c.fillText(lengthString, 330, 25);
	
	c.fillStyle = "#000000";//Color
	c.font = "12pt Calibri";
	lengthString = "Air Brakes (Descent):" + this.shuttle.getAirBrakeOnDecent().toString();
	c.fillText(lengthString, 445, 25);
	
	c.fillStyle = "#000000";//Color
	c.font = "12pt Calibri";
	lengthString = "Attack Angle:" + this.shuttle.getAttackAngle().toString();
	c.fillText(lengthString, 615, 25);
	
	c.fillStyle = "#000000";//Color
	c.font = "12pt Calibri";
	lengthString = "Surface Area:" + this.shuttle.getSurfaceArea().toString();
	c.fillText(lengthString, 725, 25);
	


	}

	this.setWorld = function(world) {
		this.world = world;
	}
	
	this.setShuttle = function(shuttle) {
		this.shuttle = shuttle;
	}
	
	// STATAES
	
	this.init = function () {
		//Menu initialised
	}
	
	this.closed_init = function() {
		//Menu closed
	}
	
	this.open_init = function() {
		//Menu opened
	}
	
	// Key presses:
	
	this.keyDown_81 = function() {
		this.shuttle.setLength(this.shuttle.getLength()-1);
	}
	
	this.keyDown_87 = function() {
		this.shuttle.setLength(this.shuttle.getLength()+1);
	}
	
	this.keyDown_69 = function() {
		this.shuttle.setWingSpan(this.shuttle.getWingSpan()-1);
	}
	
	this.keyDown_82 = function() {
		this.shuttle.setWingSpan(this.shuttle.getWingSpan()+1);
	}
	
	this.keyDown_84 = function() {
		this.shuttle.setAirBrakeOnDecent(this.shuttle.getAirBrakeOnDecent()-1);
	}
	
	this.keyDown_89 = function() {
		this.shuttle.setAirBrakeOnDecent(this.shuttle.getAirBrakeOnDecent()+1);
	}
	
	this.keyDown_85 = function() {
		this.shuttle.setAttackAngle(this.shuttle.getAttackAngle()-1);
	}
	
	this.keyDown_73 = function() {
		this.shuttle.setAttackAngle(this.shuttle.getAttackAngle()+1);
	}
	
	this.keyDown_79 = function() {
		this.shuttle.setSurfaceArea(this.shuttle.getSurfaceArea()-1);
	}
	
	this.keyDown_80 = function() {
		this.shuttle.setSurfaceArea(this.shuttle.getSurfaceArea()+1);
	}
	
	// END STATES

// 	this.pointerDown = function() {
// 		if (gs.pointerPosition[0] < gs.width / 2) {
// 			shuttle.keyDown_37();
// 		} else {
// 			shuttle.keyDown_39();
// 		}
// 	}
// 	
// 	this.pointerUp = function() {
// 		shuttle.keyUp_37();
// 	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	// remove a platform from the world
	this.remove = function(which) {
		platforms.remove(which);
		gs.delEntity(which);
	}
}
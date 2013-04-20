/* World */
function World(gs) {
	// how much gravity to apply to objects each frame
	this.gravity = 0.4;
	// how fast the props etc. should move upwards
	//this.upspeed = 1; //0.09;
	// where the camera is centered
	this.cpos = gs.width / 2;
	// how far has the user progressed rightwards?
	this.distance = 0;
	// last time we created new platforms
	//var lastupdate = 0;
	
	this.groundHeight = 40;
	
	// background colour
	var bg = 'rgba(240, 255, 255, 1.0)';
	
	this.setShuttle = function(shuttle) {
		this.shuttle = shuttle;
	}
	
	// defines a simple screen-relative camera method
	this.camera = function(pos) {
		return [pos[0] - this.cpos + gs.width / 2, pos[1]];
	}
	
	// called when we are first added
	this.init = function() {
		gs.addEntity(shuttle);
	}
	
	// called every frame to draw the background
	this.draw = function(c,gs) {

		gs.background(bg);
		img = new Image();
		img.src= "assets/grass.bmp";
		c.fillStyle= c.createPattern(img, "repeat");
        c.fillRect(0,gs.height-this.groundHeight,gs.width,this.groundHeight);
        c.fill();
	}
	
	// called every frame to run the game, collisions, etc.
	this.update = function() {
		// update the camera position
		this.cpos += (shuttle.pos[0] - this.cpos) * 0.5;
		// increment the total distance travelled
		this.distance += this.upspeed;
	}
	
	/* mouse/finger detection */

	this.pointerDown = function() {
		if (gs.pointerPosition[0] < gs.width / 2) {
			shuttle.keyDown_37();
		} else {
			shuttle.keyDown_39();
		}
	}
	
	this.pointerUp = function() {
		shuttle.keyUp_37();
	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	// remove a platform from the world
	this.remove = function(which) {
		platforms.remove(which);
		gs.delEntity(which);
	}
}
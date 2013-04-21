/* World */
function World(gs) {
	// how much gravity to apply to objects each frame
	this.gravity = 0.1;
	// how fast the props etc. should move upwards
	//this.upspeed = 1; //0.09;
	// where the camera is centered
	this.cpos = 200;
	// how far has the user progressed rightwards?
	this.distance = 0;
	// last time we created new platforms
	//var lastupdate = 0;
	
	this.groundHeight = 40;
	
	// Station offset - for lowering the spacestation from the top:
	var stationOffset = 200;
	
	// background colour
	
	statemachine(this);
	
	this.setShuttle = function(shuttle) {
		this.shuttle = shuttle;
	}
	
	// defines a simple screen-relative camera method
	this.camera = function() {
		return [shuttle.pos[0]-this.cpos+200, shuttle.pos[1]];
	}
	
	// called when we are first added
	this.init = function() {
		//this.set_state("stopped"); @TODO after menu implementation
		this.set_state("running");
		//this.cpos=200;
	}
	
	// called every frame to draw the background
	this.stopped_draw = function(c,gs) {
		this.running_draw(c,gs);
	}
	
	this.running_draw = function(c,gs) {
		gs.background('rgba( 240, 255, 255, 1.0)');
		console.log(this.cpos);
		c.translate(-this.cpos,0);

		img = new Image();
		img.src= "assets/grass.bmp";
		c.fillStyle= c.createPattern(img, "repeat");
        c.fillRect(this.cpos,gs.height-this.groundHeight,gs.width,this.groundHeight);
        c.fill();
        
        iisImg = new Image();
        iisImg.src = "assets/iis.png";
        c.fillStyle = c.createPattern(iisImg, "repeat");
		//c.translate(0,0);
        c.fillRect(5+stationOffset,5,200,120);
		//c.translate(0,0);
        c.fill();
	}
	
	// called every frame to run the game, collisions, etc.
	this.running_update = function() {
		// update the camera position
		this.cpos += shuttle.pos[0]-this.cpos;
		
		// increment the total distance travelled
		//this.distance += this.upspeed;
	}
	
	this.stopped_update = function() {
		//this.running_update();
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
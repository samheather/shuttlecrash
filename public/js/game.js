/**
	@class Example code in the form of a simple "falling game" where the player must try to stay on the screen as platforms move past them upward.
*/
function ShuttleCrash(gs) {
	var d = new Date;
	// vertical separation of platform layers
	X_SEPARATION = 300;
	Y_SEPARATION = 150;	
	
	/* World */
	function World() {
		// how much gravity to apply to objects each frame
		this.gravity = 0.4;
		// how fast the props etc. should move upwards
		this.upspeed = 1; //0.09;
		// where the camera is centered
		this.cpos = gs.width / 2;
		// how far has the user progressed downwards?
		this.distance = 0;
		// last time we created new platforms
		var lastupdate = 0;
		
		// background colour
		var bg = 'rgba(240, 255, 255, 1.0)';
		var player = new Shuttle(this, gs);
		var platforms = [];
		
		// defines a simple screen-relative camera method
		this.camera = function(pos) {
			return [pos[0] - this.cpos + gs.width / 2, pos[1]];
		}
		
		// called when we are first added
		this.init = function() {
			gs.addEntity(player);
			//platforms.push(gs.addEntity(new Platform(this, [gs.width / 2, gs.height / 2])));
			for (var y = gs.height / 2 + Y_SEPARATION; y < gs.height + Y_SEPARATION; y += Y_SEPARATION) {
				this.addrow(y);
			}
		}
		
		// called every frame to draw the background
		this.draw = function() {
			gs.background(bg);
		}
		
		// called every frame to run the game, collisions, etc.
		this.update = function() {
			// detect collisions between the player and the props
			//collide.aabb([player], platforms);
			// update the camera position
			this.cpos += (player.pos[0] - this.cpos) * 0.5;
			// increment the total distance travelled
			this.distance += this.upspeed;
			// each time we overflow create new platforms
			if (Math.floor(this.distance / Y_SEPARATION) > lastupdate) {
				lastupdate = Math.floor(this.distance / Y_SEPARATION);
				this.addrow(gs.height + Y_SEPARATION);
			}
			// constantly increase the speed of platforms moving up
			this.upspeed += 0.001;
		}
		
		/* mouse/finger detection */

		this.pointerDown = function() {
			if (gs.pointerPosition[0] < gs.width / 2) {
				player.keyDown_37();
			} else {
				player.keyDown_39();
			}
		}
		
		this.pointerUp = function() {
			player.keyUp_37();
		}
		
		this.pointerBox = function() {
			return [0, 0, gs.width, gs.height];
		}
		
		// remove a platform from the world
		this.remove = function(which) {
			platforms.remove(which);
			//console.log(platforms.length);
			gs.delEntity(which);
		}
		
		// add a new random row of platforms to the world
		this.addrow = function(y) {
			//for (var x = player.pos[0] - gs.width / 2; x < player.pos[0] + gs.width / 2; x += X_SEPARATION) {
			//	platforms.push(gs.addEntity(new Platform(this, [x, y])));
			//}
		}
	}
	
	// preload all of the sprites we will use in this game
	Sprite.preload([
			"assets/spaceShuttle.png",
		],
		// create the world
		function() { gs.addEntity(new World()); }
	);
}

// this launch function is called by the HTML document to start the game
// the HTML document has a div tag called 'surface'
JSGameSoup.ready(function () {
	// grab the surface div and insert a canvas of the same size inside it
	var surface = document.getElementById("surface");
	var newcanvas = document.createElement("canvas");
	// set the width and height of our canvas to be the same as the container div
	newcanvas.style.width = newcanvas.width = (surface.offsetWidth + 1);
	newcanvas.style.height = newcanvas.height = (surface.offsetHeight + 1);
	surface.appendChild(newcanvas);
	// launch the gamesoup loop on the new canvas we just created
	var gs = new JSGameSoup(newcanvas, 30);
	ShuttleCrash(gs);
	gs.launch();
});

/**
	@class Example code in the form of a simple "falling game" where the player must try to stay on the screen as platforms move past them upward.
*/
function ShuttleCrash(gs) {		
	statemachine(this);
		
	Sprite.preload([
			"assets/spaceShuttle.png",
			"assets/grass.bmp"
		],
		function() { 
			ShuttleCrash.menu_init = function() {
				//reset state after running
				world.set_state("stopped");
				shuttle.set_state("stopped");
				//@TODO make menu enity and show it
			}
			
			ShuttleCrash.running_init = function() {
				world.set_state("running");
				shuttle.set_state("falling");
				//@TODO make menu entity and hide it
			}
			
			world = new World(gs);
			shuttle = new Shuttle(gs);
			
			world.setShuttle(shuttle);
			shuttle.setWorld(world);
						
			gs.addEntity(world); 
			gs.addEntity(shuttle);	
			
			this.set_state("menu");
		
		}
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

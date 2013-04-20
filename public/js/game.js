/**
	@class Example code in the form of a simple "falling game" where the player must try to stay on the screen as platforms move past them upward.
*/
function ShuttleCrash(gs) {	
	// preload all of the sprites we will use in this game
	
	
	Sprite.preload([
			"assets/spaceShuttle.png",
			"assets/grass.bmp"
		],
		// create the world
		function() { 
			world = new World(gs);
			shuttle = new Shuttle(gs);
			
			world.setShuttle(shuttle);
			shuttle.setWorld(world);
			
			gs.addEntity(world); 
			gs.addEntity(shuttle);
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

function hasWon() {
	shuttleCurrentX = Shuttle.pos[0];
	console.log(shuttleCurrentX);
	hasWon();
}

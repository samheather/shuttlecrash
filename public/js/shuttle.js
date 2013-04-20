function Shuttle(world) {
	this.type = 'shuttle';
	// constants
	var length = 65;
	var wingSpan = 30;
	var airBrakeOnDecent = 10;
	var attackAngle = 20;
	var surfaceArea = 100;
	// position
	var pos = this.pos = [gs.width / 2, gs.height / 2];
	// velocity
	var vx = 0;
	var vy = 0;
	// sprite which represents the player
	var p = new Sprite(["center", "bottom"], {
		stand: [["img/character-stand.png", 0],]
	},
	// callback gets called when everything is loaded
	function() {
		p.action("stand");
	});
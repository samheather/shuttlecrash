/* The player class */
	function Player(world) {
		this.type = 'player';
		// constants
		var MAX_VY = 20;
		var WALK_VX = 3;
		var WALK_FRAMES = 3;
		var FALL_FRAMES = 2;
		// position
		var pos = this.pos = [gs.width / 2, gs.height / 2];
		// velocity
		var vx = 0;
		var vy = 0;
		// sprite which represents the player
		var p = new Sprite(["center", "bottom"], {
			stand: [["img/character-stand.png", 0],],
			walk right: [["img/character-walk-right-1.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES], ["img/character-walk-right-3.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES],],
			walk left: [["img/character-walk-left-1.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES], ["img/character-walk-left-3.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES],],
			fall: [["img/character-fall-1.png", FALL_FRAMES], ["img/character-fall-2.png", FALL_FRAMES],],
		},
		// callback gets called when everything is loaded
		function() {
			p.action("stand");
		});

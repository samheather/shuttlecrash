function Shuttle(world, gs) {
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
		stand: [["assets/spaceShuttle.png", 0],]
	},
	// callback gets called when everything is loaded
	function() {
		p.action("stand");
	});
	
	/* Concurrency stuff */
		
		// draw the player's sprite every frame
		this.draw = function(c) {
			p.draw(c, world.camera(pos));
		}
		
		this.updateanimation = function() {
			if (vy > world.gravity * 2) {
				p.action("fall");
			} else {
				if (vx >= WALK_VX) {
					p.action("walk right");
				} else if (vx <= -WALK_VX) {
					p.action("walk left");
				} else {
					p.action("stand");
				}
			}
		}
		
		// update the player's position every frame
		this.update = function() {
			vy = Math.min(vy + world.gravity, MAX_VY);
			this.updateanimation();
			pos[0] += vx;
			pos[1] += vy;
			p.update();
			if (pos[1] > p.height + gs.height || pos[1] < 0) {
				document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
				document.getElementById("gameover").style.display = "block";
			}
		}
		
		/* collision stuff */
		
		// return the bounding box of our sprite for the collision test
		this.get_collision_aabb = function() {
			return p.aabb(pos);
		}
		
		/* input events stuff */
		this.keyDown_37 = function () {
			this.updateanimation();
			vx = -WALK_VX;
		}
		
		this.keyUp_37 = this.keyUp_39 = function() {
			this.updateanimation();
			vx = 0;
		}
		
		this.keyDown_39 = function () {
			this.updateanimation();
			vx = WALK_VX;
		}
		
		// basic comparison function
		var cmp = function(x, y){ return x[0] < y[0] ? 1 : x[0] > y[0] ? -1 : 0; };
		
		// if the axis aligned bouding box of this entity collides with another
		this.collide_aabb = function(who) {
			if (who.type == 'platform') {
				var ab = this.get_collision_aabb();
				var bb = who.get_collision_aabb();
				
				var sides = [
						[bb[1] - (ab[1] + ab[3]), 1, 1],
						[bb[0] - (ab[0] + ab[2]), 0, 1],
						[ab[0] - (bb[0] + bb[2]), 0, -1],
						[ab[1] - (bb[1] + bb[3]), 1, -1]
				];
				sides.sort(cmp);
				var d = sides[0];
				// hit a vertical side
				if (d[1]) {
					if (pos[0] > bb[0] + bb[2]) {
						pos[0] += WALK_VX;
					} else if (pos[0] < bb[0]) {
						pos[0] -= WALK_VX;
					} else {
						pos[1] = bb[1];
						vy = 0;
						this.updateanimation();
					}
				} else {
					// horizontal side
					if (pos[0] > bb[0] + bb[2]) {
						pos[0] += WALK_VX;
					} else if (pos[0] < bb[0]) {
						pos[0] -= WALK_VX;
					}
				}
			}
		}
		/*this.keyDown = function (keyCode) {
			console.log(keyCode);
		}*/
	}
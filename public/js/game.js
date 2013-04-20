  1 /**
  2 	@class Example code in the form of a simple "falling game" where the player must try to stay on the screen as platforms move past them upward.
  3 */
  4 function ExampleGame(gs) {
  5 	// seedable random number generator for building the world
  6 	var r = new SeedableRandom();
  7 	var d = new Date;
  8 	r.seed(d.getTime());
  9 	// vertical separation of platform layers
 10 	X_SEPARATION = 300;
 11 	Y_SEPARATION = 150;
 12 	
 13 	/* The player class */
 14 	function Player(world) {
 15 		this.type = 'player';
 16 		// constants
 17 		var MAX_VY = 20;
 18 		var WALK_VX = 3;
 19 		var WALK_FRAMES = 3;
 20 		var FALL_FRAMES = 2;
 21 		// position
 22 		var pos = this.pos = [gs.width / 2, gs.height / 2];
 23 		// velocity
 24 		var vx = 0;
 25 		var vy = 0;
 26 		// sprite which represents the player
 27 		var p = new Sprite(["center", "bottom"], {
 28 			stand: [["img/character-stand.png", 0],],
 29 			walk right: [["img/character-walk-right-1.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES], ["img/character-walk-right-3.png", WALK_FRAMES], ["img/character-walk-right-2.png", WALK_FRAMES],],
 30 			walk left: [["img/character-walk-left-1.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES], ["img/character-walk-left-3.png", WALK_FRAMES], ["img/character-walk-left-2.png", WALK_FRAMES],],
 31 			fall: [["img/character-fall-1.png", FALL_FRAMES], ["img/character-fall-2.png", FALL_FRAMES],],
 32 		},
 33 		// callback gets called when everything is loaded
 34 		function() {
 35 			p.action("stand");
 36 		});
 37 		
 38 		/* Concurrency stuff */
 39 		
 40 		// draw the player's sprite every frame
 41 		this.draw = function(c) {
 42 			p.draw(c, world.camera(pos));
 43 		}
 44 		
 45 		this.updateanimation = function() {
 46 			if (vy > world.gravity * 2) {
 47 				p.action("fall");
 48 			} else {
 49 				if (vx >= WALK_VX) {
 50 					p.action("walk right");
 51 				} else if (vx <= -WALK_VX) {
 52 					p.action("walk left");
 53 				} else {
 54 					p.action("stand");
 55 				}
 56 			}
 57 		}
 58 		
 59 		// update the player's position every frame
 60 		this.update = function() {
 61 			vy = Math.min(vy + world.gravity, MAX_VY);
 62 			this.updateanimation();
 63 			pos[0] += vx;
 64 			pos[1] += vy;
 65 			p.update();
 66 			if (pos[1] > p.height + gs.height || pos[1] < 0) {
 67 				document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
 68 				document.getElementById("gameover").style.display = "block";
 69 			}
 70 		}
 71 		
 72 		/* collision stuff */
 73 		
 74 		// return the bounding box of our sprite for the collision test
 75 		this.get_collision_aabb = function() {
 76 			return p.aabb(pos);
 77 		}
 78 		
 79 		/* input events stuff */
 80 		this.keyDown_37 = function () {
 81 			this.updateanimation();
 82 			vx = -WALK_VX;
 83 		}
 84 		
 85 		this.keyUp_37 = this.keyUp_39 = function() {
 86 			this.updateanimation();
 87 			vx = 0;
 88 		}
 89 		
 90 		this.keyDown_39 = function () {
 91 			this.updateanimation();
 92 			vx = WALK_VX;
 93 		}
 94 		
 95 		// basic comparison function
 96 		var cmp = function(x, y){ return x[0] < y[0] ? 1 : x[0] > y[0] ? -1 : 0; };
 97 		
 98 		// if the axis aligned bouding box of this entity collides with another
 99 		this.collide_aabb = function(who) {
100 			if (who.type == 'platform') {
101 				var ab = this.get_collision_aabb();
102 				var bb = who.get_collision_aabb();
103 				
104 				var sides = [
105 						[bb[1] - (ab[1] + ab[3]), 1, 1],
106 						[bb[0] - (ab[0] + ab[2]), 0, 1],
107 						[ab[0] - (bb[0] + bb[2]), 0, -1],
108 						[ab[1] - (bb[1] + bb[3]), 1, -1]
109 				];
110 				sides.sort(cmp);
111 				var d = sides[0];
112 				// hit a vertical side
113 				if (d[1]) {
114 					if (pos[0] > bb[0] + bb[2]) {
115 						pos[0] += WALK_VX;
116 					} else if (pos[0] < bb[0]) {
117 						pos[0] -= WALK_VX;
118 					} else {
119 						pos[1] = bb[1];
120 						vy = 0;
121 						this.updateanimation();
122 					}
123 				} else {
124 					// horizontal side
125 					if (pos[0] > bb[0] + bb[2]) {
126 						pos[0] += WALK_VX;
127 					} else if (pos[0] < bb[0]) {
128 						pos[0] -= WALK_VX;
129 					}
130 				}
131 			}
132 		}
133 		/*this.keyDown = function (keyCode) {
134 			console.log(keyCode);
135 		}*/
136 	}
137 	
138 	/* A prop in the world. */
139 	function Prop(world, platform) {
140 		this.type = 'prop';
141 		var propfile = null;
142 		var offset = 0;
143 		
144 		// choose a random sprite to load for this prop
145 		if (r.nextInt(0, 5) == 0) {
146 			propfile = "img/prop-" + ["tyre", "lamp", "bench"][r.nextInt(0, 3)] + ".png";
147 		} else {
148 			propfile = "img/tree";
149 			if (r.nextInt(0, 2))
150 				propfile += "-pine";
151 			propfile += "-" + r.nextInt(1, 4) + ".png";
152 		}
153 		
154 		// instantiate the sprite
155 		var p = new Sprite(["center", "bottom"], {default: [[propfile, 0]]}, function() {
156 			p.action("default");
157 			offset = (r.next() - 0.5) * (platform.get_collision_aabb()[2] - p.width / 2);
158 		});
159 		
160 		// draw this prop's sprite every frame
161 		this.draw = function(c) {
162 			p.draw(c, world.camera([platform.pos[0] + offset, platform.pos[1] + 1]));
163 		}
164 	}
165 	
166 	/* Platform */
167 	function Platform(world, pos) {
168 		this.type = 'platform';
169 		// the list of props sitting on this platform
170 		var props = [];
171 		// current position
172 		this.pos = pos;
173 		// closureify
174 		var platform = this;
175 		
176 		// get the sprite for this platform
177 		var p = this.sprite = new Sprite(["center", "top"], {default: [["img/platform-" + r.nextInt(1, 5) + ".png", 0]]}, function() {
178 			// once the sprite is loaded do some init
179 			p.action("default");
180 		});
181 		
182 		// called when this entity is added
183 		this.init = function() {
184 			// make me some props
185 			for (var i = 0; i < r.nextInt(1, 4); i++) {
186 				props.push(new Prop(world, this));
187 				gs.addEntity(props[props.length - 1]);
188 			}
189 		}
190 		
191 		// update this platform's position every frame
192 		this.update = function() {
193 			pos[1] -= world.upspeed;
194 			// if the platform has moved off the screen the get rid of it
195 			if (pos[1] < -200) {
196 				for (var i = 0; i < props.length; i++) {
197 					gs.delEntity(props[i]);
198 					delete props[i];
199 				}
200 				gs.delEntity(this);
201 				world.remove(this);
202 			}
203 			p.update();
204 		}
205 		
206 		// draw this platform's sprite every frame
207 		this.draw = function(c) {
208 			p.draw(c, world.camera(pos));
209 		}
210 		
211 		// return the bounding box of our sprite for the aabb collision test
212 		this.get_collision_aabb = function() {
213 			return p.aabb(pos);
214 		}
215 	}
216 	
217 	/* World */
218 	function World() {
219 		// how much gravity to apply to objects each frame
220 		this.gravity = 0.4;
221 		// how fast the props etc. should move upwards
222 		this.upspeed = 1; //0.09;
223 		// where the camera is centered
224 		this.cpos = gs.width / 2;
225 		// how far has the user progressed downwards?
226 		this.distance = 0;
227 		// last time we created new platforms
228 		var lastupdate = 0;
229 		
230 		// background colour
231 		var bg = 'rgba(240, 255, 255, 1.0)';
232 		var player = new Player(this);
233 		var platforms = [];
234 		
235 		// defines a simple screen-relative camera method
236 		this.camera = function(pos) {
237 			return [pos[0] - this.cpos + gs.width / 2, pos[1]];
238 		}
239 		
240 		// called when we are first added
241 		this.init = function() {
242 			gs.addEntity(player);
243 			platforms.push(gs.addEntity(new Platform(this, [gs.width / 2, gs.height / 2])));
244 			for (var y = gs.height / 2 + Y_SEPARATION; y < gs.height + Y_SEPARATION; y += Y_SEPARATION) {
245 				this.addrow(y);
246 			}
247 		}
248 		
249 		// called every frame to draw the background
250 		this.draw = function() {
251 			gs.background(bg);
252 		}
253 		
254 		// called every frame to run the game, collisions, etc.
255 		this.update = function() {
256 			// detect collisions between the player and the props
257 			collide.aabb([player], platforms);
258 			// update the camera position
259 			this.cpos += (player.pos[0] - this.cpos) * 0.5;
260 			// increment the total distance travelled
261 			this.distance += this.upspeed;
262 			// each time we overflow create new platforms
263 			if (Math.floor(this.distance / Y_SEPARATION) > lastupdate) {
264 				lastupdate = Math.floor(this.distance / Y_SEPARATION);
265 				this.addrow(gs.height + Y_SEPARATION);
266 			}
267 			// constantly increase the speed of platforms moving up
268 			this.upspeed += 0.001;
269 		}
270 		
271 		/* mouse/finger detection */
272 
273 		this.pointerDown = function() {
274 			if (gs.pointerPosition[0] < gs.width / 2) {
275 				player.keyDown_37();
276 			} else {
277 				player.keyDown_39();
278 			}
279 		}
280 		
281 		this.pointerUp = function() {
282 			player.keyUp_37();
283 		}
284 		
285 		this.pointerBox = function() {
286 			return [0, 0, gs.width, gs.height];
287 		}
288 		
289 		// remove a platform from the world
290 		this.remove = function(which) {
291 			platforms.remove(which);
292 			//console.log(platforms.length);
293 			gs.delEntity(which);
294 		}
295 		
296 		// add a new random row of platforms to the world
297 		this.addrow = function(y) {
298 			for (var x = player.pos[0] - gs.width / 2; x < player.pos[0] + gs.width / 2; x += X_SEPARATION) {
299 				platforms.push(gs.addEntity(new Platform(this, [x, y])));
300 			}
301 		}
302 	}
303 	
304 	// preload all of the sprites we will use in this game
305 	Sprite.preload([
306 			"img/character-fall-1.png",
307 			"img/character-fall-2.png",
308 			"img/character-stand.png",
309 			"img/character-walk-left-1.png",
310 			"img/character-walk-left-2.png",
311 			"img/character-walk-left-3.png",
312 			"img/character-walk-right-1.png",
313 			"img/character-walk-right-2.png",
314 			"img/character-walk-right-3.png",
315 			"img/makeleft.sh",
316 			"img/platform-1.png",
317 			"img/platform-2.png",
318 			"img/platform-3.png",
319 			"img/platform-4.png",
320 			"img/prop-bench.png",
321 			"img/prop-lamp.png",
322 			"img/prop-tyre.png",
323 			"img/tree-1.png",
324 			"img/tree-2.png",
325 			"img/tree-3.png",
326 			"img/tree-pine-1.png",
327 			"img/tree-pine-2.png",
328 			"img/tree-pine-3.png",
329 		],
330 		// create the world
331 		function() { gs.addEntity(new World()); }
332 	);
333 }
334 
335 // this launch function is called by the HTML document to start the game
336 // the HTML document has a div tag called 'surface'
337 function launch() {
338 	// grab the surface div and insert a canvas of the same size inside it
339 	var surface = document.getElementById("surface");
340 	var newcanvas = document.createElement("canvas");
341 	// set the width and height of our canvas to be the same as the container div
342 	newcanvas.style.width = newcanvas.width = (surface.offsetWidth + 1);
343 	newcanvas.style.height = newcanvas.height = (surface.offsetHeight + 1);
344 	surface.appendChild(newcanvas);
345 	// launch the gamesoup loop on the new canvas we just created
346 	var gs = new JSGameSoup(newcanvas, 30);
347 	ExampleGame(gs);
348 	gs.launch();
349 }

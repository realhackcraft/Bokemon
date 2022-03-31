const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
	collisionsMap.push(collisions.slice(i, i + 70));
}

const canvasCenter = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
	battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const map = new Image();
map.src = './Assets/map.png';

const foregroundImage = new Image();
foregroundImage.src = './Assets/foreground.png';

const playerImageUp = new Image();
playerImageUp.src = './Assets/playerUp.png';

const playerImageDown = new Image();
playerImageDown.src = './Assets/playerDown.png';

const playerImageLeft = new Image();
playerImageLeft.src = './Assets/playerLeft.png';

const playerImageRight = new Image();
playerImageRight.src = './Assets/playerRight.png';

Boundary.width = 48;
Boundary.height = 48;

const offset = {
	x: -590,
	y: -380,
};

const boundaries = [];

collisionsMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1) {
			boundaries.push(
				new Boundary({
					pos: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			);
		}
	});
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1) {
			battleZones.push(
				new Boundary({
					pos: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			);
		}
	});
});

const player = new Sprite({
	pos: {
		x: canvasCenter.x - 24, // imageWidth / 4 / 2
		y: canvasCenter.y - 34, // imageHeight / 2
	},
	image: playerImageDown,
	frames: {
		max: 4,
	},
	sprites: {
		up: playerImageUp,
		left: playerImageLeft,
		down: playerImageDown,
		right: playerImageRight,
	},
});

const background = new Sprite({
	pos: {
		x: offset.x,
		y: offset.y,
	},
	image: map,
});

const foreground = new Sprite({
	pos: {
		x: offset.x,
		y: offset.y,
	},
	image: foregroundImage,
});

const keys = {
	w: {
		press: false,
	},
	a: {
		press: false,
	},
	s: {
		press: false,
	},
	d: {
		press: false,
	},
};

const movables = [background, foreground, ...boundaries, ...battleZones];

function rectCollision(rect1, rect2) {
	return rect1.pos.x + rect1.width >= rect2.pos.x && rect1.pos.x <= rect2.pos.x + rect2.width && rect1.pos.y + rect1.height >= rect2.pos.y && rect1.pos.y <= rect2.pos.y + rect2.height;
}

function animate() {
	requestAnimationFrame(animate);
	background.draw();

	// EXAMPLE: battle zones render
	battleZones.forEach(battleZone => {
		battleZone.draw();
	});

	// EXAMPLE: boundary render
	// boundaries.forEach(boundary => {
	// 	boundary.draw();
	// });

	player.draw();
	foreground.draw();

	function battleZonesCollision() {
		for (i = 0; i < battleZones.length; i++) {
			const battleZone = battleZones[i];
			const overlappingArea = Math.max();
			if (rectCollision(player, battleZone) && overlappingArea > (player.width * player.height) / 2) {
				console.log('battle');
				break;
			}
		}
	}
	// IDEA: diagonal movement with speed limit
	let moving = true;
	player.moving = false;
	if (keys.w.press && lastkey === 'w') {
		player.moving = true;
		player.image = player.sprites.up;

		for (i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				rectCollision(player, {
					...boundary,
					pos: {
						x: boundary.pos.x,
						y: boundary.pos.y + 6,
					},
				})
			) {
				console.log('colliding');
				moving = false;
				break;
			}
		}

		battleZonesCollision();

		if (moving) {
			movables.forEach(movable => {
				movable.pos.y += 6;
			});
		}
	} else if (keys.a.press && lastkey === 'a') {
		player.moving = true;
		player.image = player.sprites.left;

		for (i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				rectCollision(player, {
					...boundary,
					pos: {
						x: boundary.pos.x + 6,
						y: boundary.pos.y,
					},
				})
			) {
				console.log('colliding');
				moving = false;
				break;
			}
		}

		battleZonesCollision();

		if (moving) {
			movables.forEach(movable => {
				movable.pos.x += 6;
			});
		}
	} else if (keys.s.press && lastkey === 's') {
		player.moving = true;
		player.image = player.sprites.down;

		for (i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				rectCollision(player, {
					...boundary,
					pos: {
						x: boundary.pos.x,
						y: boundary.pos.y - 6,
					},
				})
			) {
				console.log('colliding');
				moving = false;
				break;
			}
		}

		battleZonesCollision();

		if (moving) {
			movables.forEach(movable => {
				movable.pos.y -= 6;
			});
		}
	} else if (keys.d.press && lastkey === 'd') {
		player.moving = true;
		player.image = player.sprites.right;

		for (i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				rectCollision(player, {
					...boundary,
					pos: {
						x: boundary.pos.x - 6,
						y: boundary.pos.y,
					},
				})
			) {
				console.log('colliding');
				moving = false;
				break;
			}
		}

		battleZonesCollision();

		if (moving) {
			movables.forEach(movable => {
				movable.pos.x -= 6;
			});
		}
	}
}

animate();

let lastkey;
addEventListener('keydown', e => {
	switch (e.key) {
		case 'w':
			keys.w.press = true;
			lastkey = 'w';
			break;
		case 'a':
			keys.a.press = true;
			lastkey = 'a';
			break;
		case 's':
			keys.s.press = true;
			lastkey = 's';
			break;
		case 'd':
			keys.d.press = true;
			lastkey = 'd';
			break;
	}
});

addEventListener('keyup', e => {
	switch (e.key) {
		case 'w':
			keys.w.press = false;
			break;
		case 'a':
			keys.a.press = false;
			break;
		case 's':
			keys.s.press = false;
			break;
		case 'd':
			keys.d.press = false;
			break;
	}
});

class Boundary {
	constructor({ pos }) {
		this.pos = pos;
		this.width = 48;
		this.height = 48;
	}

	draw() {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
}

class Sprite {
	constructor({ pos, image, frames = { max: 1 }, sprites }) {
		this.pos = pos;
		this.image = image;
		this.frames = { ...frames, val: 0, interval: 0 };
		this.image.onload = () => {
			this.width = this.image.width / this.frames.max;
			this.height = this.image.height;
		};
		this.moving = false;
		this.sprites = sprites;
	}

	draw() {
		ctx.drawImage(this.image, this.frames.val * this.width, 0, this.image.width / this.frames.max, this.image.height, this.pos.x, this.pos.y, this.image.width / this.frames.max, this.image.height);

		if (!this.moving) {
			this.frames.val = 0;
			return;
		}
		if (this.frames.max > 1) {
			this.frames.interval++;
		}

		if (this.frames.interval % 7 === 0) {
			if (this.frames.val < this.frames.max - 1) this.frames.val++;
			else this.frames.val = 0;
		}
	}
}

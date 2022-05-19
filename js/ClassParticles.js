class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity; // helps with fadiing out
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a a full circle based on an arc
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    // need to re-render the projectile on each frame to make it move
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.fades) this.opacity -= 0.01; // helps with fading out
    }
}

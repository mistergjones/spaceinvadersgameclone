class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
    }

    draw() {
        // DRAW A CIRCLE FOR THE PROJECTILE
        c.beginPath(); //starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // create a full circle
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    // the below will update each frame
    update() {
        // 1. draw the actual projectile first
        this.draw();
        // 2. now make it update its x / y co-ordinates with a velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

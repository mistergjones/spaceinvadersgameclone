class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }

    draw() {
        c.fillStyle = "white";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // need to re-render the projectile on each frame to make it move
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

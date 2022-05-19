// Player Object
class Invader {
    // class always has a constructor
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.rotation = 0;

        // set the image
        const image = new Image(); // its a js api
        image.src = "./invader.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * imageInvaderScaleFactor;
            this.height = image.height * imageInvaderScaleFactor;

            // centre the spaceshipt in the middle of the screen and just above bottom
            this.position = {
                x: position.x,
                y: position.y,
            };
        };
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    // Function update what we want on each frame
    update({ velocity }) {
        // only update the screen once the image has been loaded
        if (this.image) {
            this.draw();

            // update the voloity of hte spaceship
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width / 2, //centre where the projectile comes from
                    y: this.position.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
            })
        );
    }
}

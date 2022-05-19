// Player Object
class Player {
    // class always has a constructor
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.rotation = 0;
        this.opacity = 1; // default setting

        // set the image
        const image = new Image(); // its a js api
        image.src = "./spaceship.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * imageScaleFactor;
            this.height = image.height * imageScaleFactor;

            // centre the spaceshipt in the middle of the screen and just above bottom
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20,
            };

            console.log(this.position);
        };
    }

    draw() {
        // c.fillStyle = "red";
        // c.fillRect(
        //     this.position.x,
        //     this.position.y,
        //     canvas.width,
        //     canvas.height
        // );

        // 1. To enable the image to rotate a little, we need to use c.save(), c.translate(), c.rotate(), c.restore()
        c.save(); // saves the entire state of the canvas by pushing the current state onto a stack.
        c.globalAlpha = this.opacity;

        // c.translate() repositions an element in the horizontal and/or vertical directions.
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );

        c.rotate(this.rotation);

        // now we need to move the canvas back to the previous spot to remove the rotation
        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        c.restore(); // restores the most recently saved canvas state by popping the top entry in the drawing state stack.
    }

    fireEngine() {
        // draw some fire
        c.fillStyle = "orange";
        c.fillRect(player.position.x + 30, player.position.y + 40, 8, 8);
    }

    // Function update what we want on each frame
    update() {
        // only update the screen once the image has been loaded
        if (this.image) {
            this.draw();
            // update the voloity of hte spaceship
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Grid {
    constructor() {
        // starting poistion
        this.position = {
            x: 0,
            y: 0,
        };
        // starting velocity
        this.velocity = {
            x: 3,
            y: 0,
        };
        // now create an array to store all the invaders
        this.invaders = [];

        // for loop to create the rows and columns
        const columnsCount = Math.floor(Math.random() * 10 + 5);
        const rowsCount = Math.floor(Math.random() * 5 + 2);

        this.width = columnsCount * 30; // each invader is 30 pixels

        // now create the ROWS and Columns to store each instance of the invaders
        for (
            let columnIterator = 0;
            columnIterator < columnsCount;
            columnIterator++
        ) {
            for (let rowIterator = 0; rowIterator < rowsCount; rowIterator++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: columnIterator * invaderWidth,
                            y: rowIterator * invaderHeight,
                        },
                    })
                );
            }
        }
    }

    // define what it needs to update evert frame
    update() {
        // update the position on the axis every frame
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // set velocoy for each frame to zero. Change it to 30 for one frame only when it reaches the end
        this.velocity.y = 0;

        // make sure it doesn't spill off the screen. Move Down and change direction
        if (
            this.position.x + this.width >= canvas.width ||
            this.position.x <= 0
        ) {
            // move on x and shift down invader height when it reaches the end
            this.velocity.x = -this.velocity.x;
            this.velocity.y = invaderHeight; // invader height
        }
    }
}

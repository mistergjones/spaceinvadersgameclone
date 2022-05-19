// 1. need to select the canvas
const canvas = document.querySelector("canvas");
const scoreEl = document.querySelector("#scoreEl");
// 2. need to create the context in a 2d setting so we can draw stuff
const c = canvas.getContext("2d");

// 3. Set the canvas width and height for the game
canvas.width = 1024;
canvas.height = 576;

// 4 - Game Constants
const imageScaleFactor = 0.15;
const imageInvaderScaleFactor = 1.3;
const invaderWidth = 30;
const invaderHeight = 30;
const projectiles = []; // an array to store all the projectiles when they are shot
const invaderProjectiles = []; // stores all the invade projectiles
const particles = [];
let score = 0;
let game = {
    over: false,
    active: true,
};
// used to track and generate/spawn a grid of invaders
let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
const grids = []; // stores the invader grids in an array

// 5 - Game Objects for monitoring
// Will be used for keyup() and keydown()
const keysToMonitor = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
};

// 6. Create some stars on the screen
createStars();

// This function repeatedly calls itself to constantly refresh and make things move
function animate() {
    requestAnimationFrame(animate);

    // draw the black background
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // continaully call this to update the player
    player.update();

    // particles to render. We also need to remove them and do some garbage colleciton. SETTIMEOUT is to prevent flickering
    particles.forEach((particle, particleIndex) => {
        // need to continually re-spawn the same stars over and over again in the same positions. It create the moving effect
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        }
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(particleIndex, 1);
            }, 0);
        } else {
            // draw the partiles
            particle.update();
        }
    });

    // go through each projectile in the invader projectiles array and animate them shooting. Destory the projectiles / garbage collectino when they are off the screen
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
            canvas.height
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1);
            }, 0);
        } else {
            // DETECT COLLISION WITH START SHIP
            invaderProjectile.update();

            // if the projectile is eqial to the top of the start ship, left and right...we have a collision
            if (
                invaderProjectile.position.y + invaderProjectile.height >=
                    player.position.y &&
                invaderProjectile.position.x + invaderProjectile.width >=
                    player.position.x &&
                invaderProjectile.position.x <= player.position.x + player.width
            ) {
                console.log("YOU LOSE");

                // remove the projectile when the startship is hit. Blank out the starship and update game over status flag = true
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;
                }, 0);

                // stop the game after 1/2 second but player will still see some animation. This will look good.
                setTimeout(() => {
                    game.active = false;
                }, 500);
                // show the explosino when the starship is hit
                createParticles({
                    object: player,
                    color: "white",
                    fades: true,
                });
            }
        }
    });

    // FIRE THE PROJECTILES ON SCREEN
    projectiles.forEach((projectile, projectileIndex) => {
        // need to garbage collect when projectile is off screen
        if (projectile.position.y + projectile.radius <= 0) {
            //setTimeout() will prevent screen flickering
            setTimeout(() => {
                // remove 1 projectile from the array
                projectiles.splice(projectileIndex, 1);
            }, 0);
        } else {
            // if still on screen...update them
            projectile.update();
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update();

        // randomly generate a projectile from a random invader
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[
                Math.floor(Math.random() * grid.invaders.length)
            ].shoot(invaderProjectiles);
        }

        // instantiate the invaders inside its class and provide the grid velocity to it
        grid.invaders.forEach((invader, invaderIndex) => {
            // set the velocity of hte invader to the same of hte grid
            invader.update({
                velocity: grid.velocity,
            });
            // COLLISION DETECTION WHEN PROJECTILE HITS INVADER
            // need to handle the projectiles hitting the invaders
            projectiles.forEach((projectile, projectileIndex) => {
                if (
                    projectile.position.y - projectile.radius <=
                        invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                        invader.position.x &&
                    projectile.position.x - projectile.radius <=
                        invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                        invader.position.y
                ) {
                    setTimeout(() => {
                        //1. need to find the invader that got hit
                        const invaderFound = grid.invaders.find(
                            (invaderWeAreSeeking) => {
                                return invaderWeAreSeeking === invader;
                            }
                        );

                        const projectileFound = projectiles.find(
                            //1. need find the projectile that hit the invader
                            (projectileWeAreSeeking) => {
                                // do we have the same projetile found in the grid.projectile array?
                                return projectileWeAreSeeking === projectile;
                            }
                        );

                        // check that we both invader and projectile found. Update score also
                        if (invaderFound && projectileFound) {
                            score += 100;
                            scoreEl.innerHTML = score;

                            // now create the exploding particles when an invdaer is hit
                            createParticles({
                                object: invader,
                                fades: true,
                            });

                            //select and remove that specific invader from the array
                            grid.invaders.splice(invaderIndex, 1);
                            projectiles.splice(projectileIndex, 1);

                            // determine a new width when we remove them
                            if (grid.invaders.length > 0) {
                                // grab the ifrst invader in the FAR LEFT CORNER & FAR RIGHT SIDE
                                const firstInvader = grid.invaders[0];
                                const lastInvader =
                                    grid.invaders[grid.invaders.length - 1];
                                grid.width =
                                    lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width;

                                // make sure the left side of hthe grid works when a left column in removed
                                grid.position.x = firstInvader.position.x;
                            } else {
                                // garbage collection to ensure we don't animate items that are gone.
                                grids.splice(gridIndex, 1);
                            }
                        }
                    }, 0);
                }
            });
        });
    });

    // MOVE THE SPACESHIP BASED ON KEY PRESS. UP DOWN LERFT RIGHT
    // 1. only move left to start of screen
    if (keysToMonitor.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    } else if (keysToMonitor.d.pressed && player.position.x <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;
    } else if (keysToMonitor.w.pressed && player.position.y >= 15) {
        player.velocity.y = -7;
        player.fireEngine();
    } else if (
        keysToMonitor.s.pressed &&
        player.position.y <
            canvas.height - player.image.height * imageScaleFactor
    ) {
        console.log(canvas.height);
        player.velocity.y = 7;
    }
    // 4. if no key is pressed, no velocity
    else {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.rotation = 0;
    }

    // GENERATE THE INVADER GRID
    // randomly spawn a new grid of invaders
    if (frames % randomInterval === 0) {
        grids.push(new Grid());
        // reset the random interval and frames
        randomInterval = Math.floor(Math.random() * 500 + 500);
        frames = 0;
    }

    // update the global frames counter
    frames++;
}

// Instantiate the new player
const player = new Player();

animate();

function createStars() {
    for (let i = 0; i < 100; i++) {
        particles.push(
            new Particle({
                position: {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                },
                velocity: {
                    x: 0,
                    y: 0.3,
                },
                radius: Math.random() * 2,
                color: "white", //default color if not supplied
            })
        );
    }
}

// Function that creates particles
function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2,
                },
                radius: Math.random() * 3,
                color: color || "#BAA0DE", //default color if not supplied
                fades: fades,
            })
        );
    }
}

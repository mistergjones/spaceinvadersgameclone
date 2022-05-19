// Capture when a keydown event occurs
window.addEventListener("keydown", (event) => {
    // if the game is over, make sure the player cannot do anything and return
    if (game.over) return;

    switch (event.key) {
        case "a":
            keysToMonitor.a.pressed = true;
            break;
        case "d":
            keysToMonitor.d.pressed = true;
            break;
        case "w":
            keysToMonitor.w.pressed = true;
            break;
        case "s":
            keysToMonitor.s.pressed = true;
            break;
        case " ": //fire
            // keysToMonitor.space.pressed = true;
            // load a projectile by instantiating it and pushing it into the global projectiles array. Then need to animate() it
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y,
                    },
                    velocity: {
                        x: 0,
                        y: -10,
                    },
                })
            );
            break;
    }
});

// capture when a keyup() event occurs
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            keysToMonitor.a.pressed = false;
            break;
        case "d":
            keysToMonitor.d.pressed = false;
            break;
        case "w":
            keysToMonitor.w.pressed = false;
            break;
        case "s":
            keysToMonitor.s.pressed = false;
            break;
        case " ":
            keysToMonitor.space.pressed = false;
            break;
    }
});

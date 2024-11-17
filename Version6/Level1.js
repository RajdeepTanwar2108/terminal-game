// Initialize the terminal
const terminal = new Terminal();
terminal.open(document.getElementById('terminal-container'));   

// Display a welcome message
terminal.write("Welcome to the Mystical Forest!\r\nType 'pwd' to see where you are, 'ls' to explore, or 'cd <location>' to move.\r\n$ ");

// Set up a command buffer to capture input
let commandBuffer = "";

// Added initial state
let currentScene = 'initial';
let currentPath = 'forest';
let images = {};
let hasDestroyedShrine = false;
let shrineImageIndex = 1;

// Handle key input in the terminal
terminal.onData((data) => {
    const code = data.charCodeAt(0);

    if (code === 13) { 
        executeCommand(commandBuffer);
        commandBuffer = ""; 
    } 
    else if (code === 127) {
        if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            terminal.write("\b \b");
        }
    } 
    else {
        commandBuffer += data;
        terminal.write(data);
    }
});

// Command execution function
function executeCommand(command) {
    terminal.write("\r\n");
    const cmd = command.trim().toLowerCase();
    
    switch(cmd) {
        case 'pwd':
            terminal.write(currentPath + "\r\n");
            break;

        case 'ls':
            showAvailableOptions();
            break;

        case 'cd cave':
            if (currentScene === 'forest') {
                loadCaveScene();
            } else {
                terminal.write("Cannot access cave from here.\r\n");
            }
            break;

        case 'cd mothertree':
            if (currentScene === 'forest') {
                loadMotherTreeScene();
            } else {
                terminal.write("Cannot access Mother Tree from here.\r\n");
            }
            break;

        case 'cd forgottenshrine':
            if (currentScene === 'forest' && !hasDestroyedShrine) {
                loadShrineScene();
            } else {
                terminal.write("Location not found.\r\n");
            }
            break;

        case 'cd newdirectoryname':
            if (currentScene === 'forest' && hasDestroyedShrine) {
                loadNewPathScene();
            } else {
                terminal.write("Location not found.\r\n");
            }
            break;

        case 'cd ..':
            if (currentScene !== 'forest') {
                loadForestScene();
            } else {
                terminal.write("Already in root directory.\r\n");
            }
            break;

        case 'rmdir forgottenshrine':
            handleShrineDestruction();
            break;

        case 'mkdir newdirectoryname':
            if (hasDestroyedShrine && currentScene === 'forest') {
                createNewPath();
            } else {
                terminal.write("Cannot create new path yet.\r\n");
            }
            break;

        default:
            terminal.write(`Command not found: ${command}\r\n`);
    }

    terminal.write("\r\n$ ");
}

function showAvailableOptions() {
    switch(currentScene) {
        case 'forest':
            if (!hasDestroyedShrine) {
                terminal.write("Available locations:\r\n1. Cave\r\n2. motherTree\r\n3. forgottenShrine\r\n");
            } else {
                terminal.write("Available locations:\r\n1. Cave\r\n2. motherTree\r\n" + 
                             (currentPath.includes('NewDirectoryName') ? "3. NewDirectoryName\r\n" : ""));
            }
            break;
        case 'cave':
            terminal.write("Nothing to explore here.\r\n");
            break;
        case 'mothertree':
            terminal.write("Nothing to explore here.\r\n");
            break;
        case 'shrine':
            terminal.write("Objectives:\r\n1. Destroy forgotten shrine\r\n2. Create a new path\r\n");
            break;
        default:
            terminal.write("No objects present.\r\n");
    }
}

// Initialize PIXI application and load assets
const app = new PIXI.Application();
app.init({ background: "#000000", resizeTo: window })
  .then(async () => {
    document.getElementById("pixi-container").appendChild(app.view);
    const textures = await loadTextures();
    createSprites(textures);
    loadForestScene();
  });

async function loadTextures() {
    return {
        forest: await PIXI.Assets.load("book.png"),
        cave: await PIXI.Assets.load("bathroom.png"),
        motherTree: await PIXI.Assets.load("door.png"),
        shrine1: await PIXI.Assets.load("preview2.png"),
        shrine2: await PIXI.Assets.load("preview3.png"),
        shrine3: await PIXI.Assets.load("preview4.png"),
        shrineDestroyed: await PIXI.Assets.load("Background.svg"),
        newPath: await PIXI.Assets.load("preview3.png")
    };
}

function createSprites(textures) {
    Object.keys(textures).forEach(key => {
        const sprite = new PIXI.Sprite(textures[key]);
        sprite.alpha = 0;
        sprite.anchor.set(0.5);
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
        app.stage.addChild(sprite);
        images[key] = sprite;
    });
}

function loadForestScene() {
    currentScene = 'forest';
    currentPath = 'forest';
    fadeOutAllSprites();
    gsap.to(images.forest, {
        alpha: 1,
        duration: 1
    });
}

function loadCaveScene() {
    currentScene = 'cave';
    currentPath = 'forest/cave';
    fadeOutAllSprites();
    gsap.to(images.cave, {
        alpha: 1,
        duration: 1
    });
}

function loadMotherTreeScene() {
    currentScene = 'mothertree';
    currentPath = 'forest/motherTree';
    fadeOutAllSprites();
    gsap.to(images.motherTree, {
        alpha: 1,
        duration: 1
    });
}

function loadShrineScene() {
    currentScene = 'shrine';
    currentPath = 'forest/forgottenShrine';
    fadeOutAllSprites();
    
    // Show shrine images in sequence
    gsap.to(images.shrine1, {
        alpha: 1,
        duration: 1,
        onComplete: () => {
            setTimeout(() => {
                gsap.to(images.shrine1, {
                    alpha: 0,
                    duration: 1,
                    onComplete: () => {
                        gsap.to(images.shrine2, {
                            alpha: 1,
                            duration: 1,
                            onComplete: () => {
                                setTimeout(() => {
                                    gsap.to(images.shrine2, {
                                        alpha: 0,
                                        duration: 1,
                                        onComplete: () => {
                                            gsap.to(images.shrine3, {
                                                alpha: 1,
                                                duration: 1
                                            });
                                        }
                                    });
                                }, 5000);
                            }
                        });
                    }
                });
            }, 5000);
        }
    });
}

function handleShrineDestruction() {
    if (currentScene === 'shrine') {
        terminal.write("You cannot be in the shrine if you want to destroy it. Get out and then destroy it!\r\n");
    } else if (currentScene === 'forest' && !hasDestroyedShrine) {
        fadeOutAllSprites();
        gsap.to(images.shrineDestroyed, {
            alpha: 1,
            duration: 1
        });
        hasDestroyedShrine = true;
        terminal.write("The forgotten shrine has been destroyed.\r\n");
    }
}

function createNewPath() {
    fadeOutAllSprites();
    gsap.to(images.newPath, {
        alpha: 1,
        duration: 1
    });
    currentPath = 'forest/NewDirectoryName';
    terminal.write("A new path has been created in the forest.\r\n");
}

function loadNewPathScene() {
    currentScene = 'newpath';
    currentPath = 'forest/newPath';
    fadeOutAllSprites();
    gsap.to(images.newPath, {
        alpha: 1,
        duration: 1,
        onComplete: () => {
            setTimeout(() => {
                gsap.to(images.newPath, {
                    alpha: 0,
                    duration: 1
                });
            }, 5000);
        }
    });
}

function fadeOutAllSprites() {
    Object.values(images).forEach(sprite => {
        gsap.to(sprite, {
            alpha: 0,
            duration: 1
        });
    });
}

// Window resize handler
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    Object.values(images).forEach(sprite => {
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
    });
});
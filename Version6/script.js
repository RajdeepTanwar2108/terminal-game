// Initialize the terminal
const terminal = new Terminal();
terminal.open(document.getElementById('terminal-container'));   

// Display a welcome message
terminal.write("Welcome to the dream portal!\r\nType 'start' to begin.\r\n$ ");

// Set up a command buffer to capture input
let commandBuffer = "";
let quoteTimer = null;

// Added initial state
let currentScene = 'initial';
let images = {};

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

// Modified command execution function
function executeCommand(command) {
    terminal.write("\r\n");
    
    switch(command.trim().toLowerCase()) {
        case 'start':
            if (currentScene === 'initial') {
                terminal.write("Starting your journey...\r\n");
                showLighthouseScene();
            }
            break;

        case 'whoami':
            if (currentScene === 'lighthouse-moved') {
                terminal.write("Initiating self-discovery...\r\n");
                showQuote();
            }
            break;

        case 'ls':
            switch(currentScene) {
                case 'lighthouse-moved':
                    terminal.write("You are in a dream type 'whoami' command to proceed.\r\n");
                    break;
                case 'bedroom':
                    terminal.write("Available options:\r\n1. dining room\r\n2. washroom\r\n3. phone\r\n");
                    break;
                case 'dining-room':
                    terminal.write("Need to brush teeth first.\r\n");
                    break;
                case 'washroom':
                    terminal.write("Available options:\r\n1. brush teeth\r\n");
                    break;
                default:
                    terminal.write("No options available.\r\n");
            }
            break;

        case 'cat phone':
            if (currentScene === 'bedroom') {
                loadPhoneScene();
            }
            break;
        case 'q':
            if(currentScene === 'phone') {
                loadBedroomScene();
            }
            break;

        case 'cd dining room':
            if (currentScene === 'bedroom') {
                loadDiningRoomScene();
            }
            break;

        case 'cd washroom':
            if (currentScene === 'bedroom') {
                loadWashroomScene();
            }
            break;

        case 'cat brush teeth':
            if (currentScene === 'washroom') {
                loadPortalScene();
            }
            break;

        case 'cd ..':
            if (['dining-room', 'washroom'].includes(currentScene)) {
                loadBedroomScene();
            }
            break;
        case 'clear':
            terminal.clear();
            terminal.scrollToTop();
            terminal.write("Welcome to the dream portal!\r\nType 'start' to begin.\r\n");
            break;

        default:
            terminal.write(`Command not found: ${command}\r\n`);
    }

    terminal.write("\r\n$ ");
}

// Initialize PIXI application and load assets
const app = new PIXI.Application();
app.init({ background: "#000000", resizeTo: window })
  .then(async () => {
    document.getElementById("pixi-container").appendChild(app.view);

    // Load all required textures
    const textures = await loadTextures();
    createSprites(textures);
    setupInitialScene();
  });

async function loadTextures() {
    return {
        lighthouse: await PIXI.Assets.load("Lighthouse.svg"),
        background: await PIXI.Assets.load("Background.svg"),
        boy: await PIXI.Assets.load("Boy.svg"),
        clouds: await PIXI.Assets.load("Clouds.svg"),
        rock : await PIXI.Assets.load("Rock.svg"),
        backgroundrock : await PIXI.Assets.load("BackgroundRock.svg"),
        backgroundrock2 : await PIXI.Assets.load("BackgroundRock2.svg"),
        bedroom: await PIXI.Assets.load("preview4.png"),
        phone: await PIXI.Assets.load("preview3.png"),
        diningRoom: await PIXI.Assets.load("preview2.png"),
        washroom: await PIXI.Assets.load("bathroom.png"),
        portal: await PIXI.Assets.load("preview3.png"),
        quote: await PIXI.Assets.load("preview2.png")
    };
}

function createSprites(textures) {
    // Create sprites for each texture with default properties
    Object.keys(textures).forEach(key => {
        const sprite = new PIXI.Sprite(textures[key]);
        sprite.alpha = 0; // Only set alpha as a default
        app.stage.addChild(sprite);
        images[key] = sprite;
    });

    // Configure individual sprites with specific properties
    // Background
    images.background.anchor.set(0.5);
    images.background.scale.set(1.0);
    images.background.x = app.screen.width / 3;
    images.background.y = app.screen.height / 2;
    images.background.zIndex = 0;

    // Lighthouse
    images.lighthouse.anchor.set(0.2);
    images.lighthouse.scale.set(0.7);
    images.lighthouse.x = app.screen.width / 13;
    images.lighthouse.y = app.screen.height / 5;
    images.lighthouse.zIndex = 2;

    // Background rock
    images.backgroundrock.anchor.set(0.5);
    images.backgroundrock.scale.set(1.0);
    images.backgroundrock.x = app.screen.width / 4;
    images.backgroundrock.y = app.screen.height / 1.63;
    images.backgroundrock.zIndex = 1;

    // Boy
    images.boy.anchor.set(0.45);
    images.boy.x = app.screen.width / 2;
    images.boy.y = app.screen.height / 2;
    images.boy.zIndex = 3;

    // Clouds
    images.clouds.anchor.set(0.5);
    images.clouds.x = app.screen.width / 2.5;
    images.clouds.y = app.screen.height / 2.5;
    images.clouds.zIndex = 0;

    // Rock
    images.rock.anchor.set(0.45);
    images.rock.x = app.screen.width / 20;
    images.rock.y = app.screen.height / 1.1;
    images.rock.zIndex = 3;

    // Background rock 2
    images.backgroundrock2.anchor.set(0.45);
    images.backgroundrock2.x = app.screen.width / 10;
    images.backgroundrock2.y = app.screen.height / 1.1;
    images.backgroundrock2.zIndex = 2;

    // Scene sprites (bedroom, phone, dining room, etc.)
    const sceneSprites = ['bedroom', 'phone', 'diningRoom', 'washroom', 'portal', 'quote'];
    sceneSprites.forEach(key => {
        if (images[key]) {
            images[key].anchor.set(0.5);
            images[key].x = app.screen.width / 3;
            images[key].y = app.screen.height / 2;
        }
    });
}

function setupInitialScene() {
    // Initial setup for lighthouse scene
    images.background.anchor.set(0.5);
    images.background.scale.set(1.0);
    const scaleFactor = Math.min(app.screen.width / background.width, app.screen.height / background.height);
    images.background.scale.set(scaleFactor);
    images.background.x = app.screen.width / 3;
    images.background.y = app.screen.height / 2;
    images.background.zIndex = 0;

    images.lighthouse.anchor.set(0.2);
    images.lighthouse.scale.set(0.7);
    images.lighthouse.x = app.screen.width / 13;
    images.lighthouse.y = app.screen.height / 5;
    images.lighthouse.zIndex = 2;

    images.backgroundrock.anchor.set(0.5);
    images.backgroundrock.scale.set(1.0);
    images.backgroundrock.x = app.screen.width / 4;
    images.backgroundrock.y = app.screen.height / 1.63;
    images.backgroundrock.zIndex = 1;

    images.boy.anchor.set(0.45);
    images.boy.x = app.screen.width / 2;
    images.boy.y = app.screen.height / 2;
    images.boy.zIndex = 3;

    images.clouds.anchor.set(0.5);
    images.clouds.x = app.screen.width / 2.5;
    images.clouds.y = app.screen.height / 2.5;
    images.clouds.zIndex = 0;

    images.rock.anchor.set(0.45);
    images.rock.x = app.screen.width / 20;
    images.rock.y = app.screen.height / 1.1;
    images.rock.zIndex = 3;

    images.backgroundrock2.anchor.set(0.45);
    images.backgroundrock2.x = app.screen.width / 10;
    images.backgroundrock2.y = app.screen.height / 1.1;
    images.backgroundrock2.zIndex = 2;
}

function showLighthouseScene() {
    currentScene = 'lighthouse';
    
    // Fade in lighthouse scene elements
    Object.values(images).forEach(sprite => {
        sprite.alpha = 0;
    });
    
    const lighthouseElements = ['lighthouse', 'background', 'boy', 'clouds','backgroundrock','rock','backgroundrock2'];
    lighthouseElements.forEach(element => {
        if (images[element]) {
            gsap.to(images[element], {
                alpha: 1,
                duration: 1,
                ease: "power1.inOut"
            });
        }
    });

    // Schedule the transition after 3 seconds
    setTimeout(() => {
        if (currentScene === 'lighthouse') {
            animateTransition();
        }
    }, 3000);
}

function showQuote() {
    currentScene = 'quote';
    
    // Fade out lighthouse scene elements
    ['lighthouse', 'background', 'boy', 'clouds','backgroundrock','rock','backgroundrock2'].forEach(element => {
        if (images[element]) {
            gsap.to(images[element], {
                alpha: 0,
                duration: 1,
                ease: "power1.inOut"
            });
        }
    });

    // Position and fade in the quote image
    if (images.quote) {
        images.quote.anchor.set(0.5);
    images.quote.x = app.screen.width / 3;
    images.quote.y = app.screen.height / 2;
        
        // Fade in quote
        gsap.to(images.quote, {
            alpha: 1,
            duration: 1,
            ease: "power1.inOut"
        });

        // Schedule quote fadeout and bedroom scene transition
        setTimeout(() => {
            if (currentScene === 'quote') {
                // Fade out quote
                gsap.to(images.quote, {
                    alpha: 0,
                    duration: 1,
                    ease: "power1.inOut",
                    onComplete: () => {
                        loadBedroomScene();
                    }
                });
            }
        }, 5000);  // Show quote for 5 seconds
    }
}

function animateTransition() {
    if (currentScene === 'lighthouse') {
        gsap.to([images.clouds, images.lighthouse], { x: '-=40', duration: 3 });
        gsap.to([images.boy, images.rock], { x: '+=40', duration: 3 });
        currentScene = 'lighthouse-moved';
    }
}

function loadBedroomScene() {
    currentScene = 'bedroom';
    // First fade out all other scenes
    const otherScenes = ['phone', 'diningRoom', 'washroom', 'portal'];
    otherScenes.forEach(scene => {
        if (images[scene]) {
            gsap.to(images[scene], {
                alpha: 0,
                duration: 1
            });
        }
    });
    
    // Then fade in bedroom
    gsap.to(images.bedroom, {
        alpha: 1,
        duration: 1
    });
}

function loadPhoneScene() {
    currentScene = 'phone';
    // First fade out bedroom completely
    gsap.to(images.bedroom, {
        alpha: 0,
        duration: 1,
        onComplete: () => {
            // Then fade in phone
            gsap.to(images.phone, {
                alpha: 1,
                duration: 1
            });
        }
    });
}


function loadDiningRoomScene() {
    currentScene = 'dining-room';
    gsap.to(images.bedroom, { alpha: 0, duration: 1 });
    gsap.to(images.diningRoom, { alpha: 1, duration: 1 });
}

function loadWashroomScene() {
    currentScene = 'washroom';
    gsap.to(images.bedroom, { alpha: 0, duration: 1 });
    gsap.to(images.washroom, { alpha: 1, duration: 1 });
}

function loadPortalScene() {
    currentScene = 'portal';
    gsap.to(images.washroom, { alpha: 0, duration: 1 });
    gsap.to(images.portal, { alpha: 1, duration: 1 });
    terminal.write("WHOAAAAAAA\r\n");
    
    // Fade out portal after 5 seconds
    setTimeout(() => {
        gsap.to(images.portal, { alpha: 0, duration: 1, onComplete: () => {
            cleanupCurrentScene();
            initializeLevel1();
        } });
    }, 5000);
}

// Window resize handler
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    // Update sprite positions
    Object.values(images).forEach(sprite => {
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
    });
});
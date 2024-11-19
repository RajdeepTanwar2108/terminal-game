// Initialize the terminal
const terminal = new Terminal();
terminal.open(document.getElementById('terminal-container'));   

// Display a welcome message
terminal.write("Welcome to the online console!\r\nType 'help' to see available commands.\r\n");

// Set up a command buffer to capture input
let commandBuffer = "";

// Handle key input in the terminal
terminal.onData((data) => {
    const code = data.charCodeAt(0);

    // If Enter key is pressed (char code 13), execute command
    if (code === 13) { 
        executeCommand(commandBuffer);
        commandBuffer = ""; // Clear the buffer after executing the command
    } 
    // If Backspace is pressed
    else if (code === 127) {
        if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            terminal.write("\b \b"); // Remove character visually
        }
    } 
    // Append other characters to the command buffer
    else {
        commandBuffer += data;
        terminal.write(data); // Display typed character in the terminal
    }
});

// Function to process commands
function executeCommand(command) {
    // Clear the line after the command
    terminal.write('\r\n');
    
    if (command.trim() === "help") {
        terminal.write("Available commands:\r\n- help: Display this help message\r\n- clear: Clear the console\r\n- ls: List options\r\n- cd [name]: Change to specified scene\r\n- cd next: Go to the next image\r\n- cd .. : Go to the previous image\r\n");
    } else if (command.trim() === "clear") {
        terminal.clear();
        terminal.write('\x1Bc');
        terminal.scrollToTop();
        commandBuffer='';
        terminal.write("Welcome to the online console!\r\nType 'help' to see available commands.\r\n");
    } else if (command.trim() === "ls") {
        if (currentScene === 2) {
            terminal.write("Options:\r\n- book\r\n- breakfast\r\n- toothbrush\r\n");
        } else {
            terminal.write("Command not available in this scene.\r\n");
        }
    } else if (command.trim() === "cd book") {
        if (currentScene === 2) {
            loadBookScene();
        } else {
            terminal.write("Command not available in this scene.\r\n");
        }
    } else if (command.trim() === "cd breakfast") {
        if (currentScene === 2) {
            loadBreakfastScene();
        } else {
            terminal.write("Command not available in this scene.\r\n");
        }
    } else if (command.trim() === "cd toothbrush") {
        if (currentScene === 2) {
            loadToothbrushScene();
        } else {
            terminal.write("Command not available in this scene.\r\n");
        }
    } else if (command.trim() === "cd next") {
        if (currentScene === 5) {
            loadPortalScene();
            terminal.write("WHOAAAAAA\r\n");
        } else if (currentScene === 2) {
            terminal.write("You need to brush your teeth.\r\n");
        } else if (currentScene === 0){
            animateTransition();
        } else if (currentScene === 1){
            loadSingleImageScene();
        }
    } else if (command.trim() === "cd ..") {
        if (currentScene === 3 || currentScene === 4 || currentScene === 5) {
            loadSingleImageScene();
        } else if (currentScene === 2) {
            resetTransition();
        } else if (currentScene === 1) {
            resetTransition();
        }
    } else {
        terminal.write(`Command not found: ${command}\r\n`);
    }

    // Prompt for next input
    terminal.write("\r\n$ ");
}

// Initial prompt
terminal.write("$ ");

// Initialize the PIXI application
const app = new PIXI.Application();
app
  .init({ background: "#000000", resizeTo: window })
  .then(async () => {
    document.getElementById("pixi-container").appendChild(app.view);

    // Load image textures
    const backgroundTexture = await PIXI.Assets.load("Background.svg");
    const lighthouseTexture = await PIXI.Assets.load("Lighthouse.svg");
    const boyTexture = await PIXI.Assets.load("Boy.svg");
    const cloudsTexture = await PIXI.Assets.load("Clouds.svg");
    const rockTexture = await PIXI.Assets.load("Rock.svg");
    const BackgroundrockTexture = await PIXI.Assets.load("BackgroundRock.svg");
    const Backgroundrock2Texture = await PIXI.Assets.load("BackgroundRock2.svg");
    const singleImageTexture = await PIXI.Assets.load("preview4.png");
    const bookImageTexture = await PIXI.Assets.load("book.png");
    const doorImageTexture = await PIXI.Assets.load("door.png");
    const bathroomImageTexture = await PIXI.Assets.load("bathroom.png");

    // Create sprites from textures
    const background = PIXI.Sprite.from(backgroundTexture);
    const lighthouse = PIXI.Sprite.from(lighthouseTexture);
    const boy = PIXI.Sprite.from(boyTexture);
    const clouds = PIXI.Sprite.from(cloudsTexture);
    const rock = PIXI.Sprite.from(rockTexture);
    const backgroundrock = PIXI.Sprite.from(BackgroundrockTexture);
    const backgroundrock2 = PIXI.Sprite.from(Backgroundrock2Texture);
    const singleImageSprite = new PIXI.Sprite(singleImageTexture);
    const bookImageSprite = new PIXI.Sprite(bookImageTexture);
    const doorImageSprite = new PIXI.Sprite(doorImageTexture);
    const bathroomImageSprite = new PIXI.Sprite(bathroomImageTexture);

    // Configure background (static, centered)
    background.anchor.set(0.5);
    background.scale.set(1.0);
    const scaleFactor = Math.min(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(scaleFactor);
    background.x = app.screen.width / 3;
    background.y = app.screen.height / 2;
    background.zIndex = 0;

    // Configure other elements based on initial scene
    lighthouse.anchor.set(0.2);
    lighthouse.scale.set(0.7);
    lighthouse.x = app.screen.width / 13;
    lighthouse.y = app.screen.height / 5;
    lighthouse.zIndex = 2;

    backgroundrock.anchor.set(0.5);
    backgroundrock.scale.set(1.0);
    backgroundrock.x = app.screen.width / 4;
    backgroundrock.y = app.screen.height / 1.63;
    backgroundrock.zIndex = 1;

    boy.anchor.set(0.45);
    boy.x = app.screen.width / 2;
    boy.y = app.screen.height / 2;
    boy.zIndex = 3;

    clouds.anchor.set(0.5);
    clouds.x = app.screen.width / 2.5;
    clouds.y = app.screen.height / 2.5;
    clouds.zIndex = 0;

    rock.anchor.set(0.45);
    rock.x = app.screen.width / 20;
    rock.y = app.screen.height / 1.1;
    rock.zIndex = 3;

    backgroundrock2.anchor.set(0.45);
    backgroundrock2.x = app.screen.width / 10;
    backgroundrock2.y = app.screen.height / 1.1;
    backgroundrock2.zIndex = 2;

    singleImageSprite.anchor.set(0.5);
    singleImageSprite.x = app.screen.width / 3;
    singleImageSprite.y = app.screen.height / 2;
    singleImageSprite.alpha = 0;

    bookImageSprite.anchor.set(0.5);
    bookImageSprite.x = app.screen.width / 3;
    bookImageSprite.y = app.screen.height / 2;
    bookImageSprite.alpha = 0;

    doorImageSprite.anchor.set(0.5);
    doorImageSprite.x = app.screen.width / 3;
    doorImageSprite.y = app.screen.height / 2;
    doorImageSprite.alpha = 0;

    bathroomImageSprite.anchor.set(0.5);
    bathroomImageSprite.x = app.screen.width / 3;
    bathroomImageSprite.y = app.screen.height / 2;
    bathroomImageSprite.alpha = 0;

    // Add elements to the stage
    app.stage.addChild(background, clouds, lighthouse, boy, rock, backgroundrock, backgroundrock2, singleImageSprite, bookImageSprite, doorImageSprite, bathroomImageSprite);

    // Store elements for manipulation
    images = { background, lighthouse, boy, clouds, rock, backgroundrock, backgroundrock2, singleImageSprite, bookImageSprite, doorImageSprite, bathroomImageSprite};
    updateAssetPositions();

  })
  .catch(error => {
    console.error("Error initializing Pixi.js application:", error);
  });

let images = {};
let currentScene = 0;

// Function to animate transition on 'cd next' command
function animateTransition() {
    gsap.to(images.clouds, { x: images.clouds.x - 50, duration: 3 });
    gsap.to(images.lighthouse, { x: images.lighthouse.x - 30, duration: 3 });
    gsap.to(images.boy, { x: images.boy.x + 30, duration: 3 });
    gsap.to(images.rock, { x: images.rock.x + 30, duration: 3 });
    currentScene = 1;
}

// Function to reset elements to original positions on 'cd..' command
function resetTransition() {
    gsap.to(images.clouds, { x: images.clouds.x + 50, duration: 0.5 });
    gsap.to(images.lighthouse, { x: images.lighthouse.x + 30, duration: 0.5 });
    gsap.to(images.boy, { x: images.boy.x - 30, duration: 0.5 });
    gsap.to(images.rock, { x: images.rock.x - 30, duration: 0.5 });
    currentScene = 0;
}

// Function to show the single image scene with fade-in effect
function loadSingleImageScene() {
    images.singleImageSprite.alpha = 1;  // Show single image
    gsap.to(Object.values(images).filter(img => img !== images.singleImageSprite), { alpha: 0, duration: 1 });
    currentScene = 2;
}

// Function to go back from single image scene to the original scene
function animateTransitionBack() {
    gsap.to(images.singleImageSprite, { alpha: 0, duration: 1 });
    gsap.to(Object.values(images).filter(img => img !== images.singleImageSprite), { alpha: 1, duration: 1 });
    currentScene = 0;
}

// Function to show single image of book with fade-in effect
function loadBookScene() {
    images.bookImageSprite.alpha = 1;  // Show single image
    gsap.to(Object.values(images).filter(img => img !== images.bookImageSprite), { alpha: 0, duration: 1 });
    currentScene = 3;
}

// Function to show single image of book with fade-in effect
function loadBreakfastScene() {
    images.doorImageSprite.alpha = 1;  // Show single image
    gsap.to(Object.values(images).filter(img => img !== images.doorImageSprite), { alpha: 0, duration: 1 });
    currentScene = 4;
}

// Function to show single image of book with fade-in effect
function loadToothbrushScene() {
    images.bathroomImageSprite.alpha = 1;  // Show single image
    gsap.to(Object.values(images).filter(img => img !== images.bathroomImageSprite), { alpha: 0, duration: 1 });
    currentScene = 5;
}

// Function to show the portal scene (fade to black)
function loadPortalScene() {
    gsap.to(images.bathroomImageSprite, { alpha: 0, duration: 1 });
    gsap.to(document.body, { backgroundColor: "black", duration: 1 });
    currentScene = 6;
}

function updateAssetPositions() {
    const scaleFactor = Math.min(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(scaleFactor);
    background.x = app.screen.width / 3;
    background.y = app.screen.height / 2;

    lighthouse.x = app.screen.width / 13;
    lighthouse.y = app.screen.height / 5;

    backgroundrock.x = app.screen.width / 4;
    backgroundrock.y = app.screen.height / 1.63;

    boy.x = app.screen.width / 2;
    boy.y = app.screen.height / 2;

    clouds.x = app.screen.width / 2.5;
    clouds.y = app.screen.height / 2.5;

    rock.x = app.screen.width / 20;
    rock.y = app.screen.height / 1.1;

    backgroundrock2.x = app.screen.width / 10;
    backgroundrock2.y = app.screen.height / 1.1;

    singleImageSprite.x = app.screen.width / 3;
    singleImageSprite.y = app.screen.height / 2;

    bookImageSprite.x = app.screen.width / 3;
    bookImageSprite.y = app.screen.height / 2;

    doorImageSprite.x = app.screen.width / 3;
    doorImageSprite.y = app.screen.height / 2;

    bathroomImageSprite.x = app.screen.width / 3;
    bathroomImageSprite.y = app.screen.height / 2;
}

// Add event listener for window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateAssetPositions();
});

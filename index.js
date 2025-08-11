const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 10;
let y = 10;

let speed = 5;

let playerWidth = 48;
let playerHeight = 48;
let playerIMG = new Image();
playerIMG.src = "textures/player.png";

let panel = new Image();
panel.src = "textures/panel.jpg"

let money = 0;

document.getElementById("money").textContent = localStorage.getItem("money");

let newMoney = parseInt(localStorage.getItem("money"));
if (!isNaN(newMoney)) {
  money = newMoney;
}

window.onload = function() { renderMap(); }

let keys = {};

class Obj {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

const wall1 = new Obj(canvas.width / 4, canvas.height - 450, 50, 450);
const wall2 = new Obj(canvas.width / 4, canvas.height - canvas.height, 50, 400);
const terminal1 = new Obj(900, 10, 125, 50);
const floor1 = new Obj(canvas.width / 4, 0, canvas.width - canvas.width / 4, 1000);
const plantPot1 = new Obj(canvas.width / 4 + 100, 750, 300, 200);

let wall1IMG = new Image();
wall1IMG.src = "textures/Metal/metal17.png";

let wall2IMG = new Image();
wall2IMG.src = "textures/Metal/metal17.png";

let floor1IMG = new Image();
floor1IMG.src = "textures/Metal/metal12.png";

let plantPot1IMG = new Image();
plantPot1IMG.src = "textures/Dirt/dirt4.png";

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => { 
    keys[event.key] = false;                   
});

let AI_IMG = new Image();
AI_IMG.src = "textures/player.png";

let aiX = Math.floor(Math.random() * canvas.width);
let aiY = Math.floor(Math.random() * canvas.height);

let aiWidth = 48;
let aiHeight = 48;

function mineBitcoin() {
    const bitcoinInterval = setInterval(function() {
        let SHA = Math.floor(Math.random() * (100000 - 10000) + 10000);
        let newBitcoin = document.createElement("div");
        newBitcoin.className = "bitcoin";
        newBitcoin.innerHTML = `SHA256(0x${SHA})`;
        document.getElementById("terminal").appendChild(newBitcoin);

        if(SHA > 99900) {
            money += Math.floor(Math.random() * (50 - 10) + 10);
            localStorage.setItem("money", money);
            document.getElementById("money").textContent = money;
        }
    }, 50);

    document.getElementById("stopBitcoin").onclick = function() {
        clearInterval(bitcoinInterval);
    }

    if(!isCollidingX(x, playerWidth, terminal1.x, terminal1.width)) { clearInterval(bitcoinInterval); }
    if(!isCollidingY(y, playerHeight, terminal1.y, terminal1.height)) { clearInterval(bitcoinInterval); }
}

function AI() {   
    ctx.drawImage(AI_IMG, aiX, aiY, 48, 48);

    setInterval(function() {
        let old_AI_X = aiX;
        let old_AI_Y = aiY;
        let AI_random_chance = Math.floor(Math.random() * 100) + 1;

        if(AI_random_chance < 25) {
            aiX += speed;
        }

        if(AI_random_chance > 25 && AI_random_chance < 50) {
            aiX -= speed;
        }

        if(AI_random_chance < 75 && AI_random_chance > 50) {
            aiY += speed;
        }

        if(AI_random_chance < 100 && AI_random_chance > 75) {
            aiY -= speed;
        }

        if (
            isCollidingX(aiX, aiWidth, wall1.x, wall1.width) &&
            isCollidingY(aiY, aiHeight, wall1.y, wall1.height)
        ) {
            aiX = old_AI_X;
            aiY = old_AI_Y;
        }

        if (
            isCollidingX(aiX, aiWidth, wall2.x, wall2.width) &&
            isCollidingY(aiY, aiHeight, wall2.y, wall2.height)
        ) {
            aiX = old_AI_X;
            aiY = old_AI_Y;
        }

        if(aiX <= 0) { aiX += speed; }
        if(aiY <= 0) {aiY += speed; }
        if(aiX >= canvas.width - 45) { aiX -= speed; }
        if(aiY >= canvas.height - 45) { aiY -= speed; }

        ctx.drawImage(AI_IMG, aiX, aiY, 48, 48);
    }, 150);
}

AI();

let floor1PAT = null;

floor1IMG.onload = function() { floor1PAT = ctx.createPattern(floor1IMG, "repeat"); }

function renderMap() {
    ctx.beginPath();
    ctx.rect(floor1.x, floor1.y, floor1.width, floor1.height);
    ctx.fillStyle = floor1PAT;
    ctx.fill();
    ctx.drawImage(plantPot1IMG, plantPot1.x, plantPot1.y, plantPot1.width, plantPot1.height);
    ctx.fillStyle = "green";
    ctx.fillRect(plant_random_x, plant_random_y, plant_width, plant_height);
    ctx.drawImage(AI_IMG, aiX, aiY, aiWidth, aiHeight);
    ctx.drawImage(playerIMG, x, y, playerWidth, playerHeight);
    ctx.drawImage(wall1IMG, wall1.x, wall1.y, wall1.width, wall1.height);
    ctx.drawImage(wall2IMG, wall2.x, wall2.y, wall2.width, wall2.height);
    ctx.drawImage(panel, terminal1.x, terminal1.y, terminal1.width, terminal1.height);
}

let plant_random_x = Math.floor(Math.random() * ((canvas.width / 4 + 100) - (canvas.width / 4 + 300))) + canvas.width / 4 + 300;
let plant_random_y = Math.floor(Math.random() * (890 - 830)) + 830;

let plant_width = 25;
let plant_height = 25;

function plant() {
    ctx.fillStyle = "green"; 
    ctx.fillRect(plant_random_x, plant_random_y, plant_width, plant_height);
}

function newPlant() {
    money++;
    plant_random_x = Math.floor(Math.random() * ((canvas.width / 4 + 100) - (canvas.width / 4 + 300))) + canvas.width / 4 + 300;
    plant_random_y = Math.floor(Math.random() * (890 - 830)) + 830;
}

function isCollidingX(x1, w1, x2, w2) { return x1 < x2 + w2 && x1 + w1 > x2; }
function isCollidingY(y1, h1, y2, h2) { return y1 < y2 + h2 && y1 + h1 > y2; }

const names = [
    "Bob",
    "Greg",
    "Luke"
];

const randomName = names[Math.floor(Math.random() * names.length)];

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let oldX = x;
    let oldY = y;

    if(keys["w"]) { y -= speed; }
                                 
    if(keys["s"]) { y += speed; }

    if(keys["a"]) { x -= speed; }

    if(keys["d"]) { x += speed; }

    if(x <= 0) { x += speed; }
    if(y <= 0) { y += speed; }
    if(x >= canvas.width - 45) { x -= speed; }
    if(y >= canvas.height - 45) { y -= speed; }

    if (
        isCollidingX(x, playerWidth, wall1.x, wall1.width) &&
        isCollidingY(y, playerHeight, wall1.y, wall1.height)
    ) {
        x = oldX;
        y = oldY;
    }

    if (
        isCollidingX(x, playerWidth, wall2.x, wall2.width) &&
        isCollidingY(y, playerHeight, wall2.y, wall2.height)
    ) {
        x = oldX;
        y = oldY;
    }

    if (
        isCollidingX(x, playerWidth, aiX, aiWidth) &&
        isCollidingY(y, playerHeight, aiY, aiHeight)
    ) {
        on("dialog");
        if(keys[" "]) {
            on("shop")
        }
    }

    if(isCollidingX(x, playerWidth, plant_random_x, plant_width)) { newPlant(); }
    if(isCollidingY(y, playerHeight, plant_random_y, plant_height)) { newPlant(); }

    if(!isCollidingX(x, playerWidth, aiX, aiWidth)) { off("dialog"); }
    if(!isCollidingY(y, playerHeight, aiY, aiHeight)) { off("dialog"); }

    if(isCollidingX(x, playerWidth, terminal1.x, terminal1.width)) { on("terminal"); }
    if(isCollidingY(y, playerHeight, terminal1.y, terminal1.height)) { on("terminal"); }

    if(!isCollidingX(x, playerWidth, terminal1.x, terminal1.width)) { off("terminal"); }
    if(!isCollidingY(y, playerHeight, terminal1.y, terminal1.height)) { off("terminal"); }

    document.getElementById("dialog").style.left = aiX - 30 + "px";
    document.getElementById("dialog").style.top = aiY - 45 + "px";
    document.getElementById("dialog").innerHTML = randomName;

    ctx.drawImage(playerIMG, x, y, playerWidth, playerHeight); 
    renderMap();
    requestAnimationFrame(gameLoop);
}

canvas.onclick = function() {
    off("terminal");
    off("shop");
}

function on(id) { document.getElementById(id).style.display = "block" }
function off(id) { document.getElementById(id).style.display = "none" }

gameLoop();
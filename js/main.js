document.title = "Blast Mania";

class Controller {
    constructor() {
        this.down = new Array(5);
        this.glow = new Array(5);
    }

    hit(index) {
        this.glow[index] = performance.now() + 250.0;
    }
    pressed(index, trigger) {
        if (trigger)
            this.glow[index] = performance.now() + 250.0;
        this.down[index] = trigger;
    }
}
class Main {
    rotation = 0;

    /**
     * @param { number } tickrate 
     */
    constructor(tickrate) {
        this.tickrate = tickrate;

        this.canvas = document.createElement("canvas");
        
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        
        this.canvas.style.position = "absolute";
        this.canvas.style.display = "block";
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";

        document.body.appendChild(this.canvas);

        this.graphics = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.graphics, this.canvas.width, this.canvas.height);

        this.controller = new Controller();
        this.input = new Input(this);

        /** @type { Array<Menu> } */
        this.menus = new Array();
        /** @type { Noteskin } */
        this.noteskin = undefined;

        window.addEventListener("resize", () => this.resize(innerWidth, innerHeight));

        document.addEventListener("keydown", (e) => this.input.keypress(e.key, e.code, true, e.repeat));
        document.addEventListener("keyup", (e) => this.input.keypress(e.key, e.code, false, false));
    }

    init() {
        this.img_arrow = Main.loadImage("assets/arrow.png");
        this.img_arrow_glow = Main.loadImage("assets/arrow-glow.png");
        this.img_arrow_receptor = Main.loadImage("assets/arrow-receptor.png");

        this.noteskin = new Noteskin(
            [ -90, 0, 0, 90, 180, ],
            [
                [ this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor ],
                [ this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor ],
                [ this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor ],
                [ this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor ],
                [ this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor ],
            ]
        )

        this.menus.push(new MainMenu(this));
        this.menus.push(new GameMenu(this));
        this.menus[0].hidden = false;

        this.menus.forEach((e) => { e.resize(this.canvas.width, this.canvas.height) });
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.menus.forEach((e) => { e.resize(width, height) });
    }

    update() {
        this.menus.forEach((e) => { if (e.hidden) return; e.update() });
    }

    draw() {
		this.graphics.fillStyle = "#fff";
        this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.menus.forEach((e) => {
            if (e.hidden) return; e.draw();
            this.renderer.drawImage(e.canvas, 0, 0, this.canvas.width, this.canvas.height)
        });
    }

    /**
     * @param { string } path
     * @param { HTMLAudioElement } 
     */
    static loadAudio(path) {
        return new Audio(path);
    }

    /**
     * @param { string } path 
     * @returns { HTMLImageElement }
     */
    static loadImage(path) {
        const image = new Image();
        if (!path.startsWith("data:"))
            image.src = "./".concat(path);
        else
            image.src = path;

        return image;
    }

    static loadFile() {
        const openFile = document.createElement("input");
        openFile.type = "file";
        openFile.click();

        openFile.addEventListener("change", (e) => {
            let fr = new FileReader();
            fr.addEventListener("load", (e) => {
                return fr.result;
            });
            fr.readAsDataURL(openFile.files.item(0));
        });
    }

    /**
     * @param { string } name 
     * @param { string } data 
     */
    static storeInfo(name, data) {
        localStorage.setItem("blastmania-".concat(name), data);
    }
}

const _main = new Main(64);

let text = "Click the frame to start Blast-Mania!";
_main.graphics.fillText(text, _main.canvas.width / 2 - _main.graphics.measureText(text).width / 2, _main.canvas.height / 2);
function start() {
    document.removeEventListener("mousedown", start);
    _main.init();

    setTimeout(() => {
        setInterval(() => { _main.update(); }, 1000.0 / _main.tickrate);
    
        function drawloop() { _main.draw(); requestAnimationFrame(drawloop) }
        requestAnimationFrame(drawloop);
    }, 200);
}

document.addEventListener("mousedown", start);
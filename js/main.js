document.title = "Blast Mania";

// The controller handles inputs and animations.
class Controller {
    /**
     * @param { Main } main 
     */
    constructor(main) {
        this.main = main;

        this.down = new Array(5);
        this.glow = new Array(5);
        this.index = new Array(5);
    }

    chartLoaded() {
        for (let i = 0; i < 5; i++) {
            this.index[i] = 0;
            this.find(i);
        }
    }

    /**
     * @param { number } index 
     */
    find(index) {
        if (this.index[index] < 0)
            return;

        for (let i = this.index[index]; i < this.main.chart.getSize(); i++) {
            const note = this.main.chart.notes[i];

            if (note.lane == index) {
                this.index[index] = i;
                return;
            }
        }
        this.index[index] = -1;
    }

    /**
     * @param { number } index 
     */
    hit(index) {
        if (this.index[index] >= 0) {
            const note = this.main.chart.notes[this.index[index]];
            if (Math.abs(note.time - (performance.now() - this.main.start)) < 100) {
                this.index[index]++;
                this.find(index);
                this.glow[index] = performance.now() + 250.0;
            }
        }
    }
    /**
     * @param { number } index 
     * @param { boolean } trigger 
     */
    pressed(index, trigger) {
        if (trigger)
            this.hit(index);
        this.down[index] = trigger;
    }
}

// The Main class is the main part of Blast-Mania.
class Main {
    playable = false;
    start = 0;

    /**
     * @param { number } tickrate 
     */
    constructor(tickrate) {
        this.tickrate = tickrate;

        // Setting up the canvas to draw stuff.
        this.canvas = document.createElement("canvas");
        
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        
        this.canvas.style.position = "absolute";
        this.canvas.style.display = "block";
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";

        document.body.appendChild(this.canvas);

        // Graphics classes.
        this.graphics = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.graphics, this.canvas.width, this.canvas.height);

        // Input classes.
        this.controller = new Controller(this);
        this.input = new Input(this);

        // Creating the menu list.
        /** @type { Array<Menu> } */
        this.menus = new Array();

        // Creating the chart (without any metadata of course).
        this.chart = new Chart();
        /** @type { Noteskin } */
        this.noteskin = undefined;

        // Creating the players list for each profile saved.
        /** @type { Array<Player> } */
        this.playerList = new Array(0);
        this.playerIndex = 0;

        // Checks for a resize, then acts accordingly.
        window.addEventListener("resize", () => this.resize(innerWidth, innerHeight));

        // Key inputs.
        document.addEventListener("keydown", (e) => this.input.keypress(e.key, e.code, true, e.repeat));
        document.addEventListener("keyup", (e) => this.input.keypress(e.key, e.code, false, false));
    }

    init() {
        this.chart.setBPM(128);
        let pos = 0;
        for (let i = 0; i < 1024; i++) {
            pos += (Math.round(Math.random()) * 2) - 1;
            if (pos < 0) {
                pos = 4;
            } else if (pos > 4) {
                pos = 0;
            }

            this.chart.addNoteBeat(pos, i / 6.0, 0.0);
        }
        this.chart.sort();

        let storedPlayers = localStorage.getItem("blastmania-players");
        if (storedPlayers != null) {
            storedPlayers = JSON.parse(storedPlayers);
            storedPlayers.forEach(e => {
                console.log(e);

                let player = Player.loadPlayer(e.name, e.icon, e.exp);
                this.playerList.push(player);
                console.log(player);
            });
        }

        this.img_arrow = Main.loadImage("./assets/arrow.png");
        this.img_arrow_glow = Main.loadImage("./assets/arrow-glow.png");
        this.img_arrow_receptor = Main.loadImage("./assets/arrow-receptor.png");

        this.noteskin = new Noteskin(
            [ -90, 0, 45, 90, 180, ],
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
        this.menus.push(new SettingsMenu(this));
        this.menus[0].hidden = false;

        this.menus.forEach((e) => { e.resize(this.canvas.width, this.canvas.height) });
    }

    updatePlayers() {
        let data = [];
        this.playerList.forEach(e => {
            data.push({
                name: e.name,
                icon: e.iconsrc,
                exp: e.exp
            });
        });
        console.log(data);
        Main.storeInfo("players", JSON.stringify(data));
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
		this.renderer.clear(null)

        this.menus.forEach((e) => {
            if (e.hidden) return; e.draw();
            this.renderer.drawImage(e.canvas, 0, 0);
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
        image.src = path;

        return image;
    }

    /**
     * @param { Function } func 
     */
    static loadFile(func) {
        const openFile = document.createElement("input");
        openFile.type = "file";
        openFile.click();

        openFile.addEventListener("change", (e) => {
            let fr = new FileReader();
            fr.addEventListener("load", (e) => {
                func(fr.result);
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

// Creating a Main class with a tickrate of 64.
const _main = new Main(64);

// Creating a text variable and drawing it to indicate to the player to click the frame.
let text = "Click the frame to start Blast-Mania!";
_main.graphics.fillText(text, _main.canvas.width / 2 - _main.graphics.measureText(text).width / 2, _main.canvas.height / 2);

// This is called once the event listener calls the handler.
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
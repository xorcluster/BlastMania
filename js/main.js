document.title = "Blast Mania";

// The controller handles inputs and animations.
class Controller {
    /**
     * @param { Main } main 
     */
    constructor(main) {
        this.main = main;

        this.down = new Array(5);
        this.holding = new Array(5);
        this.glow = new Array(5);
        this.index = new Array(5);

        this.judges = 0;
        this.judgement = 0;
        this.judgecount = new Array(Input.judgements.jtimes.length);
    }

    chartLoaded() {
        this.main.combo = 0;
        for (let i = 0; i < this.judgecount.length; i++) {
            this.judgecount[i] = 0;
        }

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
            const time = Math.abs(note.time - (performance.now() - this.main.start)); 
            if (time <= Input.judgements.getMiss()) {
                if (note.length == 0) {
                    this.index[index]++;
                    this.find(index);
                    this.glow[index] = performance.now() + 250.0;
                } else {
                    this.holding[index] = true;
                }
                this.judgement = Input.judgements.findJudgement(time);
                this.judgecount[this.judgement]++;
                this.judges++;

                if (!Input.judgements.isComboBreak(this.judgement)) {
                    this.main.combo++;
                } else {
                    this.main.combo = 0;
                }
            }
        }
    }
    /**
     * @param { number } index 
     * @param { boolean } trigger 
     */
    pressed(index, trigger) {
        if (trigger) {
            this.glow[index] = performance.now() + 125.0;
            if (!this.down[index]) {
                this.hit(index);
            }
        } else {
            if (this.index[index] >= 0 && this.holding[index]) {
                const note = this.main.chart.notes[this.index[index]];
                const time = Math.abs((note.time + note.length) - (performance.now() - this.main.start)); 

                if (note.length > 0) {
                    this.index[index]++;
                    this.find(index);
                    this.glow[index] = performance.now() + 250.0;

                    if (time > Input.judgements.getMiss()) {
                        this.judgement = Input.judgements.jtimes.length - 1;
                    } else {
                        this.judgement = 0;
                    }
                    this.judgecount[this.judgement]++;
                    this.judges++;

                    this.main.combo++;

                    this.holding[index] = false;
                }
            }
        }
        this.down[index] = trigger;
    }
}

// The Main class is the main part of Blast-Mania.
class Main {
    maxexp = 0;
    currentexp = 0;

    combo = 0;

    start = false;
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
        this.chart = new Chart("null", "null", "null", "null", crypto.randomUUID());
        /** @type { Skin } */
        this.noteskin = undefined;
        /** @type { Grade } */
        this.gradeskin = undefined;

        // Creating the players list for each profile saved.
        /** @type { Array<Player> } */
        this.playerList = new Array(0);

        let pi = localStorage.getItem("blastmania-player-index");
        this.playerIndex = pi != null? pi : 0;

        // Checks for a resize, then acts accordingly.
        window.addEventListener("resize", (e) => this.resize(innerWidth, innerHeight));

        // Key inputs.
        document.addEventListener("keydown", (e) => this.input.keypress(e.key, e.code, true, e.repeat));
        document.addEventListener("keyup", (e) => this.input.keypress(e.key, e.code, false, false));
    }

    init() {
        let progress = 0;

        this.chart.setBPM(140);
        let pos = 0;
        for (let i = 0; i < 16; i++) {
            pos += (Math.round(Math.random()) * 2) - 1;
            if (pos < 0) {
                pos = 4;
            } else if (pos > 4) {
                pos = 0;
            }

            this.chart.addNoteBeat(pos, i / 4.0, 0);
        }
        this.chart.sort();

        console.log(EXPEngine.calculate(this.chart));

        let storedPlayers = localStorage.getItem("blastmania-players");
        if (storedPlayers != null) {
            storedPlayers = JSON.parse(storedPlayers);
            storedPlayers.forEach(e => {
                let player = Player.loadPlayer(e.name, e.icon);
                if (e.exp == null) {                
                
                    let plays = JSON.parse(e.plays);
                    plays.forEach(p => {
                        player.plays.push(new Exp(p.uuid, p.exp));
                    });
                }
                this.playerList.push(player);
            });
        }

        console.log(this.playerList);

        if (this.playerList.length > 0) {
            console.log("found");
        }

        this.img_arrow = Main.loadImage("./assets/arrow.png");
        this.img_arrow_glow = Main.loadImage("./assets/arrow-glow.png");
        this.img_arrow_receptor = Main.loadImage("./assets/arrow-receptor.png");
        this.img_pad = Main.loadImage("./assets/pad.png");
        this.img_pad_glow = Main.loadImage("./assets/pad-glow.png");
        this.img_pad_receptor = Main.loadImage("./assets/pad-receptor.png");
        this.img_long_body = Main.loadImage("./assets/long-body.png");
        this.img_long_end = Main.loadImage("./assets/long-end.png");

        this.img_grade_star4 = Main.loadImage("./assets/grade-star4.png");
        this.img_grade_star3 = Main.loadImage("./assets/grade-star3.png");
        this.img_grade_star2 = Main.loadImage("./assets/grade-star2.png");
        this.img_grade_star1 = Main.loadImage("./assets/grade-star1.png");
        this.img_grade_s = Main.loadImage("./assets/grade-s.png");
        this.img_grade_a = Main.loadImage("./assets/grade-a.png");
        this.img_grade_b = Main.loadImage("./assets/grade-b.png");
        this.img_grade_c = Main.loadImage("./assets/grade-c.png");
        this.img_grade_d = Main.loadImage("./assets/grade-d.png");
        this.img_grade_e = Main.loadImage("./assets/grade-e.png");
        this.img_grade_f = Main.loadImage("./assets/grade-f.png");

        this.arrownotetex = new NoteTexture(this.img_arrow, this.img_arrow_glow, this.img_arrow_receptor, this.img_long_body, this.img_long_end);
        this.padnotetex = new NoteTexture(this.img_pad, this.img_pad_glow, this.img_pad_receptor, this.img_long_body, this.img_long_end);

        this.noteskin = new Skin(
            [ -90, 0, 0, 90, 180, ],
            [
                this.arrownotetex,
                this.arrownotetex,
                this.padnotetex,
                this.arrownotetex,
                this.arrownotetex,
            ]
        )
        this.gradeskin = new Grade(
            [
                this.img_grade_star4,
                this.img_grade_star3,
                this.img_grade_star2,
                this.img_grade_star1,
                this.img_grade_s,
                this.img_grade_a,
                this.img_grade_b,
                this.img_grade_c,
                this.img_grade_d,
                this.img_grade_e,
                this.img_grade_f,
            ],
            [
                99.5,
                98.75,
                97.5,
                95.0,
                90.0,
                80.0,
                70.0,
                60.0,
                50.0,
                25.0,
                0.0,
            ]
        );

        this.img_arrow.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_arrow_glow.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_arrow_receptor.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_pad.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_pad_glow.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_pad_receptor.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_long_body.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_long_end.addEventListener("load", () => { progress++; this.checkStart(progress) });

        this.img_grade_star4.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_star3.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_star2.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_star1.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_s.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_a.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_b.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_c.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_d.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_e.addEventListener("load", () => { progress++; this.checkStart(progress) });
        this.img_grade_f.addEventListener("load", () => { progress++; this.checkStart(progress) });
        
        this.menus.push(new MainMenu(this));
        this.menus.push(new GameMenu(this));
        this.menus.push(new SettingsMenu(this));
        this.menus[0].hidden = false;

        this.menus.forEach((e) => { e.resize(this.canvas.width, this.canvas.height) });
    }

    checkStart(progress) {
        if (progress >= 19) {
            this.start = true;
        }
    }

    updatePlayers() {
        let data = [];
        this.playerList.forEach(e => {
            data.push({
                name: e.name,
                icon: e.iconsrc,
                plays: e.plays != null? JSON.stringify(e.plays) : JSON.stringify([]),
            });
            console.log(JSON.stringify(e.plays));
        });
        console.log(data);
        Main.storeInfo("players", JSON.stringify(data));
        this.playerIndex = Math.min(this.playerIndex, this.playerList.length);
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.renderer.resize(width, height);

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

    /**
     * @param { Main } main 
     */
    static isPlayer(main) {
        if (main.playerList.length > 0) {
            if (main.playerIndex >= main.playerList.length)
                return false;

            return true;
        }
        return false;
    }
}

// Creating a Main class with a tickrate of 64.
const _main = new Main(64);
const _version = "beta-2-28-24";

// Creating a text variable and drawing it to indicate to the player to click the frame.
let text = "Click the frame to start Blast-Mania!";
_main.graphics.fillText(text, _main.canvas.width / 2 - _main.graphics.measureText(text).width / 2, _main.canvas.height / 2);

// This is called once the event listener calls the handler.
function start() {
    document.removeEventListener("mousedown", start);
    document.addEventListener("dragover", (e) => e.preventDefault());
 
    window.addEventListener("error", (e) => alert(e.message.concat(", ", e.filename, ", Line: ", e.lineno, ", Column:", e.colno)));

    let versionCheck = localStorage.getItem("blastmania-version");
    if (versionCheck == null || versionCheck != _version) {
        if (versionCheck == null) {
            localStorage.clear();
        }
        localStorage.setItem("blastmania-version", _version);
    }

    _main.init();    

    setTimeout(attempt, 500);
}
function attempt() {
    if (!_main.start)
        setTimeout(attempt, 500);

    setInterval(() => { _main.update(); }, 1000.0 / _main.tickrate);
    
    function drawloop() { _main.draw(); requestAnimationFrame(drawloop) }
    requestAnimationFrame(drawloop);
}

document.addEventListener("mousedown", start);

document.title = "Blast Mania";

class Main {
    rotation = 0;

    /**
     * @param {*} tickrate 
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

        const arrow = new OffscreenCanvas(128, 128);
        {
            let g = arrow.getContext("2d");

            g.beginPath();
            g.lineTo(0, 0);
            g.lineTo(0, 128);
            g.lineTo(32, 128);
            g.lineTo(32, 32);
            
            g.lineTo(32, 56);
            g.lineTo(104, 128);
            g.lineTo(128, 104);
            g.lineTo(56, 32);
            g.lineTo(32, 32);

            g.lineTo(128, 32);
            g.lineTo(128, 0);
            g.fill();
        }

        const middle = new OffscreenCanvas(128, 128);
        {
            let g = middle.getContext("2d");

            g.lineWidth = 4;

            g.beginPath();
            g.roundRect(0, 0, 128, 128, 32);
            g.closePath();
            g.fill();
        }

        this.graphics = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.graphics, this.canvas.width, this.canvas.height);

        {
            const noteskin = new Noteskin(
                [ -90, 0, 0, 90, 180 ],
                [
                    [ arrow ],
                    [ arrow ],
                    [ middle ],
                    [ arrow ],
                    [ arrow ],
                ]
            )

            this.stage = new Stage(noteskin);
        }

        this.resize(innerWidth, innerHeight);
        window.addEventListener("resize", () => this.resize(innerWidth, innerHeight));
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.resize(this.canvas.width, this.canvas.height);
        this.stage.resize(this.canvas.width, this.canvas.height);
    }

    update() {
    }
    draw() {
		this.graphics.fillStyle = "#fff";
        this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stage.draw();
        this.renderer.drawImage(this.stage.canvas, 0, 0, this.stage.canvas.width, this.stage.canvas.height);
	}
}

const main = new Main(64);
setInterval(main.update, 1000.0 / main.tickrate);

function drawloop() { main.draw(); requestAnimationFrame(drawloop) }
requestAnimationFrame(drawloop);
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

        this.noteimg = new OffscreenCanvas(128, 128);
        {
            let g = this.noteimg.getContext("2d");

            g.fillStyle = "#f00";
            g.fillRect(0, 0, 64, 64);
        }

        this.graphics = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.graphics, this.canvas.width, this.canvas.height);

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
    }

    update() {
        this.rotation += 0.01;
    }
    draw() {
		this.graphics.fillStyle = "#ffffff";
        this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderer.pushTransform(64, 64, this.rotation);
        this.renderer.drawImage(this.noteimg, 0, 0, 128, 128);
        this.renderer.popTransform();
	}
}

const main = new Main(64);
setInterval(main.update, 1000.0 / main.tickrate);

function drawloop() { main.draw(); requestAnimationFrame(drawloop) }
requestAnimationFrame(drawloop);
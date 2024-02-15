class Main {
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

        this.graphics = this.canvas.getContext('2d');
    }

    update() {
    }
    draw() {
    }
}

const main = new Main();
setInterval(main.update, main.tickrate);

function drawloop() { main.draw(); requestAnimationFrame(drawloop) }
requestAnimationFrame(drawloop);
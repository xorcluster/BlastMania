class Stage {
    scrollspeed = 0;
    notesize = 0.75;

    /**
     * @param { Noteskin } noteskin 
     */
    constructor(noteskin) {
        this.noteskin = noteskin; 

        this.canvas = new OffscreenCanvas(640, 480);
        this.renderer = new Renderer(this.canvas.getContext("2d"), 640, 480);
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.resize(width, height);
    }

    draw() {
        this.renderer.clear(null);

        for (let i = 0; i < 5; i++) {
            const dimensions = this.noteskin.getNoteDimensions(i);
            const width = Math.floor(dimensions[0] * this.notesize);
            const height = Math.floor(dimensions[1] * this.notesize);

            const multiply = i - 2;

            let x = width * multiply;
            let y = 0;

            this.renderer.pushTransform(x + this.canvas.width / 2, y + this.canvas.height / 2, this.noteskin.getLaneAngle(i));
            this.renderer.drawImage(this.noteskin.getLaneTexture(i, 0), -width / 2, -height / 2, width, height);
            this.renderer.popTransform();
        }
    }
}

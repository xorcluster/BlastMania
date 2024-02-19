class Stage {
    scrollspeed = 0;
    notesize = 0.75;

    chart = new Chart();

    /**
     * @param { Main } main 
     * @param { Noteskin } noteskin 
     */
    constructor(main, noteskin) {
        this.main = main;
        this.noteskin = noteskin; 

        this.canvas = new OffscreenCanvas(640, 480);
        this.renderer = new Renderer(this.canvas.getContext("2d"), 640, 480);

        this.chart.setBPM(128);
        for (let i = 0; i < 64; i++) {
            this.chart.addNoteBeat(Math.round(Math.random() * 4), i / 2.0, 0.0);
        }
        this.chart.sort();

        this.start = performance.now() + 2000;
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.resize(width, height);
    }

    update() {

    }
    draw() {
        this.renderer.clear(null);

        for (let i = 0; i < 5; i++) {
            const dimensions = this.noteskin.getNoteDimensions(i, 2);
            const width = Math.floor(dimensions[0] * this.notesize);
            const height = Math.floor(dimensions[1] * this.notesize);

            const multiply = i - 2;

            let x = width * multiply;
            let y = 0;

            const glow = this.main.controller.glow[i] - performance.now();

            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, this.noteskin.getLaneAngle(i));
            this.renderer.drawImage(this.noteskin.getLaneTexture(i, 2), -width / 2, -height / 2, width, height);
            if (glow > 0) {
                this.renderer.graphics.globalAlpha = Math.max(glow, 0) / 250.0;
                this.renderer.drawImage(this.noteskin.getLaneTexture(i, 1), -width / 2, -height / 2, width, height);
                this.renderer.graphics.globalAlpha = 1.0;
            }
            this.renderer.popTransform();
        }

        for (let i = 0; i < this.chart.getSize(); i++) {
            const note = this.chart.notes[i];
            const time = (note.time) - (performance.now() - this.start);

            if (time > 1000) {
                break;
            }

            const dimensions = this.noteskin.getNoteDimensions(note.lane, 0);
            const width = Math.floor(dimensions[0] * this.notesize);
            const height = Math.floor(dimensions[1] * this.notesize);

            const multiply = note.lane - 2;

            let x = width * multiply;
            let y = (this.canvas.height) * (time / 1000.0);

            let angle = this.noteskin.getLaneAngle(note.lane);
            
            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, angle);
            this.renderer.drawImage(this.noteskin.getLaneTexture(note.lane, 0), -width / 2, -height / 2, width, height);
            this.renderer.popTransform();

            /*if (note.length > 0) {
                const ldimensions = this.noteskin.getNoteDimensions(note.lane, 4);
                const lwidth = Math.floor(ldimensions[0] * this.notesize);
                const lheight = Math.floor(ldimensions[1] * this.notesize);

                y = (this.canvas.height) * ((time + note.length) / 1000.0);

                this.renderer.pushTransform(x + this.canvas.width / 2, y + height, Math.PI);
                this.renderer.drawImage(this.noteskin.getLaneTexture(note.lane, 4), -lwidth / 2, -lheight / 2, lwidth, lheight);
                this.renderer.popTransform();
            }*/
        }
    }
}

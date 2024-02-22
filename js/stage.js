class Stage {
    scrollspeed = 0;
    notesize = 0.8;

    reversed = true;

    clearAlpha = 1.0;

    /**
     * @param { Main } main 
     * @param { Noteskin } noteskin 
     */
    constructor(main, noteskin) {
        this.main = main;
        this.noteskin = noteskin; 

        this.canvas = new OffscreenCanvas(640, 480);
        this.renderer = new Renderer(this.canvas.getContext("2d"), 640, 480);

    }

    start() {
        this.main.start = performance.now() + 4000;
        this.main.playable = true;
        this.main.controller.chartLoaded();
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.resize(width, height);
    }

    update() {
        const chart = this.main.chart;
        const controller = this.main.controller;
        for (let i = 0; i < 5; i++) {
            if (controller.index[i] < 0)
                continue;

            const time = chart.notes[controller.index[i]].time - (performance.now() - this.main.start);

            if (time <= -100) {
                controller.index[i]++;
                controller.find(i);
            }
        }
    }
    draw() {
        const chart = this.main.chart;

        this.renderer.clear(`rgb(255, 255, 255, ${Math.round(this.clearAlpha * 100)}%)`);

        for (let i = 0; i < 5; i++) {
            const dimensions = this.noteskin.getNoteDimensions(i, 2);
            const width = Math.floor(dimensions[0] * this.notesize);
            const height = Math.floor(dimensions[1] * this.notesize);

            const multiply = i - 2;

            let x = width * multiply;
            let y = 0;

            if (this.reversed) {
                y = this.canvas.height - height * 2;
            }

            const glow = this.main.controller.glow[i] - performance.now();

            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, this.noteskin.getLaneAngle(i));
            this.renderer.drawImageScaled(this.noteskin.getLaneTexture(i, 2), -width / 2, -height / 2, width, height);
            if (glow > 0) {
                this.renderer.graphics.globalAlpha = Math.max(glow, 0) / 250.0;
                this.renderer.drawImageScaled(this.noteskin.getLaneTexture(i, 1), -width / 2, -height / 2, width, height);
                this.renderer.graphics.globalAlpha = 1.0;
            }
            this.renderer.popTransform();
        }

        for (let i = 0; i < chart.getSize(); i++) {
            const note = chart.notes[i];
            const time = (note.time) - (performance.now() - this.main.start);
            const lanei = this.main.controller.index[note.lane];

            if (lanei > i || lanei < 0) {
                continue;
            }
            if (time > 1000) {
                break;
            }

            const dimensions = this.noteskin.getNoteDimensions(note.lane, 0);
            const width = Math.floor(dimensions[0] * this.notesize);
            const height = Math.floor(dimensions[1] * this.notesize);

            const multiply = note.lane - 2;

            let x = width * multiply;
            let y = (this.canvas.height) * (time / 1000.0);
            if (this.reversed) {
                y = (this.canvas.height - height * 2) - y;
            }

            let angle = this.noteskin.getLaneAngle(note.lane);
            
            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, angle);
            this.renderer.drawImageScaled(this.noteskin.getLaneTexture(note.lane, 0), -width / 2, -height / 2, width, height);
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

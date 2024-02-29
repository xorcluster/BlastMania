class Grade {
    /**
     * @param { Array<HTMLImageElement> } images 
     * @param { Array<number> } accuracy 
     */
    constructor(images, accuracy) {
        this.images = images;
        this.accuracy = accuracy;
    }

    /**
     * @param { number } accuracy 
     */
    findGradeIndex(accuracy) {
        for (let i = 0; i < this.accuracy.length; i++) {
            if (accuracy >= this.accuracy[i])
                return i;
        }
        return -1;
    }
}
class Stage {
    scrollspeed = 1.75;
    notesize = 0.75;

    reversed = true;

    clearAlpha = 1.0;

    /**
     * @param { Main } main 
     * @param { Skin } noteskin 
     */
    constructor(main, noteskin) {
        this.main = main;
        this.noteskin = noteskin; 

        this.canvas = new OffscreenCanvas(640, 480);
        this.renderer = new Renderer(this.canvas.getContext("2d"), 640, 480);
    }

    start() {
        this.main.start = performance.now() + 2000;
        this.main.playable = true;
        this.main.controller.chartLoaded();

        this.main.noteskin.storeInstances(this.notesize);
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

            const note = chart.notes[controller.index[i]];
            const time = (note.time + note.length) - (performance.now() - this.main.start);

            if (controller.holding[i]) {
                if (time <= 0) {
                    controller.index[i]++;
                    controller.find(i);
                    controller.glow[i] = performance.now() + 250.0;

                    controller.holding[i] = false;

                    controller.judgement = 0;
                    controller.judgecount[0]++;
                    controller.judges++;

                    this.main.combo++;

                    break;
                }
            }

            if (time <= -Input.judgements.getMiss()) {
                controller.index[i]++;
                controller.find(i);
                
                controller.judgement = Input.judgements.jtimes.length - 1;
                controller.judgecount[controller.judgecount.length - 1]++;
                controller.judges++;

                this.main.combo = 0;
            }
        }

        let time = (performance.now() - this.main.start) - (this.main.chart.getEndTime() + 1000);
        if (time >= 0 && this.main.playable) {
            this.main.playable = false;

            const player = this.main.playerList[this.main.playerIndex];

            let accuracy = 0;
            for (let i = 0; i < Input.judgements.jtimes.length - 1; i++) {
                accuracy += this.main.controller.judgecount[i] * ((5 - i) / 5);
            }
            accuracy /= this.main.chart.getNotes();

            this.main.maxexp = EXPEngine.calculate(chart);
            this.main.currentexp = EXPEngine.calculate(chart) * (Math.pow(2, accuracy) / 2);

            player.pushPlay(chart, accuracy);
            player.update();

            this.main.updatePlayers();
        }
    }
    draw() {
        const chart = this.main.chart;

        this.renderer.clear(`rgb(255, 255, 255, ${Math.round(this.clearAlpha * 100)}%)`);

        for (let i = 0; i < 5; i++) {
            const dimensions = this.noteskin.getNoteInstanceDimensions(i, 2);
            const width = dimensions[0];
            const height = dimensions[1];

            const multiply = i - 2;

            let x = width * multiply;
            let y = 0;

            if (this.reversed) {
                y = this.canvas.height - height * 2;
            }

            const glow = this.main.controller.glow[i] - performance.now();

            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, this.noteskin.getLaneAngle(i));
            this.renderer.drawImage(this.noteskin.getLaneInstanceTexture(i, 2), -width / 2, -height / 2);
            if (glow > 0) {
                this.renderer.graphics.globalAlpha = Math.max(glow, 0) / 250.0;
                this.renderer.drawImage(this.noteskin.getLaneInstanceTexture(i, 1), -width / 2, -height / 2);
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

            const dimensions = this.noteskin.getNoteInstanceDimensions(note.lane, 0);
            const width = dimensions[0];
            const height = dimensions[1];

            const multiply = note.lane - 2;

            let x = width * multiply;
            let y = (this.canvas.height) * (time / 1000.0) * this.scrollspeed;
            if (this.main.controller.holding[note.lane] && lanei == i) {
                y = Math.max(y, 0);
            }

            if (this.reversed) {
                y = (this.canvas.height - height * 2) - y;
            }

            let angle = this.noteskin.getLaneAngle(note.lane);
            
            if (note.length > 0) {
                const lbdimensions = this.noteskin.getNoteInstanceDimensions(note.lane, 3);
                const lbwidth = lbdimensions[0];
                const lbheight = lbdimensions[1];

                const ledimensions = this.noteskin.getNoteInstanceDimensions(note.lane, 4);
                const lewidth = ledimensions[0];
                const leheight = ledimensions[1];

                let oldY = y;
                y = (this.canvas.height) * ((time + note.length) / 1000.0) * this.scrollspeed;
                if (this.reversed) {
                    y = (this.canvas.height - height * 2) - y;
                }

                this.renderer.pushTransform(x + this.canvas.width / 2, oldY + height + (this.reversed? lbheight / 2 : 0), 0);
                this.renderer.drawImageScaled(this.noteskin.getLaneInstanceTexture(note.lane, 3), -lewidth / 2, -leheight / 2, lbwidth, Math.floor(y - oldY) + lbheight / 2);
                this.renderer.popTransform();

                this.renderer.pushTransform(x + this.canvas.width / 2, y + height, this.reversed? 0 : Math.PI);
                this.renderer.drawImage(this.noteskin.getLaneInstanceTexture(note.lane, 4), -lewidth / 2, -leheight / 2);
                this.renderer.popTransform();

                this.renderer.pushTransform(x + this.canvas.width / 2, oldY + height - (this.reversed? 0 : lbheight / 2), this.reversed? Math.PI : 0);
                this.renderer.drawImage(this.noteskin.getLaneInstanceTexture(note.lane, 4), -lewidth / 2, -leheight / 2);
                this.renderer.popTransform();

                y = oldY;
            }

            this.renderer.pushTransform(x + this.canvas.width / 2, y + height, angle);
            this.renderer.drawImage(this.noteskin.getLaneInstanceTexture(note.lane, 0), -width / 2, -height / 2);
            this.renderer.popTransform();
        }
    }
}

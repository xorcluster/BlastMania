class GameMenu extends Menu {
    /**
     * @param { Main } main 
     */
    constructor(main) {
        super(main);

        this.stage = new Stage(main, main.noteskin);
    }

    start() {
        this.stage.start();
    }

    resize(width, height) {
        super.resize(width, height);
        this.stage.resize(width, height);
    }

    update() {
        this.stage.update();
    }

    draw() {
        this.renderer.clear(null);

        this.stage.draw();
        this.renderer.drawImage(this.stage.canvas, 0, 0);

        this.drawJudgement();
        this.drawAccuracy();

        if (Main.isPlayer(this.main)) {
            const display = this.main.playerList[this.main.playerIndex].display;

            if (this.main.playerList[this.main.playerIndex].done) {
                this.renderer.drawImage(display, 0, 0);
            }
        }

        let time = (performance.now() - this.main.start) - (this.main.chart.getEndTime() + 1000);
        if (time >= 0) {
            this.renderer.clear(`rgba(100%, 100%, 100%, ${100 * Math.min(time / 500.0, 1.0)}%)`);
            this.renderer.clear(`rgba(0%, 0%, 0%, ${100 * Math.min(time / 500.0, 1.0) / 2}%)`);

            this.renderer.setFont("Arial", 64);
            this.renderer.text("Results", (this.canvas.width - this.renderer.textWidth("Results")) / 2, 20, "#0008");
            this.renderer.text("Results", (this.canvas.width - this.renderer.textWidth("Results")) / 2, 16, "#fff", true);
            
            {
                let accuracy = 0;
                for (let i = 0; i < Input.judgements.jtimes.length - 1; i++) {
                    accuracy += this.main.controller.judgecount[i] * ((5 - i) / 5);
                }
                accuracy /= this.main.chart.getNotes();
                accuracy *= 100;
                
                this.renderer.setFont("Arial", 64);
                let acctext = accuracy.toFixed(2).concat("%");
        
                let index = this.main.gradeskin.findGradeIndex(accuracy);
                let image = this.main.gradeskin.images[index];
                if (image != null) {
                    this.renderer.drawImage(image, this.canvas.width - image.width - 16, image.height - this.renderer.textHeight(acctext) + 16);
                }
                
                this.renderer.text(acctext, this.canvas.width - this.renderer.textWidth(acctext) - 16, 20, "#0008");
                this.renderer.text(acctext, this.canvas.width - this.renderer.textWidth(acctext) - 16, 16, "#fff", true);
            }

            this.renderer.setFont("Arial", 32);
            let y = 16;
            for (let i = 0; i < this.main.controller.judgecount.length; i++) {
                let jcolor = Input.judgements.getColor(i);
                let text = Input.judgements.getName(i).concat(": ", this.main.controller.judgecount[i]);

                this.renderer.text(text, 16, y + 2, "#0008");
                this.renderer.text(text, 16, y, jcolor, true);
                y += this.renderer.textHeight(text);
            }

            let exptext = "EXP Gain: ".concat(this.main.currentexp.toFixed(2));
            this.renderer.text(exptext, 16, this.canvas.height - this.renderer.textHeight(exptext) - 14, "#0008");
            this.renderer.text(exptext, 16, this.canvas.height - this.renderer.textHeight(exptext) - 16, "#fff", true);
            y = this.renderer.textHeight(exptext);

            let mexptext = "EXP Max: ".concat(this.main.maxexp.toFixed(2));
            this.renderer.text(mexptext, 16, this.canvas.height - this.renderer.textHeight(mexptext) - y - 14, "#0008");
            this.renderer.text(mexptext, 16, this.canvas.height - this.renderer.textHeight(mexptext) - y - 16, "#fff", true);

            if (Main.isPlayer(this.main)) {
                const display = this.main.playerList[this.main.playerIndex].display;
    
                if (this.main.playerList[this.main.playerIndex].done) {
                    this.renderer.drawImage(display, this.canvas.width - display.width, this.canvas.height - display.height);
                }
            }
        }
    }

    drawJudgement() {
        this.renderer.setFont("Arial", 32);
        const text = Input.judgements.getName(this.main.controller.judgement);
        const color = Input.judgements.getColor(this.main.controller.judgement);

        const ctext = "Combo: ".concat(this.main.combo.toFixed(0));

        if (this.main.combo >= 10) {
            this.renderer.text(ctext, (this.canvas.width - this.renderer.textWidth(ctext)) / 2, 2 + this.canvas.height / 2 - this.renderer.textHeight(ctext), "#0008");
            this.renderer.text(ctext, (this.canvas.width - this.renderer.textWidth(ctext)) / 2, this.canvas.height / 2 - this.renderer.textHeight(ctext), "#fff", true);
        }

        this.renderer.text(text, (this.canvas.width - this.renderer.textWidth(text)) / 2, 2 + this.canvas.height / 2, "#0008");
        this.renderer.text(text, (this.canvas.width - this.renderer.textWidth(text)) / 2, this.canvas.height / 2, color, true);
    }
    drawAccuracy() {
        let accuracy = 0;
        for (let i = 0; i < Input.judgements.jtimes.length - 1; i++) {
            accuracy += this.main.controller.judgecount[i] * ((5 - i) / 5);
        }
        accuracy /= this.main.chart.getNotes();
        accuracy *= 100;
        
        this.renderer.setFont("Arial", 64);
        let acctext = accuracy.toFixed(2).concat("%");

        let index = this.main.gradeskin.findGradeIndex(accuracy);
        let image = this.main.gradeskin.images[index];
        this.renderer.rect(this.canvas.width - this.renderer.textWidth(acctext.concat(" ")), 0, this.renderer.textWidth(acctext.concat(" ")), image.height + this.renderer.textHeight(acctext), "#0008")
        if (image != null) {
            this.renderer.drawImage(image, this.canvas.width - image.width, image.height - this.renderer.textHeight(acctext));
        }
        
        this.renderer.text(acctext, this.canvas.width - this.renderer.textWidth(acctext), 4, "#0008");
        this.renderer.text(acctext, this.canvas.width - this.renderer.textWidth(acctext), 0, "#fff");
    }

    /**
     * @param { string } key 
     * @param { string } code 
     */
    keypress(key, code) {
        if (code === "Escape") {
            this.main.playable = false;
            this.main.menus[0].hidden = false;
            this.hidden = true;
        }
        if (code === "Backquote") {
            this.main.menus[1].start();
        }
    }
}
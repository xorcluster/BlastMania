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

        let time = (performance.now() - this.main.start) - this.main.chart.getEndTime();
        if (time >= 0) {
            this.renderer.clear(`rgb(100%, 100%, 100%, ${Math.min(time / 1000.0, 1.0)})`);
            this.renderer.clear(`rgb(0%, 0%, 0%, ${Math.min(time / 1000.0, 1.0) / 4})`);

            this.renderer.setFont("Arial", 64);
            this.renderer.text("Results", (this.canvas.width - this.renderer.textWidth("Results")) / 2, 16, "#fff");
            
            let accuracy = 0;
            for (let i = 0; i < Input.judgements.jtimes.length - 1; i++) {
                accuracy += this.main.controller.judgecount[i] * ((5 - i) / 5);
            }
            accuracy /= this.main.chart.getSize();
            accuracy *= 100;
            
            this.renderer.setFont("Arial", 64);
            let acctext = accuracy.toFixed(2).concat("%");
    
            let index = this.main.gradeskin.findGradeIndex(accuracy);
            let image = this.main.gradeskin.images[index];
            this.renderer.rect((this.canvas.width - this.renderer.textWidth(acctext.concat(" "))) / 2, 72, this.renderer.textWidth(acctext.concat(" ")), image.height + this.renderer.textHeight(acctext), "#0008");
            if (image != null) {
                this.renderer.drawImage(image, (this.canvas.width - image.width) / 2, 72 + image.height - this.renderer.textHeight(acctext));
            }
            
            this.renderer.text(acctext, (this.canvas.width - this.renderer.textWidth(acctext)) / 2, 72, "#fff");
        }
    }

    drawJudgement() {
        this.renderer.setFont("Arial", 32);
        const text = Input.judgements.getName(this.main.controller.judgement);
        const color = Input.judgements.getColor(this.main.controller.judgement);

        this.renderer.text(text, (this.canvas.width - this.renderer.textWidth(text)) / 2, 4 + this.canvas.height / 2, "#0009");
        this.renderer.text(text, (this.canvas.width - this.renderer.textWidth(text)) / 2, this.canvas.height / 2, color);
    
    }
    drawAccuracy() {
        let accuracy = 0;
        for (let i = 0; i < Input.judgements.jtimes.length - 1; i++) {
            accuracy += this.main.controller.judgecount[i] * ((5 - i) / 5);
        }
        accuracy /= this.main.chart.getSize();
        accuracy *= 100;
        
        this.renderer.setFont("Arial", 64);
        let acctext = accuracy.toFixed(2).concat("%");

        let index = this.main.gradeskin.findGradeIndex(accuracy);
        let image = this.main.gradeskin.images[index];
        this.renderer.rect(this.canvas.width - this.renderer.textWidth(acctext.concat(" ")), 0, this.renderer.textWidth(acctext.concat(" ")), image.height + this.renderer.textHeight(acctext), "#0008")
        if (image != null) {
            this.renderer.drawImage(image, this.canvas.width - image.width, image.height - this.renderer.textHeight(acctext));
        }
        
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
    }
}
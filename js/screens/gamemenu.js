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

        this.renderer.setFont("Arial", 32);
        const text = Input.judgements.getName(this.main.controller.judgement);
        const color = Input.judgements.getColor(this.main.controller.judgement);

        this.renderer.text(text, (this.canvas.width - this.renderer.textWidth(text)) / 2, this.canvas.height / 2, color);

        if (this.main.playerList.length > 0) {
            const display = this.main.playerList[this.main.playerIndex].display;

            if (this.main.playerList[this.main.playerIndex].done) {
                this.renderer.drawImage(display, 0, 0);
            }
        }
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
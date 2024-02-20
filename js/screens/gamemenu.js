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
        this.renderer.drawImage(this.stage.canvas, 0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param { string } key 
     * @param { string } code 
     */
    keypress(key, code) {
        if (code === "Escape") {
            this.main.menus[0].hidden = false;
            this.hidden = true;
        }
    }
}
class MainMenu extends Menu {
    /**
     * @param { Main } main 
     */
    constructor(main) {
        super(main)
    
        this.selwhl = new ScrollWheelComponent(
            0, 0,
            [
                "Play",
                "Settings",
                "Edit",
            ],
            96
        );
        this.selwhl.addEventListener("change", (e) => {
            const sel = e.currentTarget.selection
            if (sel === "Play") {
                this.hidden = true;
                this.main.menus[1].hidden = false;
                if (this.main.menus[1] instanceof GameMenu) {
                    this.main.menus[1].start();
                }
            }
            if (sel === "Settings") {
                this.hidden = true;
                this.main.menus[2].hidden = false;
            }
        })
    }

    resize(width, height) {
        super.resize(width, height);

        this.selwhl.setY(height / 2);
        this.selwhl.centerize(this.renderer);
    }

    update() {
        this.selwhl.update();
    }

    draw() {
        this.renderer.clear(null);
        this.selwhl.draw(this, this.renderer);
    }

    /**
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(x, y) {
        this.selwhl.mousepress(this, x, y);
    }
    /**
     * @param { string } key
     * @param { string } code
     */
    keypress(key, code) {
        this.selwhl.keypress(this, key, code);
        
    }
}
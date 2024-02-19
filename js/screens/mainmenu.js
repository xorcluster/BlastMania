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
            console.log(sel);

            if (sel === "Play") {
                this.hidden = true;
                this.main.menus[1].hidden = false;
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
        this.selwhl.mousepress(x, y);
    }
    /**
     * @param { string } key
     */
    keypress(key) {
        this.selwhl.keypress(key);
    }
}
class Player {
    /**
     * @param { string } name 
     * @param { HTMLImageElement } icon 
     * @param { number } exp 
     */
    constructor(name, icon, exp=0.0) {
        this.name = name;
        this.iconsrc = "none";
        this.icon = new OffscreenCanvas(256, 256);
        this.display = new OffscreenCanvas(0, 0);
        this.displayrenderer = new Renderer(this.display.getContext("2d"), 0, 0);
        this.done = false;
        this.exp = exp;

        this.icongraphics = this.icon.getContext("2d");
        this.icongraphics.imageSmoothingEnabled = false;

        if (icon != null)
            this.setIcon(icon);
    }

    /**
     * @param { HTMLImageElement } icon 
     */
    setIcon(icon) {
        this.iconsrc = icon.src;
        this.icongraphics.clearRect(0, 0, 256, 256);
        this.icongraphics.drawImage(icon, 0, 0, 256, 256);
        this.update();
    }
    /**
     * @param { string } icon 
     */
    setIconSRC(iconsrc) {
        let image = new Image();
        image.src = iconsrc;

        this.done = false;
        this.iconsrc = iconsrc;
        image.onload = () => {
            this.setIcon(image);
        }
    }

    update() {
        this.displayrenderer.setFont("Arial", 32);
            
        const width = this.displayrenderer.textWidth(this.name);
        const height = this.displayrenderer.textHeight(this.name);
        
        this.display.width = 136 + width;
        this.display.height = 128;
        this.displayrenderer.resize(136 + width, 128);

        this.displayrenderer.setFont("Arial", 32);

        this.displayrenderer.clear("#000c");
        this.displayrenderer.text(this.name, 4, height + 16, "#fff");
        this.displayrenderer.drawImageScaled(this.icon, width + 8, 0, 128, 128);

        console.log('done');

        this.done = true;
    }

    /**
     * @param { string } name 
     * @param { string } iconsrc 
     * @param { number } exp 
     */
    static loadPlayer(name, iconsrc, exp) {
        let player = new Player(name, null, exp);
        player.setIconSRC(iconsrc);

        return player;
    }
}
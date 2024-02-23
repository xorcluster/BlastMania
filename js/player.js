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
    }
    /**
     * @param { string } icon 
     */
    setIconSRC(iconsrc) {
        let image = new Image();
        image.src = iconsrc;

        this.iconsrc = iconsrc;
        image.onload = () => {
            this.icongraphics.clearRect(0, 0, 256, 256);
            this.icongraphics.drawImage(image, 0, 0, 256, 256);
        }
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
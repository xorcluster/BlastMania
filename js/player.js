class Player {
    /**
     * @param { string } name 
     * @param { HTMLImageElement } icon 
     * @param { number } exp 
     */
    constructor(name, icon, exp=0.0) {
        this.name = name;
        this.icon = new OffscreenCanvas(256, 256);
        this.exp = exp;

        this.icon.getContext("2d").drawImage(icon, 0, 0, 256, 256);
    }
}
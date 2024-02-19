class Player {
    /**
     * @param { string } name 
     * @param { HTMLImageElement } icon 
     * @param { number } exp 
     */
    constructor(name, icon, exp=0.0) {
        this.name = name;
        this.icon = icon;
        this.exp = exp;
    }
}
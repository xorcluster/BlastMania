class Player {
    /**
     * @param { string } name 
     * @param { HTMLImageElement } icon 
     */
    constructor(name, icon) {
        this.name = name;
        this.iconsrc = "none";
        this.icon = new OffscreenCanvas(256, 256);
        this.display = new OffscreenCanvas(0, 0);
        this.displayrenderer = new Renderer(this.display.getContext("2d"), 0, 0);
        this.done = false;

        /** @type { Array<Exp> } */
        this.plays = new Array();

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

        let expnumber = 0;
        this.plays.forEach(e => expnumber += e.getExp());

        let exp = "EXP: ".concat(expnumber.toFixed(2));

        const width = Math.max(this.displayrenderer.textWidth(this.name), this.displayrenderer.textWidth(exp));
        const height = this.displayrenderer.textHeight(this.name);
        
        this.display.width = 136 + width;
        this.display.height = 128;
        this.displayrenderer.resize(136 + width, 128);

        this.displayrenderer.setFont("Arial", 32);

        this.displayrenderer.clear("#000c");
        this.displayrenderer.text(this.name, 4 + (width - this.displayrenderer.textWidth(this.name)) / 2, height / 2 + 16, "#fff", false);
        this.displayrenderer.text(exp, 4 + (width - this.displayrenderer.textWidth(exp)) / 2, height * 1.5 + 16, "#fff", false);
        this.displayrenderer.drawImageScaled(this.icon, width + 8, 0, 128, 128);

        console.log('done');

        this.done = true;
    }

    /**
     * @param { Chart } chart 
     */
    pushPlay(chart, acc) {
        this.plays.push(new Exp(chart.hash, EXPEngine.calculate(chart) * (Math.pow(2, acc) / 2)));
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
class Exp {
    /**
     * @param { string } uuid 
     * @param { number } exp 
     */
    constructor(uuid, exp) {
        this.uuid = uuid;
        this.exp = exp;
    }

    getUUID() {
        return this.uuid;
    }
    getExp() {
        return this.exp;
    }
}
class EXPEngine {
    static version = 0;

    /**
     * @param { Chart } chart 
     */
    static calculate(chart) {
        let avgspeed = 0;
        let avgdensity = 0;

        let last = 0;
        chart.notes.forEach(e => {
            if (e.time - last > 0) {
                avgspeed += e.time - last;
            }
            last = e.time;
        });
        avgspeed /= chart.getSize();

        last = 0;
        let i = 0;
        while (i < chart.getSize()) {
            let density = 1.0;
            let currentNote = chart.notes[i];
            
            let j = 0;
            while (true) {
                if (i + j + 1 >= chart.getSize())
                    break;

                let n = chart.notes[i + j + 1];
                if (n.time != currentNote.time) {
                    density += j / 4;
                    i += j;
                    break;
                }
                j++;
            }
            avgdensity += density;
            i++;
        }
        avgdensity /= chart.getSize();

        let speed = (1.0 / avgspeed * 1000);
        let dense = avgdensity;
        return (speed * dense) + Math.sqrt(chart.getEndTime() / 60000 * speed);
    }
}
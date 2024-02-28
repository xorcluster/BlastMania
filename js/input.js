class Keys {
    /**
     * @param { ...string } keys 
     */
    constructor (...keys) {
        const lskeys = localStorage.getItem("blastmania-keys");
        if (lskeys != null) {
            this.keys = JSON.parse(lskeys);
        } else {
            this.keys = keys;
            localStorage.setItem("blastmania-keys", JSON.stringify(this.keys));
        }
    }

    /**
     * @param { number } index 
     * @param { string } key 
     */
    setKey(index, key) {
        this.keys[index] = key;
        localStorage.setItem("blastmania-keys", JSON.stringify(this.keys));
    }

    /**
     * @param { number } i 
     * @returns { string }
     */
    getKey(i) {
        return this.keys[i]
    }
    /**
     * @returns { number }
     */
    getSize() {
        return this.keys.length;
    }
}
class Judgement {
    /**
     * @param { Array<string> } jnames 
     * @param { Array<string> } jcolor 
     * @param { Array<number> } jtimes 
     */
    constructor(jnames, jcolor, jtimes) {
        this.jnames = jnames;
        this.jcolor = jcolor;
        this.jtimes = jtimes;
    }

    /**
     * @param { number } ms 
     */
    findJudgement(ms) {
        for (let i = 0; i < this.jtimes.length; i++) {
            if (Math.abs(ms) <= this.jtimes[i])
                return i;
        }
    }

    /**
     * @param { number } index 
     * @returns { string }
     */
    getName(index) {
        return this.jnames[index];
    }
    /**
     * @param { number } index 
     * @returns { string }
     */
    getColor(index) {
        return this.jcolor[index];
    }

    getMiss() {
        return this.jtimes[this.jtimes.length - 1];
    }
}
class Input {
    static keys = new Keys("KeyE", "KeyF", "Space", "KeyJ", "KeyI");
    static judgements = new Judgement(
        [
            "Perfect",
            "Awesome",
            "Great",
            "Good",
            "Mediocre",
            "Miss",
        ],
        [
            "#8ff",
            "#ff4",
            "#4f6",
            "#18e",
            "#f48",
            "#f22",
        ],
        [
            28,
            59,
            126,
            178,
            239,
            275,
        ]
    );

    /**
     * @param { Main } main 
     */
    constructor(main) {
        this.main = main;
    }

    /**
     * @param { string } key
     * @param { string } code
     * @param { boolean } trigger
     * @param { boolean } repeating
     */
    keypress(key, code, trigger, repeating) {
        if (this.main.playable) {
            for (let i = 0; i < Input.keys.getSize(); i++) {
                if (code === Input.keys.getKey(i)) {
                    this.main.controller.pressed(i, trigger);
                    return;
                }
            }
            if (code === "Backquote") {
                this.main.menus[1].start();
            }
        }
        if (code === "F8" && !this.main.playable) {
            Main.loadFile((e) => {
                this.main.chart = Chart.loadChart(atob(e.substring(e.indexOf(",") + 1, e.length)));
            })
        }
        if (trigger) {
            this.main.menus.forEach((e) => { if (e.hidden) return; e.keypress(key, code); });
        }
    }
}
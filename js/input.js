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
class Input {
    static keys = new Keys("KeyE", "KeyF", "Space", "KeyJ", "KeyI");

    /**
     * @param { Main } main 
     */
    constructor(main) {
        this.main = main;
    }

    /**
     * @param { string } key
     * @param { boolean } trigger
     * @param { boolean } repeating
     */
    keypress(key, code, trigger, repeating) {
        if (!repeating && this.main.playable) {
            for (let i = 0; i < Input.keys.getSize(); i++) {
                if (code === Input.keys.getKey(i)) {
                    this.main.controller.pressed(i, trigger);
                    return;
                }
            }
        }
        if (trigger) {
            this.main.menus.forEach((e) => { if (e.hidden) return; e.keypress(key, code); });
        }
    }
}
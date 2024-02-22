class Component extends EventTarget {
    highlight = false;
    selected = false;
    hidden = false;

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { string } name 
     */
    constructor(x, y, name) {
        super()

        this.x = x;
        this.y = y;

        console.log(name.concat(" has been constructed."));
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {}

    /**
     * @param { Menu } menu 
     */
    update(menu) {}
    /**
     * @param { Menu } menu 
     * @param { Renderer } r
     */
    draw(menu, r) {}

    /**
     * @param { Menu } menu 
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(menu, x, y) {}
    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {}

    /**
     * @param { number } x 
     */
    setX(x) {
        this.x = x;
    }
    /**
     * @param { number } y 
     */
    setY(y) {
        this.y = y;
    }
}

class ButtonComponent extends Component {
    triggered = false;

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } px 
     * @param { string } name 
     */
    constructor(x, y, px, name) {
        super(x, y, "Button");
        this.px = px;
        this.name = name;
    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.setFont("Arial", this.px);

        const width1 = r.textWidth(this.name);
        const width2 = r.textWidth(this.name + " ");

        const height = r.textHeight(this.name) + this.px / 4;

        r.pushTransform(this.x, this.y, 0);
        if (this.highlight) {
            r.rect(0, 0, width1, height, "#fff");
            r.rect(1, 1, width1 - 2, height - 2, "#222");
        } else {
            r.rect(0, 0, width1, height, "#222");
        }

        r.text(this.name, 0, this.px / 4, "#fff");
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (this.selected) {
            if (key === "Enter") {
                this.triggered = !this.triggered;
                this.selected = false;

                let event = document.createEvent("CustomEvent");
                this.dispatchEvent(new Event("pressed", event));
            }
        }
    }
}
class ImageComponent extends Component {
    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     * @param { HTMLImageElement } image 
     */
    constructor(x, y, width, height, image) {
        super(x, y, "Image");
        this.width = width
        this.height = height;

        this.image = image;
    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.pushTransform(this.x, this.y, 0);
        if (this.highlight) {
            r.rect(0, 0, this.width, this.height, "#fff");
        }
        r.rect(1, 1, this.width - 2, this.height - 2, "#222");
        r.drawImageScaled(this.image, 1, 1, this.width - 2, this.height - 2);
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (this.selected) {
            if (key === "Enter") {
                Main.loadFile((path) => {
                    this.image.width = this.width;
                    this.image.height = this.height;
                    this.image.src = path;
                });

                this.selected = false;

                let event = document.createEvent("CustomEvent");
                this.dispatchEvent(new Event("change", event));
            }
        }
    }
}
class TextboxComponent extends Component {
    finish = 0;

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } px 
     * @param { string } name 
     * @param { string } value 
     */
    constructor(x, y, px, name, value) {
        super(x, y, "Textbox");

        this.px = px;
        this.name = name;
        this.value = value;
    }

    /**
     * @param { Menu } menu 
     */
    update(menu) {}
    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.pushTransform(this.x, this.y, 0);
        r.setFont("Arial", this.px);

        const sentence = this.name.concat(": ", this.value);
        const width = r.textWidth(sentence);
        const height = r.textHeight(sentence) + this.px / 4;

        if (this.highlight) {
            r.rect(0, 0, width, height, "#fff");
            r.rect(1, 1, width - 2, height - 2, "#222");
        } else {
            r.rect(0, 0, width, height, "#222");
        }
        r.text(sentence, 0, this.px / 4, "#fff");
        
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (key === "Enter") {
            this.finish++;
            if (this.finish > 1) {
                this.selected = false;
                this.finish = 0;
            }
            return;
        }
        if (key === "Backspace") {
            this.value = this.value.substring(0, this.value.length - 1);
            return;
        }
        if (key.length > 1) return;

        this.value = this.value.concat(key);
    }
}

class WidgetComponent extends Component {
    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     */
    constructor(x, y, width, height) {
        super(x, y, "Widget");

        this.width = width;
        this.height = height;
    }

    /**
     * @param { Menu } menu 
     */
    update(menu) {

    }
    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.graphics.beginPath();
        r.graphics.rect(this.x, this.y, this.width, this.height);
        r.graphics.closePath();
        r.graphics.clip();

        r.pushTransform(this.x, this.y, 0);
        r.clear("#222f");
    }

    /**
     * @param { Menu } menu 
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(menu, x, y) {

    }
    /**
     * @param { Menu } menu 
     * @param { string } key
     * @param { string } code 
     */
    keypress(menu, key, code) {

    }

    centerize() {
        this.x -= this.width / 2;
        this.y -= this.height / 2;
    }
}
class ScrollGroupComponent extends Component {
    selection = undefined;
    index = 0;

    /**
     * 
     * @param { number } x 
     * @param { number } y 
     * @param { Array<Component> } components 
     */
    constructor(x, y, components) {
        super(x, y, "Scroll Group");

        this.components = components;
        this.components[0].highlight = true;
    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.pushTransform(this.x, this.y);
        this.components.forEach(e => { if (e.hidden) return; e.draw(menu, r) });
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (this.components[this.index].selected) {
            this.components[this.index].keypress(menu, key, code);
            return;
        }

        if (key === "Enter") {
            this.components[this.index].selected = true;
            this.components[this.index].keypress(menu, key, code);
        }
        if (key === "ArrowUp") {
            this.components[this.index].highlight = false;
            this.index = Math.max(this.index - 1, 0);
            this.components[this.index].highlight = true;
        }
        if (key === "ArrowDown") {
            this.components[this.index].highlight = false;
            this.index = Math.min(this.index + 1, this.components.length - 1);
            this.components[this.index].highlight = true;
        }
    }
}
class ScrollWheelComponent extends Component {
    selection = undefined;
    index = 0;

    /**
     * @param { number } x
     * @param { number } y
     * @param { Array<string> } options 
     * @param { number } px 
     */
    constructor(x, y, options, px) {
        super(x, y, "Scroll Wheel");

        this.options = options;
        this.px = px;

        this.selection = options[0];
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {}

    /**
     * @param { Menu } menu 
     */
    update(menu) {

    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        r.setFont("Arial", this.px);

        let yoff = 0;
        r.pushTransform(this.x, this.y, 0);
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];

            const width = r.textWidth(option);
            const width1 = r.textWidth(option + " ");

            const y = r.textHeight(option) + this.px / 4;

            if (i == this.index) {
                r.rect(0, yoff, width1, y, "#fff");
                r.rect(2, yoff + 2, width1 - 4, y - 4, "#222");
            } else {
                r.rect(0, yoff, width1, y, "#2227");
            }

            r.text(option, (width1 - width) / 2, yoff + this.px / 4, "#ffff");
            yoff += y;
        }
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(menu, x, y) {

    }
    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (key === "ArrowUp") {
            this.index = Math.max(this.index - 1, 0);
            return;
        }
        if (key === "ArrowDown") {
            this.index = Math.min(this.index + 1, this.options.length - 1);
            return;
        }
        if (key === "Enter") {
            this.selection = this.options[this.index];

            let event = document.createEvent("CustomEvent");
            this.dispatchEvent(new Event("change", event));
        }
    }

    centerize(r) {
        let yoff = 0;
        
        r.setFont("Arial", this.px);
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            const y = r.textHeight(option) + this.px / 4;
            yoff += y;
        }

        this.setY(this.y - yoff / 2);
    }

    /**
     * @param { Renderer } r 
     * @returns 
     */
    getButtonSize(r) {
        return r.textHeight(" ") + this.px / 4;
    }
}

class Menu {
    hidden = true

    /**
     * @param { Main } main 
     */
    constructor(main) {
        this.canvas = new OffscreenCanvas(640, 480);
        this.renderer = new Renderer(this.canvas.getContext("2d"), 640, 480);

        this.main = main;
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.resize(width, height);
    }

    update() {}
    draw() {}

    /**
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(x, y) {}
    /**
     * @param { string } key 
     * @param { string } code 
     */
    keypress(key, code) {}
}
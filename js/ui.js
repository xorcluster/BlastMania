class Component extends EventTarget {
    highlight = false;
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

        if (this.highlight) {
            r.rect(0, 0, width1, height, "#fff");
            r.rect(2, 2, width1 - 4, height - 4, "#222");
        } else {
            r.rect(this.x, this.y, width1, height, "#222");
        }

        r.text(this.name, this.x, this.y + this.px / 4, "#fff");
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (this.highlight) {
            if (key === "Enter") {
                this.triggered = !this.triggered;
            }
        }
    }
}
class ImageComponent extends Component {
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
        r.rect(0, 0, this.width, this.height);
        r.drawImage(this.image, 1, 1, this.width - 2, this.height - 2);
        r.popTransform();
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {
        if (this.highlight) {
            if (key === "Enter") {
                Main.loadFile()
            }
        }
    }
}
class TextboxComponent extends Component {
    constructor(x, y, width, height, name, value) {
        super(x, y, "Textbox");
        this.width = width;
        this.height = height;

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
        
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     * @param { string } code 
     */
    keypress(menu, key, code) {

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
     * @param {*} x 
     * @param {*} y 
     * @param {*} options 
     */
    constructor(x, y, options) {
        super(x, y, "Scroll Group");

        this.options = options;
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

            r.rect(0, yoff, width1, y, i == this.index? "#000c" : "#0008");
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
            let event = document.createEvent("CustomEvent");
            this.selection = this.options[this.index];

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
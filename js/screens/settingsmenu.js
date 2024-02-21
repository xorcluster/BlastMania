class SettingsMenu extends Menu {
    showingWidget = false;
    /**
     * @param { Main } main 
     */
    constructor(main) {
        super(main);

        this.optwhl = new ScrollWheelComponent(
            0, 0,
            [
                "Controls",
                "Display",
                "Player",
                "Misc",
            ],
            64
        );
        this.widgets = [
            new ControlsWidgetComponent(0, 0, 640, 480),
            new PlayerWidgetComponent(0, 0, 640, 480),
        ];

        this.widgets.forEach((e) => e.hidden = true);

        this.optwhl.addEventListener("change", (e) => {
            const sel = e.currentTarget.selection;
            if (sel === "Controls") {
                this.widgets[0].hidden = false;
                this.showingWidget = true;
                return;
            }
            if (sel === "Player") {
                this.widgets[1].hidden = false;
                this.showingWidget = true;
                return;
            }
        })
    }

    /**
     * @param { number } width 
     * @param { number } height 
     */
    resize(width, height) {
        super.resize(width, height);

        this.widgets.forEach((e) => {
            e.setX(width / 2); e.setY(height / 2); e.centerize()
        });
    }

    update() {
        this.optwhl.update(this);
        if (this.showingWidget) {
            this.widgets.forEach((e) => { if (e.hidden) return; e.update(); });
        }
    }

    draw() {
        this.renderer.clear(null);

        this.optwhl.draw(this, this.renderer);
        if (this.showingWidget) {
            this.widgets.forEach((e) => {
                if (e.hidden) return;

                this.renderer.save();
                e.draw(this, this.renderer);
                this.renderer.restore();
            });
        }
    }

    /**
     * @param { number } x 
     * @param { number } y 
     */
    mousepress(x, y) {
        if (this.showingWidget) {
            this.widgets.forEach((e) => { if (e.hidden) return; e.mousepress(this, x, y) });
        }
    }

    /**
     * @param { string } key 
     * @param { string } code
     */
    keypress(key, code) {
        if (!this.showingWidget) {
            if (code === "Escape") {
                this.main.menus[0].hidden = false;
                this.hidden = true;
            }
            this.optwhl.keypress(this, key, code);
            return;
        } else {
            this.widgets.forEach((e) => { if (e.hidden) return; e.keypress(this, key, code) });
        }
    }
}

class ControlsWidgetComponent extends WidgetComponent {
    options = [
        "Key 1",
        "Key 2",
        "Key 3",
        "Key 4",
        "Key 5",
    ]
    values = [
        "undefined",
        "undefined",
        "undefined",
        "undefined",
        "undefined",
    ]

    selected = false;
    index = 0;

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);

        for (let i = 0; i < 5; i++) {
            this.values[i] = Input.keys.getKey(i);
        }
    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        super.draw(menu, r);

        r.setFont("Arial", 24);
        r.text("Controls Widget - \"When in doubt, trust the widget.\"", 12, 12, "#fff");

        r.setFont("Arial", 24);

        const ssentence = this.options[this.index].concat(": ", this.values[this.index]);
        const sheight = r.textHeight(ssentence);
        r.rect(8, 60 + sheight * this.index, r.textWidth(ssentence) + 8, sheight + 2, "#fff".concat(this.selected? "f" : "7"));
        r.rect(10, 62 + sheight * this.index, r.textWidth(ssentence) + 4, sheight - 2, "#222");
        
        for (let i = 0; i < this.options.length; i++) {
            const sentence = this.options[i].concat(": ", this.values[i]);
            const y = 64 + r.textHeight(sentence) * i

            r.text(sentence, 12, y, "#fff");
        }
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     */
    keypress(menu, key, code) {
        if (!this.selected) {
            if (key === "Escape") {
                if (menu instanceof SettingsMenu) {
                    menu.showingWidget = false;
                    this.hidden = true;
                }
                return;
            }
            if (key === "ArrowUp") {
                this.index = Math.max(this.index - 1, 0);
                return;
            }
            if (key === "ArrowDown") {
                this.index = Math.min(this.index + 1, this.options.length - 1);
                return;
            }
            if (key === "Enter") {
                this.selected = true;
            }
        } else {
            Input.keys.setKey(this.index, code);
            this.values[this.index] = code;
            this.selected = false;
        }
    }
}
class PlayerWidgetComponent extends WidgetComponent {
    options = [
        [
            "Name",
            "Icon",
        ],
        [
            "Name",
            "Icon",
            "Delete"
        ],
        [

        ]
    ]
    types = [
        [
            "string",
            "image",
        ],
        [
            "string",
            "image",
            "button"
        ],
        [

        ]
    ];
    values = [
        [
            "Unknown",
            "null",
        ],
        [
            "Unknown",
            "null",
            null
        ],
        [

        ]
    ]

    selected = [ false, false ];
    index = [ 0, 0 ];

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);

        this.profilewhl = new ScrollWheelComponent(
            12, 64,
            [
                "Add",
                "Edit",
                "Delete",
            ],
            24
        );
        this.profilewhl.addEventListener("change", (e) => {
            const sel = e.currentTarget.selection;

            if (sel === "Add") {
                this.index[0] = 0;
            }
            if (sel === "Edit") {
                this.index[0] = 1;
            }
            this.selected[0] = true;
        })
    }

    /**
     * @param { Menu } menu 
     * @param { Renderer } r 
     */
    draw(menu, r) {
        super.draw(menu, r);

        r.setFont("Arial", 24);
        r.text("Player Widget - \"When in doubt, trust the widget.\"", 12, 12, "#fff");

        if (!this.selected[0]) {
            this.profilewhl.draw(menu, r);
        } else {
            let y = 0;
        }
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     */
    keypress(menu, key, code) {
        if (!this.selected[0]) {
            this.profilewhl.keypress(menu, key, code);
        } else {
            this.selected[0] = false;
        }
    }
}
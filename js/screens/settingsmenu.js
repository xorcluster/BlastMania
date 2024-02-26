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
            new PlayerWidgetComponent(this, 0, 0, 640, 480),
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

        if (this.main.playerList.length > 0) {
            const display = this.main.playerList[this.main.playerIndex].display;

            if (this.main.playerList[this.main.playerIndex].done) {
                this.renderer.drawImage(display, this.canvas.width - display.width, this.canvas.height - display.height);
            }
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
        "Down-Left Key",
        "Up-Left Key",
        "Pad Key",
        "Up-Right Key",
        "Down-Right Key",
    ]
    values = [
        "undefined",
        "undefined",
        "undefined",
        "undefined",
        "undefined",
    ]

    oselected = false;
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
        if (!this.oselected) {
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
                this.oselected = true;
            }
        } else {
            Input.keys.setKey(this.index, code);
            this.values[this.index] = code;
            this.oselected = false;
        }
    }
}
class PlayerWidgetComponent extends WidgetComponent {
    options = [
        new ScrollGroupComponent(
            12, 64,
            [
                new TextboxComponent(0, 0, 24, "Name", "Unknown"),
                new ImageComponent(0, 36, 258, 258, Main.loadImage("./assets/arrow.png")),
                new ButtonComponent(0, 296, 24, "Create")
            ]
        )
    ]

    oselected = false;
    pselected = false;
    
    oindex = 0;
    pindex = 0;

    /**
     * @param { Menu } menu 
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     */
    constructor(menu, x, y, width, height) {
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
                this.oindex = 0;
                this.oselected = true;
            }
            if (sel === "Delete") {
                if (menu.main.playerList.length > 0) {
                    menu.main.playerList.splice(menu.main.playerIndex, 1);
                    menu.main.updatePlayers();
                }
            }
        });

        this.options[0].components[2].addEventListener("pressed", (e) => {
            console.log("Trying to create a player");

            // WARNING: this piece of code is decently unsafe.
            menu.main.playerList.push(new Player(
                this.options[0].components[0].value,
                this.options[0].components[1].image
            ));
            menu.main.updatePlayers();
            this.oselected = false;
            this.index = 0;

            console.log("Created player.");
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

        if (!this.oselected) {
            this.profilewhl.draw(menu, r);

            r.setFont("Arial", 16);

            const players = menu.main.playerList;
            const plselected = menu.main.playerIndex;

            let y = 0;
            for (let i = 0; i < players.length; i++) {
                let x = r.textWidth(players[i].name) + 36;

                const height = r.textHeight(players[i].name);

                if (this.pselected || plselected == i) {
                    let color = "#0000";
                    if (this.pindex == i) {
                        color = "#fff";
                    } else if (plselected == i) {
                        color = "#fff7";
                    }

                    r.rect(this.width - 12 - x - 1, 64 + y - 2, x + 4, 35, color);
                    r.rect(this.width - 12 - x, 64 + y - 1, x + 2, 33, "#222");
                }
                
                r.text(players[i].name, this.width - 12 - x, 64 + y + (32 - height) / 2, "#fff");
                r.drawImageScaled(players[i].icon, this.width - 42, 64 + y, 32, 32);

                y += 34;
            }
        } else {
            this.options[this.oindex].draw(menu, r);
        }
    }

    /**
     * @param { Menu } menu 
     * @param { string } key 
     */
    keypress(menu, key, code) {
        if (key === "Escape") {
            this.index = 0;
            this.oselected = false;
            
            this.hidden = true;
            if (menu instanceof SettingsMenu) {
                menu.showingWidget = false;
            }
        }
        if (!this.oselected) {
            if (key === "ArrowRight") {
                if (menu.main.playerList.length > 0) {
                    this.profilewhl.index = -1;
                    this.pselected = true;
                }
            }
            if (key === "ArrowLeft") {
                this.profilewhl.index = 0;
                this.pselected = false;
            }

            if (this.pselected) {
                if (key === "ArrowUp") {
                    this.pindex = Math.max(this.pindex - 1, 0);
                }
                if (key === "ArrowDown") {
                    this.pindex = Math.min(this.pindex + 1, menu.main.playerList.length - 1);
                }

                if (key === "Enter") {
                    menu.main.playerIndex = this.pindex;
                    Main.storeInfo("player-index", this.pindex);
                }
            } else {
                this.profilewhl.keypress(menu, key, code);
            }
        } else {
            this.options[this.oindex].keypress(menu, key, code);
        }
    }
}
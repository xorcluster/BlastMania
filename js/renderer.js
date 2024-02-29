class NoteTexture {
    /**
     * @param  { ...HTMLImageElement } textures 
     */
    constructor(...textures) {
        this.textures = textures;
    }
}
class Skin {
    /**
     * @param { Array<number> } angles 
     * @param { Array<NoteTexture> } note_textures 
     */
    constructor(angles, note_textures) {
        this.angles = angles;
        this.note_textures = note_textures;

        /** @type { Array<NoteTexture> } */
        this.instances = new Array(note_textures.length);
    }

    /**
     * @param { number } i 
     * @returns { number }
     */
    getLaneAngle(i) {
        return this.angles[i] * (Math.PI / 180);
    }

    /**
     * @param { number } i
     * @param { number } j
     * @returns { ImageBitmap }
     */
    getLaneTexture(i, j) {
        return this.note_textures[i].textures[j];
    }

    /**
     * @param { number } i
     * @param { number } j
     * @returns { ImageBitmap }
     */
    getLaneInstanceTexture(i, j) {
        return this.instances[i].textures[j];
    }

    /**
     * @param { number } i 
     * @param { number } j 
     * @returns { Array<number> }
     */
    getNoteDimensions(i, j) {
        const tex = this.getLaneTexture(i, j);
        return [ tex.width, tex.height ];
    }
    
    /**
     * @param { number } i 
     * @param { number } j 
     * @returns { Array<number> }
     */
    getNoteInstanceDimensions(i, j) {
        const tex = this.getLaneInstanceTexture(i, j);
        return [ tex.width, tex.height ];
    }

    /**
     * @param { number } scale 
     */
    storeInstances(scale) {
        for (let i = 0; i < this.note_textures.length; i++) {
            let textures = this.note_textures[i].textures;
            let canvases = [];
            
            for (let j = 0; j < textures.length; j++) {
                let canvas = new OffscreenCanvas(Math.floor(textures[j].width * scale), Math.floor(textures[j].height * scale));
                let graphics = canvas.getContext("2d");

                graphics.drawImage(textures[j], 0, 0, Math.floor(textures[j].width * scale), Math.floor(textures[j].height * scale));

                canvases.push(canvas);
                console.log("instanced");
            }

            this.instances[i] = new NoteTexture();
            this.instances[i].textures = canvases;
        }
    }
}
class Transform {
    /**
     * @param { number } tx 
     * @param { number } ty 
     * @param { number } angle 
     */
    constructor(tx, ty, angle) {
        this.tx = tx;
        this.ty = ty;
        this.angle = angle;
    }

    /**
     * @param { number } tx 
     * @param { number } ty 
     * @param { number } angle 
     */
    set(tx, ty, angle) {
        this.tx = tx;
        this.ty = ty;
        this.angle = angle;
    }
}
class Renderer {
    transform = new Transform();

    /**
     * @param { CanvasRenderingContext2D } graphics 
     * @param { number } width 
     * @param { number } height 
     */
    constructor(graphics, width, height) {
        this.graphics = graphics;
        this.width = width;
        this.height = height;
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * @param { string | null } color 
     */
    clear(color=null) {
        if (color != null) {
            this.graphics.fillStyle = color;
        } else {
            this.graphics.clearRect(0, 0, this.width, this.height);
            return;    
        }

        this.graphics.fillRect(0, 0, this.width, this.height);
    }

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } w 
     * @param { number } h 
     * @param { string } color 
     */
    rect(x, y, w, h, color) {
        this.graphics.fillStyle = color;
        this.graphics.fillRect(x, y, w, h);
    }

    /**
     * @param { string } type 
     * @param { number } px 
     */
    setFont(type, px) {
        this.graphics.font = px.toString().concat("px ", type);
    }

    /**
     * @param { string } text 
     * @param { number } x 
     * @param { number } y 
     * @param { string } color 
     * @param { boolean } [stroke=false]  
     */
    text(text, x, y, color, stroke=false) {
        this.graphics.textBaseline = "top";
        this.graphics.fillStyle = color;
        if (stroke) {
            this.graphics.strokeText(text, x, y);
        }
        this.graphics.fillText(text, x, y);
    }

    /**
     * @param { string } text 
     * @returns { number }
     */
    textWidth(text) {
        return this.graphics.measureText(text).width;
    }

    /**
     * @param { string } text 
     * @returns { number }
     */
    textHeight(text) {
        const metric = this.graphics.measureText(text);
        return metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent;
    }

    /**
     * @param { number } tx 
     * @param { number } ty 
     * @param { number } angle 
     */
    pushTransform(tx, ty, angle) {
        this.transform.set(tx, ty, angle);
        this.graphics.translate(this.transform.tx, this.transform.ty);
        this.graphics.rotate(this.transform.angle);
    }
    restoreTransform() {
        this.graphics.translate(this.transform.tx, this.transform.ty);
        this.graphics.rotate(this.transform.angle);
    }
    popTransform() {
        this.graphics.rotate(-this.transform.angle);
        this.graphics.translate(-this.transform.tx, -this.transform.ty);
    }

    save() {
        this.graphics.save();
    }
    restore() {
        this.graphics.restore();
    }

    /**
     * @param { HTMLImageElement } img 
     * @param { number } x 
     * @param { number } y
     */
    drawImage(img, x, y) {
        this.graphics.drawImage(img, Math.round(x), Math.round(y));
    }

    /**
     * @param { HTMLImageElement } img 
     * @param { number } x 
     * @param { number } y 
     * @param { number } w 
     * @param { number } h 
     */
    drawImageScaled(img, x, y, w, h) {
        this.graphics.drawImage(img, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
}
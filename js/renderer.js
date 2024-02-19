class Noteskin {
    /**
     * @param { Array<number> } angles 
     * @param { Array<Array<HTMLImageElement>> } note_textures 
     */
    constructor(angles, note_textures) {
        this.angles = angles;
        this.note_textures = note_textures;
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
        return this.note_textures[i][j % this.note_textures.length];
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
     */
    text(text, x, y, color) {
        this.graphics.textBaseline = "top";
        this.graphics.fillStyle = color;
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
     * @param { number } sx 
     * @param { number } sy 
     */
    drawImage(img, x, y, w, h) {
        this.graphics.drawImage(img, x, y, w, h);
    }
}
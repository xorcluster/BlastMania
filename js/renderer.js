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
     * @param { number } tx 
     * @param { number } ty 
     * @param { number } angle 
     */
    pushTransform(tx, ty, angle) {
        this.graphics.translate(this.transform.tx, this.transform.ty);
        this.graphics.rotate(this.transform.angle);
    }
    popTransform() {
        this.graphics.rotate(-this.transform.angle);
        this.graphics.translate(-this.transform.tx, -this.transform.ty);
    }

    /**
     * @param { ImageBitmap } img 
     * @param { number } x 
     * @param { number } y 
     * @param { number } sx 
     * @param { number } sy 
     */
    drawImage(img, x, y, w, h) {
        this.graphics.drawImage(img, x, y, w, h);
    }
}
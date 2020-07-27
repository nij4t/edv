import jsQR from 'jsqr';

export class Scanner {
    private animationId: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private source: HTMLVideoElement;
    private frames: number;
    private worker: Worker;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.source = document.createElement('video');
        this.frames = 0;
    }


    public attachTo(elm: HTMLElement) {
        elm.append(this.canvas);
    }

    public setSource(video: HTMLVideoElement) {
        this.source = video;
    }


    public start() {
        this.update();
    }


    public stop() {
        cancelAnimationFrame(this.animationId);
    }


    private update() {
        if (this.source.readyState === this.source.HAVE_ENOUGH_DATA) {
            if (this.frames % 10 === 0) {
                let image = this.draw();
                if (this.frames % 50 === 0) {
                    this.scan(image);
                }
                }
            }
            this.frames++
            this.animationId = requestAnimationFrame(() => this.update());
        }

    private draw() {
        this.canvas.width = this.source.videoWidth;
        this.canvas.height = this.source.videoHeight;
        this.ctx.drawImage(this.source, 0, 0);
        let image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return image;
    }

    private scan(image: ImageData) {
        let code = jsQR(image.data, image.width, image.height, {
            inversionAttempts: "dontInvert",
        });
        if (code !== null)
            console.log(code.data);
    }
}

import jsQR from 'jsqr';

export class Scanner {
    private animationId: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private source: HTMLVideoElement;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.source = document.createElement('video');
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
            this.canvas.width = this.source.videoWidth;
            this.canvas.height = this.source.videoHeight;
            this.ctx.drawImage(this.source, 0, 0);
            let image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            let code = jsQR(image.data, image.width, image.height, {
                inversionAttempts: "dontInvert",
            });
            if (code !== null)
                console.log(code.data);
        }
        this.animationId = requestAnimationFrame(() => this.update());
    }
}

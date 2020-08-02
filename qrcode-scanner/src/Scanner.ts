
export class Scanner {
    private animationId: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public source: HTMLVideoElement;
    private frames: number;
    private worker: Worker;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.source = document.createElement('video');
        this.frames = 0;
        this.worker = new Worker("./scannerWorker.ts");
    }

    public onScan(fn: SuccessfulScan) {
        this.worker.addEventListener('message', e => {
            fn(e.data)
        })
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
            this.draw();
            if (this.frames % 10 === 0) {
                this.scan()
                this.frames = 0
            }
        }
        this.frames++
        this.animationId = requestAnimationFrame(() => this.update());
    }

    private draw(): void {
        this.canvas.width = this.source.videoWidth;
        this.canvas.height = this.source.videoHeight;
        this.ctx.drawImage(this.source, 0, 0);
    }

    private getImageData(): ImageData {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    private scan() {
        const image = this.getImageData()
        this.worker.postMessage({ image })
    }
}

export interface SuccessfulScan {
    (data: string): void
}

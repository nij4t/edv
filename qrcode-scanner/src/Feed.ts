
export class Feed {
    private feed: HTMLVideoElement;

    constructor(elm: HTMLElement, stream: MediaStream) {
        this.feed = document.createElement('video');
        this.feed.srcObject = stream;
        this.feed.autoplay = true;
    }
    getFeed() {
        return this.feed;
    }
}

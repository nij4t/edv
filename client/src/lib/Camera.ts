
export class Camera {

    private video: HTMLVideoElement;

    constructor() {
        this.video = document.createElement("video")
    }

    public requestVideo(): Promise<HTMLVideoElement> {
        const mediaConstraints = {
            audio: false,
            video: { facingMode: "environment" }
        }
        return navigator
            .mediaDevices
            .getUserMedia(mediaConstraints)
            .then(
                stream => {
                    this.video.srcObject = stream
                    this.video.autoplay = true
                    return this.video
                })
            .catch(err => {
                console.error(err)
                throw err
            })
    }
}

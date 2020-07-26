
export class Camera {
    public async getCameras(): Promise<MediaDeviceInfo[]> {
        return navigator.mediaDevices.enumerateDevices();
    }


    public async getStream(): Promise<MediaStream> {
        const mediaConstraints = { audio: false, video: { facingMode: "environment" } };
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
    }

}

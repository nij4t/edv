import { Scanner } from "./Scanner"
import { Camera } from "./Camera"
import { Feed, Factory } from "./Feed"

(async () => {
    const wrapper = document.getElementById('wrapper')
    const cam = new Camera()

    // const feed = new Feed(wrapper, stream)
    // const stream = await cam.getStream()

    // const video = new Factory().make("video")
    // video.srcObject = stream;

    const cameraFeed = await cam.requestVideo()

    const scanner = new Scanner()
    scanner.attachTo(wrapper)
    // scanner.setSource(feed.getFeed())

    scanner.setSource(cameraFeed)
    // scan on worker thread
    scanner.start()
})()
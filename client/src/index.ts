import { Scanner } from "./Scanner"
import { Camera } from "./Camera"

(async () => {
    const wrapper = document.getElementById('wrapper')
    const cam = new Camera()

    const cameraFeed = await cam.requestVideo()

    const scanner = new Scanner()
    scanner.attachTo(wrapper)

    scanner.setSource(cameraFeed)
    scanner.start()
})()
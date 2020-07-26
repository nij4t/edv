import { Scanner } from "./Scanner"
import { Camera } from "./Camera"
import { Feed } from "./Feed"

(async () => {
    const cam = new Camera()
    const stream = await cam.getStream()
    const wrapper = document.getElementById('wrapper')
    const feed = new Feed(wrapper, stream)
    const scanner = new Scanner()
    scanner.attachTo(wrapper)
    scanner.setSource(feed.getFeed())
    scanner.start()
})()
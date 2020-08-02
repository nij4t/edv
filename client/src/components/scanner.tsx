import { Component, Fragment } from "preact";
import { h } from 'preact'
import * as libscanner from '../lib/Scanner'
import { Camera } from "../lib/Camera";

export class Scanner extends Component<Props, {}> {

    private scanner: libscanner.Scanner

    render() {
        return (
            <div id="scanner">
            </div>
        )
    }

    componentDidMount() {
        const cam = new Camera()
        this.scanner = new libscanner.Scanner()
        this.scanner.attachTo(document.querySelector('#scanner'))
        this.scanner.onScan((data) => {
            this.props.success(data)
        })
        cam.requestVideo().then(v => {
            this.scanner.setSource(v)
            this.scanner.start()
        })
    }

    componentWillUnmount() {
        this.scanner.stop()
        this.scanner.source.srcObject = null
    }

}

interface Props {
    success(data: string): void
}
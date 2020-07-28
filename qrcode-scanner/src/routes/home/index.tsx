import { h, Component } from 'preact'
import { Button } from "preact-material-components/ts/Button"

export class Home extends Component<IProp, {}> {
    render() {
        return (
            <Button onClick={this.props.logout}>Logout</Button>
        )
    }
}

interface IProp {
    logout(): void
}
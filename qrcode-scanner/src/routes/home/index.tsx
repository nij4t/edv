import { h, Component, Fragment } from 'preact'
import { Button } from "preact-material-components/ts/Button"
import { Scanner } from '../../components/scanner'

export class Home extends Component<IProp, State> {
    render() {
        return (
            <Fragment>
                <Button onClick={this.props.logout}>Logout</Button>
                <Scanner success={data => (this.props.success(data))}></Scanner>
            </Fragment>
        )
    }
}

interface State {
    fiskalId: string
}

interface IProp {
    logout(): void
    success(payload: string): void
}
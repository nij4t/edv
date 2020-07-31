import { h, Component } from 'preact'
import { Button } from 'preact-material-components/ts/Button'
import { TextField } from 'preact-material-components/ts/TextField'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/TextField/style.css'

import './style.css'

export class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.setState({ mobile: props.mobile, password: props.password })
    }

    render() {
        return (
            <div className="login">
                <h1>Login</h1>
                <TextField
                    onChange={(e: any) => this.setState({ mobile: e.target.value })}
                    className="input"
                    label="Phone Number"
                    value={this.state.mobile}>
                </TextField>
                <TextField
                    onChange={(e: any) => this.setState({ password: e.target.value })}
                    className="input"
                    type="password"
                    label="Password"
                    value={this.state.password}>
                </TextField>
                <Button
                    className="button"
                    raised
                    onClick={() => (this.props.authenticate(this.state))}>
                    Login
                    </Button>
            </div>
        )
    }
}

interface State {
    mobile: string
    password: string
}

interface Props {
    mobile?: string
    password?: string;
    authenticate: Function
}
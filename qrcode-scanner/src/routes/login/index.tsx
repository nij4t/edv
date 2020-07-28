import { h, Component } from 'preact'
import { Button } from 'preact-material-components/ts/Button'
import { TextField } from 'preact-material-components/ts/TextField'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/TextField/style.css'

import './style.css'

export class Login extends Component<IProps,{}> {
    render() {
        return (
            <div className="login">
                <h1>Login</h1>
                <TextField className="input" label="Phone Number"></TextField>
                <TextField className="input" type="password" label="Password"></TextField>
                <Button className="button" raised onClick={this.props.authenticate}>Login</Button>
            </div>
        )
    }
    
    authenticate = () => {
        this.props.authenticate()
    }

}

interface IProps {
    authenticate(): void;
}
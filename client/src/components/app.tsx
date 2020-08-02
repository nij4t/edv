import { h, Component, Fragment } from 'preact'
import { Router, RouterOnChangeArgs, route } from 'preact-router'
import Dialog from 'preact-material-components/ts/Dialog'
import 'preact-material-components/Dialog/style.css';

import { Home as Home } from "../routes/home"
import { Login } from '../routes/login'
import { CookieStorage } from '../lib/CookieStorage'
import * as EDVClient from '../lib/EDVClient'
import { memoize } from '../lib/util';


export class App extends Component<{}, State> {

    private sessionStorage: Storage;
    private scrollingDlg: any;
    private memoized: Function;

    constructor() {
        super()
        this.sessionStorage = new CookieStorage()
        this.memoized = memoize(this.find).bind(this)
    }

    render() {
        return (
            <Fragment>
                <Router onChange={this.handleRoute}>
                    <Home path="/" success={this.handleSuccessfulScan} logout={this.logout} />
                    <Login path="/login" authenticate={this.login} />
                </Router>
                <Dialog ref={scrollingDlg => { this.scrollingDlg = scrollingDlg; }}>
                    <Dialog.Header>Information</Dialog.Header>
                    <Dialog.Body>
                        {this.state.dialogBody}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>Decline</Dialog.FooterButton>
                        <Dialog.FooterButton accept={true}>Accept</Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </Fragment>
        )
    }

    handleRoute = (e: RouterOnChangeArgs) => {
        if (!this.isAuthenticated()) {
            route('/login')
            return
        }

        if (e.url === '/login') {
            route('/')
            return
        }
    }

    isAuthenticated = () => {
        const token = this.sessionStorage.getItem("token")
        return token === "" ? false : true
    }


    login = (req: EDVClient.AuthRequestBody) => {
        EDVClient.auth(req).then(v => {
            this.sessionStorage.setItem("token", v.Body.token)
            route('/')
        })
    }

    logout = () => {
        this.sessionStorage.removeItem("token")
        route('/login')
    }

    handleSuccessfulScan = (url: string) => {
        const re = /doc=(\w{12})/
        const fiskalId = re.exec(url)[1]

        this.memoized(fiskalId).then((v: EDVClient.FindResponse) => {
            console.log(v)
            this.setState({ dialogBody: v.body.message })
            this.scrollingDlg.MDComponent.show()
        })
    }

    private find(fiskalId: string): Promise<EDVClient.FindResponse> {
        return EDVClient.find(
            {
                body: { id: fiskalId },
                headers: {
                    "x-access-token": this.sessionStorage.getItem("token")
                }
            })
    }
}

interface State {
    dialogBody: string
}
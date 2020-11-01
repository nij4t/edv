import { h, Component, Fragment } from 'preact'
import { Router, RouterOnChangeArgs, route } from 'preact-router'
import Dialog from 'preact-material-components/ts/Dialog'
import 'preact-material-components/Dialog/style.css';

import { Home as Home } from "../routes/home"
import { Login } from '../routes/login'
import { CookieStorage } from '../lib/CookieStorage'
import { debounce } from '../lib/util';
import { AuthRequestBody, EDVClient, FindResponse, ReadyFindRespone, RefundResponse } from '../lib/EDVClient';


export class App extends Component<{}, State> {

    private sessionStorage: Storage;
    private scrollingDlg: any;
    private debounced: Function;
    private edvClient: EDVClient;

    constructor() {
        super()
        this.sessionStorage = new CookieStorage()
        this.debounced = debounce(this.handleSuccessfulScan, 1000, true).bind(this)
        this.edvClient = new EDVClient(window.location.origin)
    }

    render() {
        return (
            <Fragment>
                <Router onChange={this.handleRoute}>
                    <Home path="/" success={p => this.debounced(p)} logout={this.logout} />
                    <Login path="/login" authenticate={this.login} />
                </Router>
                <Dialog onAccept={this.refund} ref={scrollingDlg => { this.scrollingDlg = scrollingDlg; }}>
                    <Dialog.Header>Information</Dialog.Header>
                    <Dialog.Body>
                        {this.state.dialogBody}
                    </Dialog.Body>
                    <Dialog.Footer>
                        {
                            this.state.dialogMode === "unary" ?
                                <Dialog.FooterButton cancel={true}>OK</Dialog.FooterButton>
                                :
                                <Fragment>
                                    <Dialog.FooterButton accept={true}>Yes</Dialog.FooterButton>
                                    < Dialog.FooterButton cancel={true}>No</Dialog.FooterButton>
                                </Fragment>
                        }
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


    login = (req: AuthRequestBody) => {
        this.edvClient.auth(req).then(v => {
            this.sessionStorage.setItem("token", v.Body.token)
            route('/')
        })
    }

    logout = () => {
        this.sessionStorage.removeItem("token")
        route('/login')
    }

    // TODO: Add service worker caching
    handleSuccessfulScan = (url: string) => {
        // TODO: Add validation method
        const re = /doc=(\w{12})/
        const fiskalId = re.exec(url)[1]
        console.log(this.state)

        // TODO: extract status codes to constants
        // TODO: show dialog on body state change event
        this.find(fiskalId).then((v: FindResponse) => {
            if (v.body.code === 400 || v.body.code === 406) {
                this.setState({ lastCashbackResponse: v, dialogMode: 'unary', dialogBody: v.body.message })
                this.scrollingDlg.MDComponent.show()
                return
            }

            if (v.body.code === 200) {
                this.setState({ lastCashbackResponse: v, dialogMode: 'binary', dialogBody: `Return ${v.body.data.refundAmount.value} ${v.body.data.refundAmount.currency.name}?` })
                this.scrollingDlg.MDComponent.show()
                return
            }
        })
    }

    private find(fiskalId: string): Promise<FindResponse> {
        return this.edvClient.find(
            {
                body: { id: fiskalId },
                headers: {
                    "x-access-token": this.sessionStorage.getItem("token")
                }
            })
    }

    refund = () => {
        console.log(this.state.lastCashbackResponse)
        this.edvClient.refund(
            {
                body:
                    { id: (this.state.lastCashbackResponse as ReadyFindRespone).body.data.id },
                headers: {
                    "x-access-token": this.sessionStorage.getItem("token")
                }
            }).then((v: RefundResponse) => {
                this.setState({ dialogMode: 'unary', dialogBody: v.body.data.message })
                this.scrollingDlg.MDComponent.show()
            })
    }

}

interface State {
    dialogBody: string
    dialogMode: DialogMode
    lastCashbackResponse: FindResponse
}

type DialogMode = 'binary' | 'unary'
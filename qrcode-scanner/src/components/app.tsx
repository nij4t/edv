import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs, route } from 'preact-router'

import { Home } from "../routes/home"
import { Login } from '../routes/login'
import { CookieStorage } from '../CookieStorage'


export class App extends Component {

    private sessionStorage: Storage;

    constructor() {
        super()
        this.sessionStorage = new CookieStorage()
    }

    render() {
        return (
            <Router onChange={this.handleRoute}>
                <Home path="/" logout={this.logout} />
                <Login path="/login" authenticate={this.login} />
            </Router>
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

    private authenticate(req: AuthRequestBody): Promise<AuthResponse> {
        return fetch('/api/v1alpha1/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req)
        }).then(
            res => res.json()
        )
    }
}

interface AuthRequestBody {
    mobile: string
    password: string
}

interface AuthResponse {
    Body: { token: string }
}

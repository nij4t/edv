import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs, route } from 'preact-router'

import { Home } from "../routes/home"
import { Login } from '../routes/login'
import { State } from '../types'

export class App extends Component<{}, State> {

    constructor() {
        super()
        const auth = localStorage.getItem('authenticated') !== null ? true : false
        this.setState({ authenticated: auth })
    }

    render() {
        return (
            <Router onChange={this.handleRoute}>
                <Home path="/" logout={this.logout} />
                <Login path="/login" authenticate={this.auth} />
            </Router >
        )
    }

    handleRoute = (e: RouterOnChangeArgs) => {
        if (!this.state.authenticated) {
            route('/login')
            return
        }

        if (e.url === '/login') {
            route('/')
            return
        }
    }

    isAuthenticated = () => {
        return this.state.authenticated
    }


    auth = () => {
        this.setState({ authenticated: true })
        localStorage.setItem('authenticated', 'true')
        route('/')
    }

    logout = () => {
        this.setState({ authenticated: false })
        localStorage.removeItem('authenticated')
        route('/login')
    }
}

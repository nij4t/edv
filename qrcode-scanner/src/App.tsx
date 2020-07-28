import { h, render } from 'preact'

import "./style"
import { App as AppComponent } from './components/app'

const App = () => (
    <AppComponent />
);

render(<App />, document.querySelector("root"))

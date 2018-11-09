import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'

import Home from './routes/home'
import Game from './routes/game'


export default ({ store }) => (
    <Provider store={store}>
        <div className="flex fill-parent">
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/game" component={Game} />
                </Switch>
            </Router>
        </div>
    </Provider>
)

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'

import App from './main'
import './scss/main.scss';

const store = createStore((() => ({})))

ReactDOM.render(<App store={store} />, document.getElementById('root'));
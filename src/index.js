import React from 'react';
import ReactDOM from 'react-dom';
import store from './store'
import {getChosenCase, getUnopenedCases} from './reducer'

import App from './main'
import './scss/main.scss';

const mainStore = store
mainStore.subscribe(() => console.log(store.getState()))

ReactDOM.render(<App store={store} />, document.getElementById('root'));
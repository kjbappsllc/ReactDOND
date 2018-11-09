import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'

import App from './main'
import './scss/main.scss';
import combos from 'combos'

const store = createStore(() => {
    const permutations = combos({
        dinner: [1,2,3],
        shopping: [1,2,3],
        spa: [1,2,3],
        gifts: [1,2,3]
    })
    function sum(total, num) {
        return total + num;
    }
    const values = permutations.map((obj, ind) => {
        const total = (Object.values(obj)).reduce(sum)
        return {...obj, total}
    })
    const sorted_values = values.sort((a,b) => a.total - b.total)
    console.log(sorted_values.splice(sorted_values.length - 27))
    return {}
})

ReactDOM.render(<App store={store} />, document.getElementById('root'));
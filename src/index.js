import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'

import App from './main'
import './scss/main.scss';
import combos from 'combos'

const store = createStore(() => {
    const permutations = combos({
        dinner: [{location: ["Aldo", "Bosco", "Bahama Breeze"], value: 65, description: "All inclusive dinner"},
                 {location:["Ciao Bella", "Buckley's", "The Beauty Shop", "Ecco"], value: 90, description: "All inclusive dinner"},
                 {location:["Flight", "Catherine and Mary's", "Char", "Southern Social"], value: 115, description: "All inclusive dinner"}],
        shopping: [{location: ["Black Friday!"], value: 100, description: "$150 for Black Friday shopping! "},
                   {location: ["Black Friday!"], value: 200, description: "$250 for Black Friday shopping! "},
                   {location: ["Black Friday!"], value: 300, description: "$350 for Black Friday shopping!"}],
        spa: [{location: ["Relax Nail Spa"], value: 60, description: "'Basic Facial'"},
              {location: ["Relax Nail Spa"], value: 75, description: "'Mani and Spa Pedi' with nail and toe polish and file"},
              {location: ["The Spa Midtown"], value: 115, description: "'Herbal Fusion Massage' 60 minutes"}]
        gifts: [{location: ["Amazon"], value: 50, description: "Hair Package: Mielle Gummy Healthy Hair Adult Vitamins, Tea tree oil, "},
                {location: ["Amazon"], value: 60, description: "Sounds Package:  JBL Clip 3 Speaker"},
                {locaton: ["Amazon"], value: 100, description: "Feel Warm Package: Electric Heated Throw Blanket, Ceramic Space Heater"}]
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
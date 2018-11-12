
import {combineReducers} from 'redux'
import combos from 'combos'
import _ from 'lodash'

const createInitialRewards = () => {
    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    const permutations = combos({
        dinner: [{ location: ["Aldo", "Bosco", "Bahama Breeze", "Majestic Grille"], value: 70, description: "Dinner with your choice of wine " },
        { location: ["Ciao Bella", "Buckley's", "The Beauty Shop", "Ecco"], value: 90, description: "All inclusive dinner" },
        { location: ["Flight", "Catherine and Mary's", "Char", "Southern Social"], value: 115, description: "All inclusive dinner" }],
        shopping: [{ location: ["Black Friday!"], value: 100, description: "$100 for Black Friday shopping! " },
        { location: ["Black Friday!"], value: 200, description: "$200 for Black Friday shopping! " },
        { location: ["Black Friday!"], value: 300, description: "$300 for Black Friday shopping!" }],
        spa: [{ location: ["Relax Nail Spa"], value: 65, description: "'Basic Facial'" },
        { location: ["Relax Nail Spa"], value: 75, description: "'Mani and Spa Pedi' with nail and toe polish and file" },
        { location: ["The Spa Midtown"], value: 115, description: "'Herbal Fusion Massage' 60 minutes" }],
        gifts: [{ location: ["Stores Near You"], value: 55, description: "Hair Package: Mielle Gummy Healthy Hair Adult Vitamins with shea moisture shampoo and conditioner set" },
        { location: ["Amazon"], value: 60, description: "Sounds Package:  JBL Clip 3 Speaker" },
        { locaton: ["Amazon"], value: 100, description: "Feel Warm Package: Electric Heated Throw Blanket, Ceramic Space Heater" }]
    })
    const values = permutations.map((obj, ind) => {
        const total = _.sumBy(Object.values(obj), 'value')
        const uuid = create_UUID()
        return { ...obj, total, uuid }
    })
    const sorted_values = values.sort((a, b) => a.total - b.total);
    return sorted_values.filter((obj, ind) => (ind + 1) % 3 == 0).splice(1);
}

const createBankerRewards = () => {

}

const Reducer = (initialState, handlers={}) => {
    return (state = initialState, action) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

const gameActions = {

}

const gameInitalState = {
    rewards: createInitialRewards(),
    chosenCaseId: '',
    openedCases: [],
    currentRound: 0
}

const game = Reducer(gameInitalState)
export const getUnopenedCases = state => _.filter(state.game.rewards, (obj) => state.game.openedCases.includes(obj.uuid));
export const getChosenCase = state => _.find(state.game.rewards, {uuid: state.game.chosenCaseId});
export default combineReducers({
    game
})
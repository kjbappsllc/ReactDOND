
import { combineReducers } from 'redux'
import combos from 'combos'
import _ from 'lodash'

const createInitialRewards = () => {
    const mask = [.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000]
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
        dinner: [{ location: ["Aldo", "Bosco", "Bahama Breeze", "Majestic Grille", "Fridas"], value: 70, description: "All inclusive dinner" },
        { location: ["Ciao Bella", "Buckley's", "The Beauty Shop", "Ecco"], value: 90, description: "All inclusive dinner" },
        { location: ["Flight", "Catherine and Mary's", "Char", "Southern Social", "Owen Brennan's"], value: 115, description: "All inclusive dinner" }],
        shopping: [{ location: ["Black Friday!"], value: 100, description: "$100 for Black Friday shopping! " },
        { location: ["anywhere where there is Black Friday!"], value: 200, description: "$200 for Black Friday shopping! " },
        { location: ["anywhere where there is Black Friday!"], value: 300, description: "$300 for Black Friday shopping!" }],
        spa: [{ location: ["Relax Nail Spa"], value: 65, description: "'Basic Facial'" },
        { location: ["Relax Nail Spa"], value: 75, description: "Mani and Spa Pedi' with nail and toe polish and file" },
        { location: ["The Spa Midtown"], value: 115, description: "Herbal Fusion Massage' 60 minutes" }],
        gift: [{ location: ["Stores Near You"], value: 55, description: "Hair Package: Mielle Gummy Healthy Hair Adult Vitamins with shea moisture shampoo and conditioner set" },
        { location: ["online at Amazon"], value: 70, description: "Feel Warm Package: Sunbeam Fleece Heated Electric Throw Blanket with PrimeStyle Lighted Controller, Garnet Red and andily Space Heater with Thermostat, 750W/1500W" },
        { locaton: ["online at Amazon"], value: 100, description: "Kitchen Package: NutriBullet Pro - 13-Piece High-Speed Blender/Mixer System with Hardcover Recipe Book Included (900 Watts) and Brieftons QuickPush Food Chopper: Strongest & 200% More Container Capacity, 30% Heavier Duty, Onion Chopper, Kitchen Vegetable Dicer, Fruit and Cheese Cutter, with 3 Dicing Blades & Keep-Fresh Lid" }]
    })
    const values = permutations.map((obj, ind) => {
        const total = _.sumBy(Object.values(obj), 'value')
        const uuid = create_UUID()
        return { ...obj, total, uuid }
    })
    const rewards = values.sort((a, b) => a.total - b.total).filter((obj, ind) => (ind + 1) % 3 == 0).splice(1);
    return rewards.map((obj, ind) => {
        return { ...obj, mask: mask[ind] }
    })
}

const createBankerRewards = () => {
    const small = [
        "Dinner at Gus's chicken and a rose",
        "Dinner at Huey's and Ultrasonic Essential Oil Deffuser",
        "Dinner at Frida's with face masks",
        "Dinner at Las Delicias and the Echo Auto",
        "Dinner at Uncle Lou's with a rose",
        "Dinner at Cordova Catfish with 'Good Housekeeping Cookbook"
    ]
    const mediumSmall = [
        "Dinner at Pho Bin and the JBL Sounds Speaker 3",
        "Dinner at Babalu and a Citrine November Birthstone Necklace",
        "Dinner at Belly Acres and Fujifilm Instax Mini 9 - Ice Blue Instant Camera",
        "Dinner at Frida's HelloFresh subscriptions for 2 months"
    ]
    const medium = [
        "Go Pro Hero 2018",
        "PowerBeats 3 wireless Earphones",
        "Clarisonic Mia Prima Sonic Cleansing Face Brush White and an Aerie Swimsuit: yellow with green flowers",
        "Dinner at Central and a spa basket which includes nail polish, face masks, and lotion",
        "Dinner at Bosco's with the Clarisonic Sonic Awakening Eye Massager"
    ]
    const mediumLarge = [
        "Dinner at Osaka and Apple Airpods",
        "Dinner at Casablanca and Ninja BL681A Mega Kitchen System, 16, Black",
        "Dinner at Majestic Grille with the Fitbit charge 3 Fitness Tracker",
        "Dinner at Soul Fish Cafe with Spa Mani Pedi and Fujifilm Instax Mini 9 - Ice Blue Instant Camera",
        "Dinner at Pho Bin with PowerBeats 3 wirless Earphones",
        "Dinner at Aldo's with Pink addidas tennis shoes and Spa pedicure"
    ]
    const large = [
        "Dinner at Flight and Spa Mani Pedi with the Ninja BL681A Mega Kitchen System, 16, Black",
        "Dinner at the Beauty Shop and Spa Mani Pedi with Apple Airpods",
        "Dinner at Owen Brennan's and Spa Mani Pedi with Clarisonic Mia Prima Sonic Cleansing Face Brush and JBL Sounds Speaker 3",
        "Dinner at Buckley's with the Go Pro Hero 2018 and Spa Pedicure"
    ]
    return { small, mediumSmall, medium, mediumLarge, large }
}

const Reducer = (initialState, handlers = {}) => {
    return (state = initialState, action) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

const gameInitalState = {
    rewards: _.shuffle(createInitialRewards()),
    bankerOptions: createBankerRewards(),
    previousBankerOffers: [],
    chosenCaseId: '',
    openedCases: [],
    chosenReward: '',
    infoText: 'Please Select Your Case',
    currentRound: 0,
    bankerPhase: false,
    highestOffer: 0,
    gameOver: false
}

const game = Reducer(gameInitalState, {
    'OPEN_CASE': (state, action) => ({ ...state, openedCases: [...state.openedCases, action.payload] }),
    'INCREASE_ROUND': (state, action) => ({ ...state, currentRound: state.currentRound + 1 }),
    'CHOSE_PERSONAL_CASE': (state, action) => ({ ...state, chosenCaseId: action.payload }),
    'CHANGE_INFO_TEXT': (state, action) => ({ ...state, infoText: action.payload }),
    'SHOW_BANKER_MODAL': (state, action) => ({ ...state, bankerPhase: action.payload }),
    'HIDE_BANKER_MODAL': (state, action) => ({ ...state, bankerPhase: false }),
    'SET_BANKER_OFFER': (state, action) => ({ ...state, bankerPhase: action.payload }),
    'SET_HIGHEST_OFFER': (state, action) => ({ ...state, highestOffer: action.payload }),
    'ADD_TO_PREVIOUS_OFFERS': (state, action) => ({ ...state, previousBankerOffers: [...state.previousBankerOffers, action.payload] }),
    'GAME_RESET': (state, action) => ({ ...gameInitalState }),
    'SET_CHOSEN_REWARD': (state, action) => ({ ...state, chosenReward: action.payload }),
    'SET_GAME_OVER': (state, action) => ({ ...state, gameOver: true })
})

export const getUnopenedCases = state => _.filter(state.game.rewards, (obj) => !state.game.openedCases.includes(obj.uuid));
export const getOpenedCases = state => state.game.openedCases;
export const getPlayableRewards = state => _.filter(state.game.rewards, obj => obj.uuid !== state.game.chosenCaseId)
export const getChosenCase = state => _.find(state.game.rewards, { uuid: state.game.chosenCaseId });
export const getCurrentRound = state => state.game.currentRound
export const getInfoText = state => state.game.infoText
export const getBankerPhase = state => state.game.bankerPhase
export const getBankerOffer = state => state.game.bankerPhase.bankerOffer && state.game.bankerPhase.bankerOffer.maskOffer
export const getBankerRealOffer = state => state.game.bankerPhase.bankerOffer && state.game.bankerPhase.bankerOffer.realOffer
export const getHighestOffer = state => state.game.highestOffer
export const getBankerOptions = state => state.game.bankerOptions
export const getPreviousBankerOffers = state => state.game.previousBankerOffers
export const getChosenReward = state => state.game.chosenReward
export const getGameOver = state => state.game.gameOver
export default combineReducers({
    game
})
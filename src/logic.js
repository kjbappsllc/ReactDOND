import { createLogic } from 'redux-logic';
import { getOpenedCases, getCurrentRound, getPlayableRewards, getChosenCase, getUnopenedCases, getHighestOffer, getBankerOptions, getPreviousBankerOffers } from './reducer'
import _ from 'lodash'

const genCasesToOpenInfoText = num => `Chose ${num} more case(s) to open`
const roundsSequence = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1]
const getTargetOpenCases = currRound => roundsSequence.slice(0, currRound).reduce((n, total) => n + total)

const caseClickedLogic = createLogic({
    type: 'CASE_CLICKED',
    process({ getState, action }, dispatch, done) {
        const currentRound = getCurrentRound(getState())
        if (currentRound === 0) {
            dispatch({ type: 'CHOSE_PERSONAL_CASE', payload: action.payload })
            dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(roundsSequence[currentRound]) })
            dispatch({ type: 'INCREASE_ROUND' })
        } else {
            dispatch({ type: 'OPEN_CASE', payload: action.payload })
            const openedCases = getOpenedCases(getState()).length
            const rewardsLen = getPlayableRewards(getState()).length
            const targetOpenCases = getTargetOpenCases(currentRound)
            const desiredCasesToOpen = targetOpenCases - openedCases

            //Game is over
            if (openedCases - rewardsLen === 0) {
                const lastCase = getUnopenedCases(getState())
                dispatch({ type: 'SHOW_REWARDS', payload: lastCase[0] })
            }
            //Need To call Banker
            else if (desiredCasesToOpen === 0) {
                dispatch({ type: 'BANKER_CALL' })
            } else {
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(desiredCasesToOpen) })
            }
        }
        done()
    }
})

const bankerCallLogic = createLogic({
    type: 'BANKER_CALL',
    process({ getState, action }, dispatch, done) {
        let currentRound = getCurrentRound(getState())
        dispatch({ type: 'SHOW_BANKER_MODAL', payload: { bankerOffer: '' } })
        dispatch({ type: 'CHANGE_INFO_TEXT', payload: ' ' })
        const bankerOfferDecay = 0.25
        const unopenedCases = getUnopenedCases(getState())
        const highestOffer = getHighestOffer(getState())
        const bankerOptions = getBankerOptions(getState())
        const prevOffers = getPreviousBankerOffers(getState())
        const remainingMean = unopenedCases.reduce((a, b) => a + b.mask, 0) / unopenedCases.length
        const multiplier = bankerOfferDecay * currentRound
        const bankOffer = Math.ceil(multiplier < 1 ? remainingMean * multiplier : remainingMean)
        let realOffer = ''
        const getRealOffer = (optionsArr) => {
            let offer = ''
            if (optionsArr.every(val => prevOffers.includes(val))) {
                offer = _.sample(optionsArr);
            } else {
                offer = optionsArr.find(val => !prevOffers.includes(val))
            }
            return offer
        }
        switch (true) {
            case (bankOffer > 0 && bankOffer <= 35000): realOffer = getRealOffer(bankerOptions.small); break;
            case (bankOffer > 35000 && bankOffer <= 65000): realOffer = getRealOffer(bankerOptions.mediumSmall); break;
            case (bankOffer > 65000 && bankOffer <= 100000): realOffer = getRealOffer(bankerOptions.medium); break;
            case (bankOffer > 100000 && bankOffer <= 150000): realOffer = getRealOffer(bankerOptions.mediumLarge); break;
            default: realOffer = getRealOffer(bankerOptions.large); break;
        }
        setTimeout(() => {
            dispatch({ type: 'SET_BANKER_OFFER', payload: { bankerOffer: { maskOffer: bankOffer, realOffer: realOffer } } })
            dispatch({ type: 'ADD_TO_PREVIOUS_OFFERS', payload: realOffer })
            if (bankOffer > highestOffer) {
                dispatch({ type: 'SET_HIGHEST_OFFER', payload: bankOffer })
            }
            done()
        }, 2000)
    }
})

const bankerOfferDecisionLogic = createLogic({
    type: 'BANKER_OFFER_DECISION',
    process({ getState, action }, dispatch, done) {
        const currentRound = getCurrentRound(getState())
        dispatch({ type: 'HIDE_BANKER_MODAL' })
        if (action.payload === 'NO_DEAL') {
            if (currentRound === 9) {
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: 'Choose one of the remaining cases to eliminate!' })
            } else {
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(roundsSequence[currentRound]) })
            }
        }
        dispatch({ type: 'INCREASE_ROUND' })
        done()
    }
})

const showRewardsLogic = createLogic({
    type: 'SHOW_REWARDS',
    process({ getState, action }, dispatch, done) {
        console.log("Attempting to show rewards")
    }
})

export default [
    caseClickedLogic,
    bankerCallLogic,
    bankerOfferDecisionLogic
]
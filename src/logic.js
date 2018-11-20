import { createLogic } from 'redux-logic';
import { getOpenedCases, getCurrentRound, getPlayableRewards, getChosenCase, getUnopenedCases, getHighestOffer } from './reducer'
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
                const chosenCase = getChosenCase(getState())
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: JSON.stringify(chosenCase) })
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
        dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(roundsSequence[currentRound]) })
        dispatch({ type: 'INCREASE_ROUND' })

        currentRound = getCurrentRound(getState())
        const bankerOfferDecay = 0.25
        const unopenedCases = getUnopenedCases(getState())
        const highestOffer = getHighestOffer(getState())
        const remainingMean = unopenedCases.reduce((a,b) => a + b.mask, 0) / unopenedCases.length
        const multiplier = bankerOfferDecay * currentRound
        const bankOffer = Math.ceil(multiplier < 1 ? remainingMean * multiplier : remainingMean)

        setTimeout(() => {
            dispatch({ type: 'SET_BANKER_OFFER', payload: { bankerOffer: bankOffer } })
            if(bankOffer > highestOffer){
                dispatch({type: 'SET_HIGHEST_OFFER', payload: bankOffer })
            }
            done()
        }, 2000)
    }
})

const bankerOfferDecisionLogic = createLogic({
    type: 'BANKER_OFFER_DECISION',
    process({ getState, action }, dispatch, done) {
        dispatch({ type: 'HIDE_BANKER_MODAL' })
    }
})

export default [
    caseClickedLogic,
    bankerCallLogic,
    bankerOfferDecisionLogic
]
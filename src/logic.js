import { createLogic } from 'redux-logic';
import { getOpenedCases, getCurrentRound, getPlayableRewards } from './reducer'

const genCasesToOpenInfoText = num => `Chose ${num} more case(s) to open`
const roundsSequence = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1]
const getTargetOpenCases = currRound => roundsSequence.slice(0, currRound).reduce((n, total) => n + total)

const caseClickedLogic = createLogic({
    type: 'CASE_CLICKED',
    process({ getState, action }, dispatch, done) {
        const currentRound = getCurrentRound(getState())
        let gameover = false
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
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: 'GAME OVER' })
                gameover = true
            }
            //Need To call Banker
            else if (desiredCasesToOpen === 0) {
                dispatch({ type: 'BANKER_CALL' })
            } else {
                dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(desiredCasesToOpen) })
            }
        }
        if (gameover) {
            setTimeout(() => {
                dispatch({ type: 'GAME_RESET' })
                done()
            }, 2000);
        } else {
            done()
        }
    }
})

const bankerCallLogic = createLogic({
    type: 'BANKER_CALL',
    process({ getState, action }, dispatch, done) {
        dispatch({ type: 'SHOW_BANKER_MODAL', payload: { bankerOffer: '' } })
        const currentRound = getCurrentRound(getState())
        dispatch({ type: 'CHANGE_INFO_TEXT', payload: genCasesToOpenInfoText(roundsSequence[currentRound]) })
        dispatch({ type: 'INCREASE_ROUND' })

        setTimeout(() => {
            dispatch({ type: 'SET_BANKER_OFFER', payload: { bankerOffer: '0' } })
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
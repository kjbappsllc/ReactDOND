import { createLogic } from 'redux-logic';
import { getUnopenedCases, getCurrentRound, getPlayableRewards } from './reducer'

const caseClickedLogic = createLogic({
    type: 'CASE_CLICKED',
    process({ getState, action }, dispatch, done) {
        const currentRound = getCurrentRound(getState())
        const unopenedCases = getUnopenedCases(getState())
        const rewardsLen = getRewardsLen(getState())
        const roundsSequence = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1]

        if (currentRound === 0) {
            dispatch({ type: 'CHOSE_PERSONAL_CASE', payload: action.payload })
            dispatch({ type: 'INCREASE_ROUND' })
        } else {
            dispatch({ type: 'OPEN_CASE', payload: action.payload })
        }
        done()
    }
})

export default [
    caseClickedLogic
]
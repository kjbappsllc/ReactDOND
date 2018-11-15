import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic';
import mainReducer from './reducer'
import mainLogic from './logic'

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
const logicMiddleware = createLogicMiddleware(mainLogic, {});
const middleware = applyMiddleware(
    logicMiddleware,
    logger
);
export default createStore(mainReducer, middleware)
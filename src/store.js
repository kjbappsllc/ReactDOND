import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic';
import mainReducer from './reducer'

const logicMiddleware = createLogicMiddleware([], {});
const middleware = applyMiddleware(
    logicMiddleware
);
export default createStore(mainReducer, middleware)
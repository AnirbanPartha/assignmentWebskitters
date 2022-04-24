import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducer/rootReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

// ===========================|| REDUX - MAIN STORE ||=========================== //
const initialState = {};

const middleware = [thunk, logger];
const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

export { store };

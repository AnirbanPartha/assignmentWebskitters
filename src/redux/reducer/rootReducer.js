import { combineReducers } from "redux";

// reducer import

import errorReducer from "./errorReducer";

import productReducer from "./productReducer";
import { reducer as formReducer } from "redux-form";

// ===========================|| COMBINE REDUCER ||=========================== //

const reducer = combineReducers({
  errorRoot: errorReducer,
  productData: productReducer,
  form: formReducer,
});

export default reducer;

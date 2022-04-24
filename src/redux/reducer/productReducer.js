const initialState = {
  product: [],
};

const userCreateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PRODUCT": {
      return {
        ...state,
        product: [...state.product, action.payload],
      };
    }
    case "UPDATE_PRODUCT": {
      let array = [];
      for(let i = 0; i <= state.product.length - 1; i++){
        if(action.payload.id != state.product[i].id){
          array.push(state.product[i]);
        }
      }
      array.push(action.payload);
      return {
        ...state,
        product: array,
      };
    }
    case "CLEAR_ALL": {
      return {
        ...state,
        product: action.payload,
      };
    }
    case "GET_BY_ID_UPDATE_PRODUCT": {
      return {
        ...state,
        product: action.payload,
      };
    }
    case "GET_ALL_PRODUCT": {
      return {
        ...state,
        product: [...state.product, action.payload],
      };
    }
    case "DELETE_BY_ID_PRODUCT": {
      console.log(state.product);
      let array = [];
      for(let i = 0; i <= state.product.length - 1; i++){
        if(action.payload != state.product[i].id){
          array.push(state.product[i]);
        }
      }
      return {
        ...state,
        product: array,
      };
    }
    default:
      return state;
  }
};

export default userCreateReducer;

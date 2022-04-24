import firebase from "../../firebase";
const db = firebase.ref('/products');
export const addProduct = (key, productDataJson) => {
  return (dispatch) => {
    try {
      //call the firebase api
      console.log(productDataJson);
      console.log(db);

      db.child(key).update(productDataJson).then(() => {
        console.log("Created new item successfully!");
        dispatch({
          type: "CREATE_PRODUCT",
          payload: productDataJson, // store the res product obj
        });
      })
        .catch((e) => {
          console.log("Not suported");
          console.log(e);
        });

    } catch (error) { }
  };
};
export const updateProductById = (key, productDataJson) => {
  return (dispatch) => {
    try {
      //call the firebase api
      console.log(productDataJson);
      console.log(db);

      db.child(key).update(productDataJson).then(() => {
        console.log("Update item successfully!");
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: productDataJson, // store the res product obj
        });
      })
        .catch((e) => {
          console.log("Not suported");
          console.log(e);
        });

    } catch (error) { }
  };
};
export const getByIDProduct = (productDataJson) => {
  return (dispatch) => {
    try {
      //call the firebase api
      dispatch({
        type: "GET_BY_ID_PRODUCT",
        payload: productDataJson, // store the res product obj
      });
    } catch (error) { }
  };
};



export const getAllProduct = (productDataJson) => {
  return (dispatch) => {
    try {
      //call the firebase api
      console.log("all data display");
      dispatch({
        type: "GET_ALL_PRODUCT",
        payload: productDataJson, // store the res product obj
      });
    } catch (error) { }
  };
};

export const deleteProduct = (key, productDataJson) => {
  return (dispatch) => {
    try {
      //call the firebase api
      console.log(key);
      db.child(key).remove().then(() => {
        console.log("Delete item successfully!");
        dispatch({
          type: "DELETE_BY_ID_PRODUCT",
          payload: key, // store the res product obj
        });
      })
        .catch((e) => {
          console.log("Not suported");
          console.log(e);
        });

    } catch (error) { }
  };
};
export const clearProduct = () => {
  return (dispatch) => {
    try {
      dispatch({
        type: "CLEAR_ALL",
        payload: [], // store the res product obj
      });


    } catch (error) { }
  };
};

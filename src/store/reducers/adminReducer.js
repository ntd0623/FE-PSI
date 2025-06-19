import actionTypes from "../actions/actionTypes";

const initialState = {
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    // Gender
    // case actionTypes.FETCH_GENDER_START:
    //   state.isLoadingGender = true;
    //   return {
    //     ...state,
    //   };
    // case actionTypes.FETCH_GENDER_SUCCESS:
    //   state.isLoadingGender = false;
    //   state.genders = action.data;
    //   return {
    //     ...state,
    //   };
    // case actionTypes.FETCH_GENDER_FAILED:
    //   state.isLoadingGender = false;
    //   state.genders = [];
    //   return {
    //     ...state,
    //   };
    default:
      return state;
  }
};

export default adminReducer;

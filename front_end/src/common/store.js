import { createStore } from 'redux';

const reducer = (state, action) => {
  if (!state) return {
    User: {}
  }
  switch (action.type) {
    case 'CHANGE_USER':
      return { ...state, User: action.User }
    default:
      return state
  }
}

export default createStore(reducer);
import { createStore } from 'redux';

const reducer = (state, action) => {
  if (!state) return {
    User: {},
    loading: false,
  }
  switch (action.type) {
    case 'CHANGE_USER':
      return { ...state, User: action.User }
    case 'CHANGE_LOADING':
      return { ...state, loading: action.loading }
    default:
      return state
  }
}

export default createStore(reducer);
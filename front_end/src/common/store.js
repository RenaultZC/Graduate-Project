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

export const mapStateToProps = (state) => {
  return {
    User: state.User,
    loading: state.loading
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    changeUser: (User) => {
      dispatch({type: 'CHANGE_USER', User})
    },
    changeLoading: (loading) => {
      dispatch({type: 'CHANGE_LOADING', loading})
    }
  }
}

export default createStore(reducer);
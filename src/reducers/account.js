import * as types from '../actions/actionTypes';
import store from 'store'
import _ from 'lodash'

export default function account(state = false, action) {
  switch(action.type) {
    case types.ACCOUNT_FOLLOWING_APPEND: {
      const existingFollowers = state.following || []
      const following = action.following
      return Object.assign({}, state, {
        following: _.uniq(existingFollowers.concat(following))
      })
    }
    case types.ACCOUNT_FOLLOWING_REMOVE: {
      const existingFollowers = state.following || []
      return Object.assign({}, state, {
        following: _.uniq(_.pull(existingFollowers, action.account))
      })
    }
    case types.ACCOUNT_SIGNOUT: {}
      return {
        isUser: false,
        name: '',
        key: ''
      }
    case types.ACCOUNT_SIGNIN:
      return Object.assign({}, state, {
        isUser: true,
        name: action.payload.account,
        key: action.payload.key,
      })
    default:
      return state
  }
}

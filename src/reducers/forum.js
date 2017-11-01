import * as types from '../actions/actionTypes';
import * as GLOBAL from '../global';
import _ from 'lodash'

export default function forum(state = {last: null}, action) {
  switch(action.type) {
    case types.FORUM_LOAD_RESOLVED:
      let { forum } = action.payload
      forum = setProgression(forum)
      return Object.assign({}, state, {
          target: forum,
          funding: {
              'history': (action.payload.data && action.payload.data.history) ? action.payload.data.history : [],
              'contributors': (action.payload.data && action.payload.data.contributors) ? action.payload.data.contributors : [],
          }
      })
    case types.FORUM_CONFIG_PROCESSING:
    case types.FORUM_CONFIG_RESOLVED:
    case types.FORUM_CONFIG_RESOLVED_ERROR:
    case types.FORUM_RESERVATION_PROCESSING:
    case types.FORUM_RESERVATION_RESOLVED:
    case types.FORUM_RESERVATION_RESOLVED_ERROR:
      return Object.assign({}, state, {last: action})
    default:
      return state
  }
}

export function setProgression(forum) {
    const { increment, steps } = GLOBAL.PROGRESSION
    const initialCost = 10
    if (!forum) return forum
    let { funded } = forum
    if (!funded) funded = 0
    let current = funded
    let level = 0
    let required = 0
    let previous = 0
    let progress = 0
    let split = 100
    let next = false
    for (var i = 0, len = steps.length; i < len; i++) {
        // Storing progression into current level
        progress = Math.floor((funded - (initialCost + previous)) * 1000) / 1000
        // If the funding is greater than the next level + 10 (initial creation)
        if(funded >= steps[i] + initialCost) {
            level = i
            split += increment
          //   progress = steps[i] + initialCost
        } else {
            next = steps[i] + initialCost
            required = Math.floor((steps[i] - previous) * 1000) / 1000
            break
        }
        previous = steps[i]
    }
    forum['progression'] = {
        current,
        level,
        next,
        progress,
        required,
        split,
    }
    return forum
}

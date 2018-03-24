import * as types from '../constants/ActionTypes'

const channels = (state = [{name: 'general', id: 0}], action) => {
    switch (action.type) {
        case types.CREATE_CHANNEL:
            return state.concat([{ name: action.name, id: (state.length) }])
        case types.CHANNELS_LIST:
            return action.channels
        default:
            return state
    }
}

export default channels
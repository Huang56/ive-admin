import * as TYPES from './mutation-types'

export default {
    [TYPES.ADD_KEEPALIVE](state, payload) {
        if (!state.keepAliveComponents.includes(payload.component)) {
            state.keepAliveComponents.push(payload.component)
        }
    },
}
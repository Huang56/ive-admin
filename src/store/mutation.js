import * as TYPES from './mutation-types'

export default {
    [TYPES.ADD_KEEPALIVE](state, payload) {
        if (!state.keepAliveComponents.includes(payload.component)) {
            state.keepAliveComponents.push(payload.component)
        }
    },
    [TYPES.DEL_KEEPALIVE](state, payload) {
        let index = state.keepAliveComponents.indexOf(payload.component)
        if (index >= 0) {
            state.keepAliveComponents.splice(index, 1)
        }
    },
}
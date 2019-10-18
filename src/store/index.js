import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js';
import mutations from './mutation.js';
import state from './state.js';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
    getters,
    actions,
    mutations,
    state
  })
  
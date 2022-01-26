import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bread: [],
  },
  mutations: {
    breadState(state, payload) {
      state.bread = [];
      state.bread = payload;
    },
  },
  getters: {
    bread(state) {
      return state.bread;
    },
  },
  actions: {},
  modules: {},
});

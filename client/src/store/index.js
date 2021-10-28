import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
      users: [],
      user: {},
      userId: null,
      token: null,
      isAdmin: null
  },
  mutations: {
      setUserId(state, userId) {
          state.userId = userId;
      },

      setToken(state, token) {
          state.token = token;
      },

      setIsAdmin(state, isAdmin) {
          state.isAdmin = isAdmin;
      },

      setUser(state, user) {
        state.user = user;
      },

      setUsers(state, user) {
      state.users.push(user);
      },

      logout(state) {
          state.userId = null;
          state.isAdmin = null;
          state.token = null;
          state.user = {};
      },
  },
  actions: {
    logout({commit}){
          let user= null;
          commit('logout', user)

    },
},
  getters: {
      isLoggedIn(state) {
          return !!state.token;
      },
      isUserAdmin(state) {
          if(state.isAdmin) {
              return true;
          }
      }
  }
})


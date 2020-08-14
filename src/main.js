import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';

Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    selectBookId: 0,
    selectBookName: '',
    unKeepAliveComponent: '',
  },
  mutations: {
    updateSelectBookId(state, selectBookId) {
      state.selectBookId = selectBookId;
    },
    updateSelectBookName(state, selectBookName) {
      state.selectBookName = selectBookName;
    },
    updateUnKeepAliveComponent(state, unKeepAliveComponent) {
      state.unKeepAliveComponent = unKeepAliveComponent;
    },
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

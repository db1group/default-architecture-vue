import Vue from 'vue';
import Vuex from 'vuex';
import modules from '@/services/store-loader/store.loader';

Vue.use(Vuex);

export default new Vuex.Store({ modules });

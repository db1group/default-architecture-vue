import Vue from 'vue';
import Router from 'vue-router';
import routes from '@/services/router-loader/router.loader';

Vue.use(Router);

export default new Router({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

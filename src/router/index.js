import Vue from 'vue';
import VueRouter from 'vue-router';
import Library from '../views/Library.vue';
import Setting from '../views/Setting.vue';
import Practice from '../views/Practice.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/practice',
    name: 'Practice',
    component: Practice,
  },
  {
    path: '/',
    name: 'Library',
    component: Library,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

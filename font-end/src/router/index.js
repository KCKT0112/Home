import Vue from 'vue';
import VueRouter from 'vue-router';
import CLoading from '@/components/CLoading.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => ({
      component: import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/Login',
    name: 'login',
    component: () => ({
      component: import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/Auth/:auth',
    name: 'auth',
    component: () => ({
      component: import(/* webpackChunkName: "login" */ '@/views/Auth.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/Register',
    name: 'register',
    component: () => ({
      component: import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/RePass',
    name: 'repass',
    component: () => ({
      component: import(/* webpackChunkName: "register" */ '@/views/RePass.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/Profile/:id',
    name: 'profile-with-id',
    component: () => ({
      component: import(/* webpackChunkName: "profile" */ '@/views/Profile.vue'),
      loading: CLoading,
      delay: 200,
    })
  },
  {
    path: '/Profile',
    name: 'profile',
    component: () => ({
      component: import(/* webpackChunkName: "profile" */ '@/views/Profile.vue'),
      loading: CLoading,
      delay: 200,
    }),
    meta: {
      role: true
    }
  },
  {
    path: '/Settings',
    name: 'settings',
    component: () => ({
      component: import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
      loading: CLoading,
      delay: 200,
    }),
    meta: {
      role: true
    }
  },
  {
    path: '/Message',
    name: 'message',
    component: () => ({
      component: import(/* webpackChunkName: "settings" */ '@/views/Message.vue'),
      loading: CLoading,
      delay: 200,
    }),
    meta: {
      role: true
    }
  },
  {
    path: '/Message/Content',
    name: 'msgcontent',
    component: () => ({
      component: import(/* webpackChunkName: "settings" */ '@/views/MessageContent.vue'),
      loading: CLoading,
      delay: 200,
    }),
    meta: {
      role: true
    }
  },
  {
    path: '/Admin/Home',
    name: 'admin_home',
    component: () => ({
      component: import(/* webpackChunkName: "settings" */ '@/views/Admin/Home.vue'),
      loading: CLoading,
      delay: 200,
    }),
    meta: {
      role: true,
      admin: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

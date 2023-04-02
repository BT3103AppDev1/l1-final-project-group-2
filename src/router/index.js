import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Landing from '../views/Landing.vue';
import { auth } from '../firebase/firebase.js';
import '../assets/main.css'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/Team.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/leave',
    name: 'Leave',
    component: () => import('../views/Leave.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Landing',
    component: Landing,

  }
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/');
  } else if (currentUser && (to.path === '/login' || to.path === '/register')) {
    next('/home');
  } else if (currentUser && to.path === '/') {
    next('/home'); 
  } else {
    next();
  }

  
})

export default router
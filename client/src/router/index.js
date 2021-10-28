import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import AddArticles from '../views/AddArticles.vue';
import ArticlesList from '../views/ArticlesList.vue';
import ArticleDetails from '../views/ArticleDetails.vue';
import CommentForm from '../views/CommentForm.vue';
import CommentDetails from '../views/CommentDetails.vue';
import DeleteAccount from '../views/DeleteAccount.vue';

Vue.use(VueRouter)

const routes = [
  {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: "Signup",
      component: Signup,
      meta: { guest: true },
    },
    {
      path: '/login',
      name: "Login",
      component: Login,
      meta: { guest: true },
    },
    {
      path: '/delete-account/:id',
      name: "DeleteAccount",
      component: DeleteAccount
    },
    {
      path: '/articles',
      name: ArticlesList,
      component: ArticlesList
    },
    {
      path: '/articles/add',
      name: AddArticles,
      component: AddArticles
    },
    {
        path: '/articles/:id',
        name: 'ArticleDetails',
        component: ArticleDetails
    },
    {
        path: '/articles/:id/comments',
        name: 'CommentForm',
        component: CommentForm
    },
    {
        path: '/articles/:articleId/comments/:commentId',
        name: 'CommentDetails',
        component: CommentDetails
    }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/articles");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from "axios";
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'

import { ValidationProvider, extend } from "vee-validate"
import { required, email } from "vee-validate/dist/rules"
import { ValidationObserver } from "vee-validate"

extend("required", {
  ...required,
  message: "Ce champ est obligatoire"
})
extend("email", {
  ...email,
  message: "Cet email n'est pas valide"
})
extend('minmax', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: "Ce champ a trop ou pas assez de caractères"
})
extend('min', {
  validate(value,  min) {
    return value.length >= min;
  },
  params: ['min'],
  message: "Ce champ n'a pas assez de caratères"
})
extend('password', password => {
  if(/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password)) {
    return true;
  }
    return 'Le mot de passe doit contenir 8 caractères dont 1 caractère spécial, 1 majuscule et 1 chiffre'
})
axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;
      store.dispatch('logout')
      return router.push('/login')
    }
  }
})

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationProvider', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')


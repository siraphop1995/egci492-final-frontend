// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css' 
const fb = require('./config/firebaseConfig.js')

Vue.use(Vuetify)
// axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.baseURL = 'https://egci427-final-vuejs.appspot.com/'
Vue.config.productionTip = false

window.Event = new Vue;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

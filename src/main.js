import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.devtools = true
Vue.config.productionTip = true

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

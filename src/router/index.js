import Vue from 'vue'
import VueRouter from 'vue-router'
// import Container from '../views/Container.vue';
// const Container = () => import("@/views/Container");
// const About = () => import("@/views/Sidebar");
import routes from "./routes";
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active"
})

export default router

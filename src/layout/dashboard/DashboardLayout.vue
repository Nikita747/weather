<template>
  <div class="wrapper">
    <side-bar>
      <fg-input type="text" placeholder="City" v-model="city"></fg-input>

      <template slot="links">
        <sidebar-link
          v-for="_city in getCities"
          :key="_city.id"
          :name="_city.name"
          :to="'/'+_city.name"
          icon="ti-location-pin"
        ></sidebar-link>
      </template>
      <mobile-menu>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      city: "",
      citySettingId: null
    };
  },
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  computed: {
    ...mapGetters(["cities"]),
    getCities() {
      if (!this.city) {
        return this.cities;
      } else {
        return this.cities.filter(
          city => city.name.toLowerCase().indexOf(this.city.toLowerCase()) == 0
        );
      }
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>

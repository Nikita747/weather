<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{path: `/${routeName}`}">{{routeName}}</router-link>
          </li>
        </ul>
      </nav>
      <div class="locate-me d-flex flex-wrap">
        <p-button type="info" round @click.native="handleLocateMe()">Locate Me</p-button>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  methods: {
    handleLocateMe() {
      if (this.$route.path !== '/') this.$router.push('/');
      else this.getLocation();
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError); // navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        this.notifyVue('Geolocation is not supported by this browser.', 'danger')
      }
    },    
    showPosition(position) {
      this.$root.$emit('location', { lat: position.coords.latitude, lon: position.coords.longitude });
    },
    showError(error) {
      this.$root.$emit('locationError', true);
      switch(error.code) {
        case error.PERMISSION_DENIED:
          this.notifyVue("User denied the request for Geolocation.", 'danger')
          break;
        case error.POSITION_UNAVAILABLE:
          this.notifyVue("Location information is unavailable.", 'danger')
          break;
        case error.TIMEOUT:
          this.notifyVue("The request to get user location timed out.", 'danger')
          break;
        case error.UNKNOWN_ERROR:
          this.notifyVue("An unknown error occurred.", 'danger')
          break;
      }
    },
    notifyVue(message, type) {
      this.$notify({
        message: message,
        type: type || 'success'
      });
    }
  },
  computed: {
    routeName() {
      let { name } = this.$route;
      name = this.$store.state.location.city || this.$route.params.id;
      return this.capitalizeFirstLetter(name);
    }
  },
  created() {
    this.$root.$on('currentLocation', () => {
      this.getLocation();
    })
  },
  beforeDestroy() {
    this.$root.$off('currentLocation');
  }
};
</script>
<style>
</style>

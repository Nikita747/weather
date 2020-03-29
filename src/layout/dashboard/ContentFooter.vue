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
    /*
      Locate Me Handler
    */
    handleLocateMe() {
      if (this.$route.path !== '/') this.$router.push('/');
      else this.getLocation();
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    /*
      GeoLocation Initialize method to get user coordinates
    */
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError); // navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        this.notifyVue('Geolocation is not supported by this browser.', 'danger')
      }
    },
    /*
      GeoLocation Success Handler, and emit current coordinates to laod weather data
    */
    showPosition(position) {
      this.$root.$emit('location', { lat: position.coords.latitude, lon: position.coords.longitude });
    },
    /*
      GeoLocation Error Handler
    */
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
    /*
      To show the Notification on top-right corner
    */
    notifyVue(message, type) {
      this.$notify({
        message: message,
        type: type || 'success'
      });
    }
  },
  computed: {
    /*
      Set Active City Name into footer
    */
    routeName() {
      let { name } = this.$route;
      name = this.$store.state.location.city || this.$route.params.id;
      return this.capitalizeFirstLetter(name);
    }
  },
  created() {
    /*
      Event Listner to get Geo Coordinates
    */
    this.$root.$on('currentLocation', () => {
      this.getLocation();
    })
  },
  /*
    Turn Off Event Listner before the component destroyed
  */
  beforeDestroy() {
    this.$root.$off('currentLocation');
  }
};
</script>
<style>
</style>

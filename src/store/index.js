import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let defaultCities = ['Ahmedabad', 'Vadodara', 'Dubai', 'New York'];
let envCities = null;
const cities = [];
if (process.env.VUE_APP_CITIES) {
  envCities = process.env.VUE_APP_CITIES;
  envCities = envCities.split(',');
}
if (envCities && envCities.length > 0) {
  defaultCities = envCities;
}
defaultCities.map((city, inx) => cities.push({id: inx + 1, name: city}));

const no_of_days = process.env.VUE_APP_NO_OF_DAYS || 3;

export default new Vuex.Store({
  state: {
    cities: cities,
    days: no_of_days,
    location: {
      lat: null,
      lon: null,
      city: ''
    }
  },
  mutations: {
    SET_CITIES: (state, cities) => {
      state.cities = cities;
    },
    SET_LOCATION: (state, location) => {
      state.location = location;
    }
  },
  actions: {
    setLocation: (context, data) => {
      context.commit('SET_LOCATION', data)
    }
  },
  modules: {
  },
  getters: {
    cities: state => state.cities,
    no_of_days: state => state.days,
    location: state => state.location
  }
})

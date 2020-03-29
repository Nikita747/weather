<template>
  <div>
    
    <div class="row" v-if="!$route.params.id && $route.name == 'dashboard' && weatherData.length == 0">
      <div class="col-md-12 col-xl-12">
        <h3>Weather Dashboard</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-xl-4" v-for="(stats, inx) in weatherData" :key="inx" v-show="(inx < no_of_days) || loadMoreClicked">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-warning`" slot="header">
            <img :src="`http://openweathermap.org/img/wn/${stats.weather[0].icon}@2x.png`" />
            <div class="desc" style="font-size: 0.5em;margin: 0 -15px;">
              {{stats.weather[0].description}}
            </div>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.dt | formatDate}}</p>
            <div class="temparature">
              <b>{{stats.main.temp | roundUpTemp}}°C</b>
            </div>
            <div class="card-category">
              <label>min:</label>&nbsp;&nbsp;{{stats.main.temp_min | roundUpTemp}}°C
            </div>
            <div class="card-category">
              <label>max:</label>&nbsp;&nbsp;{{stats.main.temp_max | roundUpTemp}}°C
            </div>
          </div>
          <div class="stats" slot="footer">
            <span class="float-left">
              <img class="border-white" src="@/assets/img/icon-wind.png" alt="..."> {{stats.wind.speed}}m/s
            </span>
            <span class="float-right">
              <img class="border-white" src="@/assets/img/icon-compass.png" alt="..."> {{stats.wind.deg | degToCompass}}
            </span>
          </div>
        </stats-card>
      </div>
    </div>
    <div class="row" v-if="!loadMoreClicked && no_of_days < weatherData.length">
      <div class="col-md-12 col-xl-12">
        <div class="icon-big text-center">
          <a href="javascript:void(0)" :class="`icon-warning`" @click="loadMoreClicked = true">Load More</a>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { StatsCard } from "@/components/index";
import axios from 'axios';
import moment from 'moment';
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    StatsCard,
  },
  data() {
    return {
      weather_api: 'http://api.openweathermap.org/data/2.5',
      weatherData: [],
      weather_appid: process.env.VUE_APP_WEATHER_APPID || null,
      loadMoreClicked: false
    };
  },
  computed: {
    ...mapGetters(["no_of_days"]),
  },
  filters: {
    formatDate: (date) => {
      return moment(date * 1000).format('DD MMM')
    },
    degToCompass(num) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      return arr[(val % 16)];
    },
    roundUpTemp (temp) {
      return Math.round(temp)
    }
  },
  created () {
    if (this.$route.params.id) {
      this.init(this.$route.params.id)
    } else if (this.$route.name == 'dashboard') {
      this.$nextTick(() => {
        this.$root.$emit('currentLocation', true);
      })
    }
    /*
      Event Listner for Geolocation, load data according to location coordinates.
    */
    this.$root.$on('location', (location) => {
      this.loadMoreClicked = false;
      const { lat, lon } = location;
      this.weatherData = [];
      axios.all([
        this.fetchDataByGeoLocation(lat, lon),
        this.fetchCurrentWeather(`lat=${lat}&lon=${lon}`)
      ]).then(axios.spread((allData, todayData) => {
        this.setWeatherData(allData, todayData)
      }))
    });
    /*
      Event Listner for Geolocation Error
    */
    this.$root.$on('locationError', () => {
      this.weatherData = [];
    })
  },
  methods: {
    /*
      Set current location coordinates into global store
    */
    ...mapActions([
      "setLocation",
    ]),
    /*
      Initialize function
    */
    init(id) {
      this.weatherData = [];
      axios.all([
        this.fetchDataByCityName(id), 
        this.fetchCurrentWeather(`q=${id}`)
      ]).then(axios.spread((allData, todayData) => {
        this.setWeatherData(allData, todayData)
      }))
    },
    /*
      convert full date into date and time
    */
    dateSplit(date) {
      let _date = date.split(' ');
      return { date: _date[0], time: _date[1] } 
    },
    setWeatherData (allData, todayData) {
      let { list } = allData;
      const { dt } = todayData;
      let today =  moment((dt*1000)).local().format('YYYY-MM-DD HH:mm:ss');
      todayData.dt_txt = moment((dt*1000)).format('YYYY-MM-DD HH:mm:ss');

      let { date, time } = this.dateSplit(today)
      todayData.date = date;
      todayData.time = time;

      this.weatherData.push(todayData);

      list.forEach((record) => {
        let localDate = moment((record.dt*1000)).local().format('YYYY-MM-DD HH:mm:ss');
        let { date, time } = this.dateSplit(localDate);
        record.date = date;
        record.time = time;
      });

      list = list.filter((record) => ((new Date(record.date)) > (new Date(date))));
      
      const groupByDate = this.groupBy(list, (c) => c.date);
      
      for (let _date in groupByDate) {
        groupByDate[_date] = groupByDate[_date].filter((ele) => {
          let startTime = moment(ele.time, 'HH:mm:ss');
          let endTime = moment(time, 'HH:mm:ss');
          return (startTime.isAfter(endTime))
        });

        if (groupByDate[_date][0]) {
          this.weatherData.push(groupByDate[_date][0])
        }
      }
    },
    /*
      fetch weather data using city name
    */
    fetchDataByCityName (name) {
      return axios.get(`${this.weather_api}/forecast?q=${name}&appid=${this.weather_appid}&units=metric`)
        .then((res) => {
          this.setLocation({lat: null, lon: null, city: ''})
          return res.data
        })
        .catch((err) => {
          console.error("========error", err)
          this.weatherData = [];
          this.notify({ message: `Something's goes wrong!!`, type: 'danger'})
        })
    },
    /*
      fetch weather data using Geo coordinates
    */
    fetchDataByGeoLocation (lat, lon) {
      return axios.get(`${this.weather_api}/forecast?lat=${lat}&lon=${lon}&appid=${this.weather_appid}&units=metric`)
        .then((res) => {
          const { city } = res.data;
          this.setLocation({lat, lon, city: city.name})
          return res.data
        })
        .catch((err) => {
          console.error("=======error", err);
          this.weatherData = [];
          this.notify({ message: `Something's goes wrong!!`, type: 'danger'})
        });
    },
    /*
      fetch today's accurate weather data
    */
    fetchCurrentWeather (query) {
      return axios.get(`${this.weather_api}/weather?${query}&appid=${this.weather_appid}&units=metric`)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.error("=======error", err);
      })
    },
    /*
      Input: Array
      Output: Object
      Group data according to one propery
    */
    groupBy(xs, f) {
      return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
  },
  watch: {
    /*
      Watch url changes, load weather data according to changes
    */
    '$route.params.id': function (id) {
      this.loadMoreClicked = false;
      if (id) {
        this.init(id)
      } else if (this.$route.name == 'dashboard') {
        setTimeout(() => {
          this.$root.$emit('currentLocation', true);
        })
      } else {
        this.weatherData = []
      }
    }
  },
  beforeDestroy() {
    /*
      Turn off the Event Listners.
    */
    this.$root.$off('location');
    this.$root.$off('locationError');
  }
};
</script>
<style>
</style>

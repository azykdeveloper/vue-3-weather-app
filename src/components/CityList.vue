<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="savedCities.length === 0">
    No location added. To start tracing a location, search in the field above. 
  </p>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import CityCard from "./CityCard.vue";
import { useRouter } from "vue-router";
const router = useRouter()
const savedCities = ref([]);
const API_KEY = "a41e0930b154b51179090a1f2952310e";

async function getCities() {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }

  const requests = [];

  savedCities.value.forEach((city) => {
    requests.push(
      axios.get(

      `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${API_KEY}&units=metric`
      )
    );
  });

  const weatherData = await Promise.all(requests);

  weatherData.forEach((val, i) => {
    savedCities.value[i].weather = val.data;
  });
}
await getCities();

function goToCityView(city) {
  router.push({
    name: "city",
    params: {state: city.state, city: city.city},
    query: {id: city.id, lat: city.coords.lat, lon: city.coords.lon}
  })
}
</script>

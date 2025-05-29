<template>
  <header class="sticky top-0 bg-weather-primary shadow-xl">
    <nav
      class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun text-xl"></i>
          <p class="text-xl">The Local Weather</p>
        </div>
      </RouterLink>

      <div class="flex gap-3 flex-1 justify-end">
        <i
          @click="modalObj.modalToggle"
          class="fa-solid fa-circle-info hover:text-weather-secondary duration-200 cursor-pointer"
        ></i>
        <i
          v-if="route.query.preview"
          @click="addCity"
          class="fa-solid fa-plus hover:text-weather-secondary duration-200 cursor-pointer"
        ></i>
      </div>

      <BaseModal :modalObj="modalObj" />
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import BaseModal from "./BaseModal.vue";
import { uid } from "uid";
import router from "@/router";
const route = useRoute();

const modalObj = ref({
  isOpen: false,
  modalToggle() {
    this.isOpen = !this.isOpen;
  },
});
const savedCities = ref([]);

function addCity() {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lon: route.query.lon,
    },
  };

  savedCities.value.push(locationObj);
  localStorage.setItem("savedCities", JSON.stringify(savedCities.value));
  let query = Object.assign({}, route.query);
  delete query.preview;
  query.id = locationObj.id
  router.replace({ query });
}
</script>

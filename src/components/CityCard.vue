<template>
  <div class="flex p-3 bg-weather-secondary rounded-md shadow-md cursor-pointer">
    <div class="flex flex-col flex-1">
      <h2 class="text-xl">{{ city.city }}</h2>
      <h3 class="text-sm text-gray-300 font-light">{{ city.state }}</h3>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-3xl">{{ Math.round(city.weather.main.temp) }}&deg;</p>
      <div class="flex gap-2 ">
        <p>{{ Math.round(city.weather.main.temp_max) }}&deg;</p>
        /
        <p>{{ Math.round(city.weather.main.temp_min) }}&deg;</p>
        
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>

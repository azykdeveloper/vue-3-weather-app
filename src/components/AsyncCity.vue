<template>
  <div class="flex flex-col flex-auto items-center">
    <!-- Banner -->
    <div v-if="preview" class="text-white bg-weather-secondary p-4 w-full text-center">
      <p>
        You are currently previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class=" mb-8">
        <span class="text-8xl">
          {{ Math.round(weatherData.current.temp) }}&deg;
        </span>

      <p class="flex items-center justify-center text-md text-center text-gray-300">
        <img src="@/assets/img/location-arrow-up.svg" alt="arrow" width="18px" class="mr-2"
          :style="{ transform: `rotate(${weatherData.current.wind_deg + 180}deg)` }" />
        <span>{{ Math.round(weatherData.current.wind_speed * 3.6) }} km/s</span>
      </p>
      </p>

      <p class="text-gray-300">
        Feels like
        {{ Math.round(weatherData.current.feels_like) }} &deg;
      </p>
      <p class="capitalize text-gray-300">
        {{ weatherData.current.weather[0].description }}
      </p>
      <img class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" alt="icon" />
    </div>

    <hr class="border-white/10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-gray-300">
        <h2 class="mb-4 text-xl text-white font-bold">Hourly Weather</h2>
        <div ref="scrollArea" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"
          @mouseleave="onMouseLeave" id="scroll" class="flex gap-10 overflow-x-scroll" :class="state.isDown ? 'cursor-grabbing' : 'cursor-grab'">
          <div v-for="hourData in weatherData.hourly" :key="hourData.dt"
            class="flex flex-col gap-4 items-center select-none">
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <div>
              <img class="w-auto h-[50px] object-cover"
                :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="icon" />
            </div>

            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white/10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-gray-300">
        <h2 class="mb-4 font-bold text-xl text-white">7 Day Forecast</h2>
        <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img class="w-[50px] h-[50px] object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="icon" />
          <p class="flex text-xs">
            <img src="@/assets/img/location-arrow-up.svg" alt="arrow" width="12px" class="mr-1"
              :style="{ transform: `rotate(${day.wind_deg + 180}deg)` }" />
            <span>{{ Math.round(day.wind_speed * 3.6) }}km/s</span>
          </p>
          <div class="flex gap-2 flex-1 justify-end">
            <p>{{ Math.round(day.temp.max) }}&deg;</p>
            /
            <p>{{ Math.round(day.temp.min) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2 my-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { id, lat, lon, preview } = route.query;
const API_KEY = "a41e0930b154b51179090a1f2952310e";

async function getWeatherData() {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime =
      utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    return weatherData.data;
  } catch (error) {
    console.log("error: ", error);
  }
}
const weatherData = await getWeatherData();

function removeCity() {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city) => city.id !== id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({ name: "home" });
}

// Drag to scroll
const scrollArea = ref(null);
const state = reactive({
  isDown: false,
  startX: 0,
  scrollLeft: 0
});

function onMouseDown(e) {
  state.isDown = true;
  state.startX = e.pageX - scrollArea.value.offsetLeft;
  state.scrollLeft = scrollArea.value.scrollLeft;
  scrollArea.value.classList.add('active');
}

function onMouseMove(e) {
  if (!state.isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollArea.value.offsetLeft;
  const walk = (x - state.startX) * 1.5;
  scrollArea.value.scrollLeft = state.scrollLeft - walk;
}

function onMouseUp() {
  state.isDown = false;
  scrollArea.value.classList.remove('active');
}

function onMouseLeave() {
  state.isDown = false;
  scrollArea.value.classList.remove('active');
}
</script>

<style scoped>
#scroll::-webkit-scrollbar {
  display: none;
}


</style>
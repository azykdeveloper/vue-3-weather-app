<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        v-model="searchText"
        type="text"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004e71]"
        @input="getData"
      />

      <p v-if="error">Sorry, something went wrong, please try again</p>

      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="results"
      >
        <p v-if="results.length === 0">
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="result in results"
            :key="result.id"
            class="py-2 cursor-pointer"
            @click="previewCity(result)"
          >
            {{ result.properties.full_address }}
          </li>
        </template>
      </ul>
    </div>

    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>

        <template #fallback>
          <CityCardSkeleton/>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import CityCardSkeleton from "@/components/CityCardSkeleton.vue";
import CityList from "@/components/CityList.vue";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchText = ref("");
const timer = ref(null);
const results = ref(null);
const error = ref(null);
const access_token =
  "pk.eyJ1IjoiYXp5a3h5eiIsImEiOiJjbWF3Zmx2M2IwYXIxMmpzZDJyejFlanYzIn0.BWAxe2ty_5imfyHU_dChFw";

function getData() {
  clearTimeout(timer.value);

  timer.value = setTimeout(async () => {
    if (searchText.value) {
      const api = `https://api.mapbox.com/search/geocode/v6/forward?q=${searchText.value}&access_token=${access_token}&types=place`;
      try {
        const res = await axios.get(api);
        results.value = res.data.features;
      } catch {
        error.value = true;
      }
      return;
    }

    results.value = null;
  }, 300);
}

function previewCity(result) {
  const [city, state] = result.properties.full_address.split(",");

  router.push({
    name: "city",
    params: { state: state.replaceAll(" ", ""), city },
    query: {
      lat: result.properties.coordinates.latitude,
      lon: result.properties.coordinates.longitude,
      preview: true,
    },
  });
}
</script>

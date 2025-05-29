<template>
  <div
    id="app"
    class="bg-weather-primary min-h-screen flex flex-col font-roboto"
  >
    <SiteNavigation />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in" >
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
</script>

<style>
.page-enter-active {
  transition: 600ms ease all;
}
.page-enter-from {
  opacity: 0;
}
</style>

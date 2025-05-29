<template>
  <Teleport to="body">
    <Transition name="modal-outer">
      <div
        v-show="modalObj.isOpen"
        @click.self="modalObj.modalToggle"
        class="bg-black/40 absolute w-full h-screen top-0 left-0 flex justify-center px-8"
      >
      <Transition name="modal-inner">
        <div
          v-if="modalObj.isOpen"
          class="p-4 bg-white self-start mt-32 max-w-screen-md"
        >
            <div class="text-black">
              <h1 class="text-2xl mb-1">About:</h1>
              <p class="mb-4">
                The Local Weather allows you to track the current and future
                weather of cities of your choosing.
              </p>
              <h2 class="text-2xl">How it works:</h2>
              <ol class="list-decimal list-inside mb-4">
                <li>
                  Search for your city by entering the name into the search bar.
                </li>
                <li>
                  Select a city within the results, this will take you to the
                  current weather for your selection.
                </li>
                <li>
                  Track the city by clicking on the "+" icon in the top right.
                  This will save the city to view at a later time on the home
                  page.
                </li>
              </ol>
              <h2 class="text-2xl">Removing a city</h2>
              <p>
                If you no longer wish to track a city, simply select the city
                within the home page. At the bottom of the page, there will be am
                option to delete the city.
              </p>
            </div>
            <button
            @click="modalObj.modalToggle"
            class="text-white bg-weather-primary mt-8 py-2 px-6"
            >
            Close
          </button>
        </div>
      </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modalObj: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.modal-inner-leave-to {
  transform: scale(0.5);
}
</style>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const isOpen = ref(false);
const { title, items } = defineProps(["title", "items"]);
const emits = defineEmits();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleItemClick = (item) => {
  // Emit a custom event with the clicked item data
  emits("item-click", item);
  // You can also perform additional actions specific to the dropdown component here
  console.log(`Clicked on item: ${item.title}`);
};
</script>

<template>
  <div class="menu-item mr-2" @click="toggleMenu">
    <div
      class="ml-2 w-full items-center justify-center text-lg text-white mt-1 cursor-pointer "
    >
      {{ title }}<span class="ml-2 fa fa-caret-down"></span>
    </div>
    <!-- <svg viewBox="0 0 1030 638" width="10" class="">
      <path
        d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z"
        fill="#FFF"
      ></path>
    </svg> -->
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="menu-item  bg-white w-full p-2"
        >
          <div @click="() => handleItemClick(item)" class="cursor-pointer  hover:text-blue-700 ">
            {{ item.title }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.menu-item svg {
  width: 10px;
  margin-left: 06px;
  margin-top: 7px;
}

.menu-item .sub-menu {
  position: absolute;
  top: calc(100% + 18px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  /* border-radius: 0px 0px 16px 16px; */
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

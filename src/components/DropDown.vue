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
  // console.log(`Clicked on item: ${item.title}`);
};
</script>

<template>
  <div class="menu-item " @click="toggleMenu">
    <div
      class=" w-full items-center justify-center h-8 text-[12px] text-white  cursor-pointer flex"
    >
      {{ title }}<span class="ml-1 fa fa-caret-down"></span>
    </div>
  
    <transition name="fade" appear>
      <div class="sub-menu  " v-if="isOpen">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="menu-item  bg-white w-full pb-[4x] "
        >
          <div @click="() => handleItemClick(item)" class="cursor-pointer mx-1 rounded text-[12px] text-[#10C0CB] hover:text-black mt-1">
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
  margin-left: 6px;
  margin-top: 7px;
}

.menu-item .sub-menu {
  position: absolute;
  top: calc(100% + 4px);
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

<script setup>
import { ref, defineEmits } from "vue";
import { RouterLink } from "vue-router";
import { Colors } from "../utils/color";
import Button from "../components/Button.vue";
import DropDown from "./DropDown.vue";

const props = defineProps([
  "headerTitle",
  "backButtonText",
  "backRoute",
  "saveButtonText",
  "saveDraftButtonText",
  "onSaveButtonClick",
  "saveDraftButtonColor",
  "onSaveDraftButtonClick",
  "showDropdown",
  "onDropdownItemClick",
  "dropdownTitle",
  "dropdownItems",
  "showBackButton",
  "showDraftButton",
]);
const onBackButtonClick = () => {
  // Go back in the browser history
  window.history.back();
};
const handleDropdownItemClick = (clickedItem) => {
  if (props.onDropdownItemClick) {
    props.onDropdownItemClick(clickedItem);
  }
  dropdownOpen.value = false;
};
const emit = defineEmits(["click"]);

const dropdownOpen = ref(false);

const computedStyles = {
  fontSize: "10px",
  lineHeight:"1.25rem",
  fontWeight: "500"
};

</script>

<template>
  <nav class=" p-4 flex justify-between items-center shadow-md">
    <div class="flex items-center">
      <div v-if="!showBackButton">
      <!-- <RouterLink :to="{ name: backRoute }"> -->
        <Button 
          :bgColor="Colors.orange"
          :textColor="Colors.white"
          :fontSize="computedStyles.fontSize"
          :lineHeight= "computedStyles.lineHeight"
          :fontWeight="computedStyles.fontWeight"
          :buttonText="backButtonText"
          @click="onBackButtonClick"
        />
      <!-- </RouterLink> -->
    </div>
      <p class="font-bold ml-6 text-black text-[24px]">{{ headerTitle }}</p>
    </div>
    <div class="inline-flex items-center justify-center" >
     <div v-if="!showDraftButton" class="mr-4">
      <Button
      :bgColor="Colors.orange"
        :textColor="Colors.white"
        :fontSize="computedStyles.fontSize"
        :lineHeight= "computedStyles.lineHeight"
          :fontWeight="computedStyles.fontWeight"
        :buttonText="saveDraftButtonText"
        @click="onSaveDraftButtonClick"
        :style="{ backgroundColor: saveDraftButtonColor }"
      />
    </div>
      <div
        class="bg-[#10C0CB] text-[12px] w-24 rounded mr-4"
        v-if="showDropdown"
      >
        <DropDown
          :title="dropdownTitle"
          :items="dropdownItems"
          @item-click="handleDropdownItemClick"
        />
      </div>
    </div>
  </nav>
</template>

<style>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
}

nav .menu-item {
  color: #000000;

  /* padding: 10px 20px; */
  position: relative;
  text-align: center;
  border-bottom: 3px solid transparent;
  display: flex;

  /* background-color:#ff6633; */
}

nav .menu-item a {
  color: rgb(1, 1, 1);
  text-decoration: none;
}
</style>

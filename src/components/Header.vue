<script setup>
import { ref } from "vue";
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
  "isLoader", // Add isLoader as a prop
]);

const onBackButtonClick = () => {
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
  lineHeight: "1.25rem",
  fontWeight: "500",
};
</script>

<template>
  <nav class="p-4 flex justify-between items-center shadow-md">
    <div class="flex items-center">
      <div v-if="!showBackButton ">
        <!-- Check isLoader to hide the back button when loading -->
        <Button
          :bgColor="Colors.orange"
          :textColor="Colors.white"
          :fontSize="computedStyles.fontSize"
          :lineHeight="computedStyles.lineHeight"
          :fontWeight="computedStyles.fontWeight"
          :buttonText="backButtonText"
          @click="onBackButtonClick"
        />
       
      </div>
      <p class="font-bold ml-6 text-black text-[24px]">{{ headerTitle }}</p>
    </div>
    <div class="inline-flex items-center justify-center">
      <div v-if="!showDraftButton " class="mr-4">
        <!-- Check isLoader to hide the draft button when loading -->
        <Button
        v-if="!isLoader"
          :bgColor="saveDraftButtonColor"
          :textColor="Colors.white"
          :fontSize="computedStyles.fontSize"
          :lineHeight="computedStyles.lineHeight"
          :fontWeight="computedStyles.fontWeight"
          :buttonText="saveDraftButtonText"
          @click="onSaveDraftButtonClick"
          :style="{ backgroundColor: saveDraftButtonColor }"
        />
        <a-spin v-else size="medium" class="mx-2" /> 

      </div>
      <div
        class="bg-[#10C0CB] text-[12px] w-28 rounded mr-4"
        v-if="showDropdown && !isLoader"
      >
        <!-- Check isLoader to hide the dropdown when loading -->
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
  position: relative;
  text-align: center;
  border-bottom: 3px solid transparent;
  display: flex;
}

nav .menu-item a {
  color: rgb(1, 1, 1);
  text-decoration: none;
}
</style>

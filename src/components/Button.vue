<script setup>
  
const props = defineProps(["bgColor", "textColor", "fontSize", "buttonText"]);
const emit = defineEmits('click');

const handleClick = () => {
 
};

const computedClasses = {
  rounded: true,
  "border-none": true,
  "font-medium": true,
  "py-2": true,
  "px-4": true,
  
};

const computedStyles = {
  fontSize: props.fontSize,
};
</script>

<template>
  <button
  class="text-lg "
    :class="computedClasses"
    :style="{ backgroundColor: props.bgColor, color: props.textColor, fontSize: computedStyles.fontSize }"
    @click="handleClick"
  >
    <span >{{ props.buttonText }}</span>
  </button>
</template>

<style scoped>
</style>

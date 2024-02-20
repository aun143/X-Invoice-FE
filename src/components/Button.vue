<script setup>
  
  const props = defineProps(["bgColor", "textColor", "fontSize", "buttonText", "lineHeight", "fontWeight"]);
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
  lineHeight: props.lineHeight,
  fontWeight: props.fontWeight,
  
};
</script>

<template>
  <button
  class="text-black"
    :class="computedClasses"
    :style="{ backgroundColor: props.bgColor, color: props.textColor, fontSize: computedStyles.fontSize }"
    @click="handleClick"
  >
  <span
  class="text-[12px]"
      :style="{ lineHeight: computedStyles.lineHeight, fontWeight: computedStyles.fontWeight }"
    >{{ props.buttonText }}</span>
  </button>
</template>

<style scoped>
</style>

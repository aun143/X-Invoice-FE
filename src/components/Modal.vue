
<script setup>
import {  defineProps, defineEmits } from "vue";

const { modalActive } = defineProps(["modalActive"]);
const emit = defineEmits();

const close = () => {
  emit("close");
};
</script>
<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="modalActive" class="modal-inner text-right ">
          <i
            @click="close"
            class=" cursor-pointer text-sm bg-[#4AA7AD] text-white far fa-eye-slash p-4"
          ></i>
          <slot />
        </div>
      </transition>
      <a class="ml-16" @click="close()" >Cancel</a>
    </div>
  </transition>
</template>

<style>
  .close-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: crimson;
    }
  }

  .modal-animation-enter-active,
  .modal-animation-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }

  .modal-animation-enter-from,
  .modal-animation-leave-to {
    opacity: 0;
  }

  .modal-animation-inner-enter-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
  }

  .modal-animation-inner-leave-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }

  .modal-animation-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
  }

  .modal-animation-inner-leave-to {
    transform: scale(0.8);
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100vw;
    position: fixed;
   
    top: 0;
    left: 0;
    background-color: rgba(234, 227, 227, 0.7);
    overflow: hidden;

    .modal-inner {
      position: relative;
      max-width: 640px;
      width: 80%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background-color: #fff;
      margin: 64px auto;
      padding: 16px;
      overflow-y: auto; /* Add vertical scrolling to the modal-inner */
      height: 100%;
      
    }
  }    button {
        padding: 20px 30px;
        border: none;
        font-size: 16px;
        background-color: crimson;
        color: #292727;
        cursor: pointer;
      }
   
</style>
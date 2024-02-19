<script setup>
import { ref, computed } from "vue";

import { useInvoiceStore } from "../stores/index";

import { useInvoiceService } from "../service/MainService";

const isLoading = ref(false);
const handleSaveDraftButtonClick = async () => {
  window.confirm("Post Data");
  try {
    isLoading.value = true;
    const response = await invoiceService.postInvoiceData(invoice.formData);
    console.log("Invoice submitted successfully:", response);
    alert("Data Submitted");

    // Handle successful submission (e.g., clear form data, display success message)

    // router.push({ name: 'Index' });
  } catch (error) {
    console.error("Error submitting invoice:", error);
    // Handle error (e.g., display error message)
  } finally {
    isLoading.value = false;
  }
};

const invoiceService = useInvoiceService();
const invoice = useInvoiceStore();

const logoInputRef = ref(null);
const logoPreview = ref(null);
const handleFileInputChange = () => {
  displayImage(logoInputRef.value);
  // console.log("3rd")
};

const displayImage = (input) => {
  const file = input.files[0];
  // console.log("2nd")
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      logoPreview.value.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};
</script>
<template>
  <div class="flex flex-col w-1/2 items-end">
    <label for="logoInput" class="">
      <div
        class="logo-placeholder border-none hover:border-dashed cursor-pointer rounded w-48 h-24 border-2 grid place-items-center text-slate-500 text-6xl"
      >
        <img
          src="../assets/vue.svg"
          ref="logoPreview"
          class="logo rounded"
          alt="Logo"
        />
      </div>
      <input
        id="logoInput"
        type="file"
        accept="image/*"
        class=""
        style="display: none"
        @change="handleFileInputChange"
        ref="logoInputRef"
      />
    </label>
  </div>
</template>

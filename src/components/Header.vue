<script setup>
        import { ref,onMounted } from "vue";
        import { Colors } from "../utils/color";
        import Button from "../components/Button.vue";
import {  useRouter } from "vue-router";
import { notification } from "ant-design-vue";

import { getUserDetailsApi } from "../service/LoginService";

import { useInvoiceStore } from "../stores/index";
const invoice = useInvoiceStore();
const router = useRouter();
const isLoading = ref(false);

        const UserRole=async()=>{
  try {
    isLoading.value = true;

    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const userProfileData = await getUserDetailsApi(UserId);
      invoice.userProfileData.userRole = userProfileData.userRole;
    } else {
      router.push("/login");
    }
    // showPopup();
  } catch (error) {
    openNotificationWithIcon("error", error || "Error During Getting Account User Role");
    console.error("Error During getting Getting User Role:", error);
  } finally {
    isLoading.value = false;
  }
}
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3,
  });
};
onMounted(async () => {
  UserRole();
});
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
          "showUpgradeButton",
          "isLoader", 
        ]);
        
const upgradeAccount = () => {
  router.push("/subscription");
};
        const onBackButtonClick = () => {
          window.history.back();
        };
        
        const handleDropdownClick = (e) => {
          // Handle dropdown click event
        };
        
        const handleMenuItemClick = (item) => {
          if (props.onDropdownItemClick) {
            props.onDropdownItemClick(item);
          }
        };
        
        const computedStyles = {
          fontSize: "10px",
          lineHeight: "1.25rem",
          fontWeight: "500",
        };
        </script>
<template>
  <nav class="p-4 flex justify-between items-center shadow-md " >
    <div class="flex items-center justify-center">
      <div v-if="!showBackButton">
        <!-- Check isLoader to hide the back button when loading -->
        <Button
          :bgColor="Colors.secondry"
          :textColor="Colors.white"
          :fontSize="computedStyles.fontSize"
          :lineHeight="computedStyles.lineHeight"
          :fontWeight="computedStyles.fontWeight"
          :buttonText="backButtonText"
          @click="onBackButtonClick"
        />
      </div>
      <p class="font-bold ml-6 text-black lg:text-[24px] md:text-[18px]">{{ headerTitle }}</p>
    </div>
    <div class="inline-flex items-center justify-center">
      <div v-if="!showUpgradeButton ">
        <div v-if="invoice.userProfileData.userRole !== 'iSuperAdmin'">
  <a-button 
    type="primary"
    @click="upgradeAccount"
    class="items-center bg-green-500 mr-2 h-9 justify-center rounded cursor-pointer tran shadow-lg"
  >
    <span class="mx-4">Upgrade</span>
  </a-button></div>
      </div>
      <div v-if="!showDraftButton" class="mr-4">
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
      
      <a-dropdown v-if="showDropdown && !isLoader" @click="handleDropdownClick" class="hover w-28 h-9 bg-[#1717ff] text-white mr-4">
        <template #overlay>
          <a-menu >
            <a-menu-item v-for="item in dropdownItems" :key="item.key" @click="handleMenuItemClick(item)">
             {{ item.title }}
            </a-menu-item>
          </a-menu>
        </template>
        <a-button>
          {{ dropdownTitle }}
          <i class="fa-regular fas ml-2 fa-caret-down"></i>
        </a-button>
      </a-dropdown>
    </div>
  </nav>
</template>


<style>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav .button:hover, .nav .dropdown:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}
.nav .button, .nav .dropdown {
  transition: box-shadow 0.3s ease;
}
.hover:hover {
  background-color: #3700ffbb !important;
color: white !important;
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
.sticky-header {
  position: fixed;
  top: 0;
  left: 250px; 
  right: 0;
  background-color: white;
  z-index: 1000;
}

</style>

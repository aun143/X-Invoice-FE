<script setup>
import Swal from 'sweetalert2';
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const menuItems = [
  { link: "/Index", name: "Invoices",  },
  { link: "/clients", name: "Clients" },
  { link: "/businessProfile", name: "Business" },
 
];
const router = useRouter();

// const handleExitButtonClick = () => {
//   const userConfirmed = window.confirm("Are you sure you want to Logout?");
//   if (userConfirmed) {
//     localStorage.removeItem("accessToken");
//     router.push({ name: "Login" });
//   }
// };
const handleExitButtonClick = async () => {
  const result = await Swal.fire({
    title: 'Logout Confirmation',
    text: 'Are you sure you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, log me out!',
  });

  if (result.isConfirmed) {

    localStorage.removeItem('accessToken');
    router.push({ name: 'Login' });
  } else {
  }
};
const enableExitButton = true;
const disableSearch = false;
const componentsWithSidebar = [
  "Index",
  "Client",
  "Clients",
  "Main",
  "BusinessProfile",
  "ViewInvoice",
  "GetInvoice",
  "EditInvoice",
  "EditClient",
  "SendInvoice",
  "UploadImg",
];

const route = useRoute();
const enableSidebar = computed(() => {
  return componentsWithSidebar.includes(route.name);
});
</script>

<template>
  <div>
    <div>
      <div class="" style="">
        <VueSidebarMenuAkahon
          v-if="enableSidebar"
          menuTitle="X-Invoice"
          menuLogo="../src/assets/3x.webp"
          profileImg="../src/assets/3x.webp"
          bgColor="#4AA7AD"
          profileRole="Developed By  X-Invoicely "
          profileName="Invoicely"
          :menuItems="menuItems"
          :isSearch="disableSearch"
          :isExitButton="enableExitButton"
          @button-exit-clicked="handleExitButtonClick"
          :isUsedVueRouter="true"
        />
      </div>
    </div>
    <RouterView v-if="enableSidebar" class="max-w-full" />
    <RouterView v-else />
  </div>
</template>

<style  >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} </style>

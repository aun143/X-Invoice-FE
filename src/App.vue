<script setup>
import Swal from 'sweetalert2';
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { Colors } from "./utils/color";
const menuItems = [
  { link: "/dashBoard", name: "DashBoard", icon: "bxs-user-account"},
  { link: "/Index", name: "Invoices",  icon: "bxs-inbox" },
  { link: "/AllClients", name: "All Clients",  icon: "bxs-user-detail" },
  { link: "/businessProfile", name: "Business", icon: "bxs-user-account"},
];

const router = useRouter();

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
    localStorage.removeItem('UserId');
    localStorage.removeItem('userRole');
    router.push({ name: 'Login' });

    
  }
};

const enableExitButton = true;
const disableSearch = false;
const componentsWithSidebar = [
  "Index",
  "Client",
  "AllClients",
  "Invoice",
  "BusinessProfile",
  "ViewClient",
  "GetInvoice",
  "EditInvoice",
  "EditClient",
  "SendInvoice",
  "Subscription",
  "DashBoard",

];

const route = useRoute();
const enableSidebar = computed(() => {
  return componentsWithSidebar.includes(route.name);
});

const menuLogo = "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png"; 
const profileImg = "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";

const upgradeAccount = () => {
  router.push('/subscription');
};

</script>


<template>
  <div class="overflow-hidden">
    <div class="">

      <VueSidebarMenuAkahon
        v-if="enableSidebar"
        menuTitle="X-Invoice"
        :menuLogo="menuLogo"
        :profileImg="profileImg"
        bgColor="#4AA7AD"
        profileRole="Developed By AccellionX"
        profileName="X-Invoice"
        :menuItems="menuItems"
        :isSearch="disableSearch"
        :isExitButton="enableExitButton"
        @button-exit-clicked="handleExitButtonClick"
        :isUsedVueRouter="true"
      >
      </VueSidebarMenuAkahon>
    </div>

    <RouterView v-if="enableSidebar" class="max-w-full pb-6 pl-[250px] lg:pl-[250px] md:pl-[195px]" />
    <RouterView v-else /> 
    <div class="fixed bottom-[28px] right-[28px] z-[999]">
      <button @click="upgradeAccount" class=" mb-[8px] flex items-center justify-center  h-[40px] rounded bg-[#4AA7AD] text-white cursor-pointer tran hover:bg-[#10C0CB] hover:text-white">
        <span class=" mx-4">  Upgrade  </span>
      </button>
    </div>
  </div>
</template>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@media (max-width: 1023px) {
  .sidebar {
    width: 195px !important; 
}
}@media (max-width: 1023px) {
  .sidebar div.profile{
    width: 195px !important; 
}
}@media (max-width: 1023px) {
  .sidebar div.profile .job{
    font-size:9px !important; 
}
}.tran{
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

#btn{
  display: none;
}

.float-button:hover {
  background-color: #388d94;
}

</style>

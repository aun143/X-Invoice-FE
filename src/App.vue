<script setup>
import Swal from 'sweetalert2';
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const menuItems = [
  { link: "/Index", name: "Invoices",  icon: "bxs-inbox" },
  { link: "/AllClients", name: "All Clients",  icon: "bxs-user-detail" },
  { link: "/businessProfile", name: "Business", icon: "bxs-user-account" },
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
  "UploadImg",
];

const route = useRoute();
const enableSidebar = computed(() => {
  return componentsWithSidebar.includes(route.name);
});

const menuLogo = "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png"; 
const profileImg = "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";

const getIconType = (item) => {
  return item.icon;
};
</script>


<template>
  <div>
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
        <!-- Customizing menu items to show icons -->
        <template #menuItem="{ item }">
          <a-menu-item :key="item.link" :to="item.link">
            <a-icon :type="getIconType(item)" />
            <span>{{ item.name }}</span>
          </a-menu-item>
        </template>
      </VueSidebarMenuAkahon>
    </div>

    <RouterView v-if="enableSidebar" class="max-w-full pb-6 pl-[250px] lg:pl-[250px] md:pl-[195px]" />
    <RouterView v-else />
  </div>
</template>


<style>
#btn {
    display: none;
}

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
}
</style>

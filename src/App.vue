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
    invoice.resetaccount();
    invoice.resetState();
    invoice.resetFormData();

    
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

const menuLogo = "./src/assets/3x.webp"; 
const profileImg = "./src/assets/3x.webp";

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

    <RouterView v-if="enableSidebar" class="max-w-full pl-[250px]" />
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
</style>

<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { getUserDetailsApi } from "../src/service/LoginService";
import { computed, ref, onMounted } from "vue";
import { useInvoiceStore } from "../src/stores/index";
const router = useRouter();
const invoice = useInvoiceStore();
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
const isSidebarEnabled = computed(() => {
  if (
    invoice.userProfileData.userRole === undefined ||
    invoice.userProfileData.userRole === ""
  ) {
    return false;
  }
  const currentRouteName = router.currentRoute.value.name;
  return componentsWithSidebar.includes(currentRouteName);
});

const handleExitButtonClick = async () => {
  const result = await Swal.fire({
    title: "Logout Confirmation",
    text: "Are you sure you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log me out!",
  });
  if (result.isConfirmed) {
    localStorage.removeItem("UserId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("selectedMenuItem");
    invoice.userProfileData.userRole = "";
    router.push({ name: "Login" });
  }
};
const UserRole = async () => {
  try {
    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const userProfileData = await getUserDetailsApi(UserId);
      invoice.userProfileData.userRole = userProfileData.userRole;
    } else{
      const id = localStorage.getItem("id");
       if(id){
        router.push({name: "ViewInvoice"})
       }else{
        router.push("/login")
       }
    }
    // showPopup();
  } catch (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: ("Error During Getting Account User Role:", error),
    //   footer: "Please try again ",
    // });
    console.error("Error During getting Getting User Role:", error);
  }
};
onMounted(async () => {
  UserRole();
  localStorage.setItem("id",1);
});

const menuItems = [
  { key: '1', text: "DashBoard", icon: "fa-chart-line", route: "DashBoard" },
  { key: '2', text: "Invoices", icon: "fa-file-invoice", route: "Index" },
  { key: '3', text: "All Clients", icon: "fa-users", route: "AllClients" },
  { key: '4', text: "Business", icon: "fa-user-tie", route: "BusinessProfile" },
];
const menuLogo = "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
const online = ref(navigator.onLine);
const selectedMenuItem = ref(localStorage.getItem("selectedMenuItem") || '1');

window.addEventListener("online", () => {
  online.value = true;
});
window.addEventListener("offline", () => {
  online.value = false;
});

const handleMenuItemClicked = (item) => {
  selectedMenuItem.value = item.key;
  router.push({ name: item.route });
};

router.afterEach((to) => {
  const menuItem = menuItems.find((item) => item.route === to.name);
  if (menuItem) {
    selectedMenuItem.value = menuItem.key;
    localStorage.setItem("selectedMenuItem", menuItem.key);
  }
});


</script>

<template>
  <a-layout class="hidden md:block" :style="{ 'pointer-events': online ? 'auto' : 'none' }">
    <a-layout :style="{ position: 'fixed', left: 0 }" class="bg-[#10C0CB] h-full md:w-[195px] lg:w-[250px]" v-if="isSidebarEnabled">
      <div class="logo my-2 grid grid-cols-2 w-full">
        <img class="w-20 ml-8" :src="menuLogo">
        <span class="text-white w-full col-span-1 items-center flex justify-center text-center text-xl font-semibold">X Invoice</span>
      </div>
      <a-menu class="bg-[#10C0CB] mt-4 flex flex-col gap-3" mode="inline">
        <a-menu-item v-for="item in menuItems" :key="item.key" 
  :class="{ 'bg-white text-blue-600': item.key === selectedMenuItem,
             '!bg-transparent !text-black': item.key !== selectedMenuItem  }" 
  class="grid h-full w-full" @click="handleMenuItemClicked(item)">
  <span class="nav-text grid grid-cols-3">
    <i class="mt-2" :class="['fa fas', item.icon]"></i>
    <span class="text-lg">{{ item.text }}</span>
  </span>
</a-menu-item>
      </a-menu>
      <div class="fixed bottom-0 w-full left-0  z-[999]" v-if="isSidebarEnabled && online">
        <button @click="handleExitButtonClick" type="primary" class="flex items-center text-red-600 py-8 justify-center rounded cursor-pointer md:w-[195px] lg:w-[250px] hover:bg-[#10C0CB]" >
          <span class="mx-4 text-lg grid grid-cols-4 gap-1"><i class="fas fa-sign-out-alt col-span-1 mt-1"></i><span class="col-span-3">Logout</span></span>
        </button>
      </div>
    </a-layout>
    <a-layout class="lg:ml-[250px] md:ml-[190px] bg-white " :style="{ marginLeft: isSidebarEnabled ? '' : '0' }">
      <a-layout-content :style="{ overflow: 'initial' }">
        <div :style="{ textAlign: 'center' }">
          <div class="">
            <router-view v-if="isSidebarEnabled"  class="max-w-full h-96" />
            <router-view v-else />
          </div>
          <div v-if="!online" class="offline-message">
            <p>No Internet Connection</p>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <a-layout>
    <div class="block md:hidden text-justify bg-[#10C0CB] px-3 h-screen">
      <h1 class="text-lg font-medium">For a better experience, we suggest using this website on a horizontal or larger screen. Thank you!</h1>
    </div>
  </a-layout>
</template>

<style>
#components-layout-demo-fixed-sider .logo {
  background: rgba(255, 255, 255, 0.2);
}
.ant-layout-sider-children {
  background-color: #10C0CB !important;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.float-button:hover {
  background-color: #388d94;
}
.offline-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 10px;
  z-index: 9999; 
}

/* .ant-menu-item-active{
  background-color: transparent !important;
  color:black !important;
}  */
</style>

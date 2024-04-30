<template>
  <a-layout>
    <a-layout :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }" class="bg-[#10C0CB] md:w-[195px] lg:w-[250px]">
      <div class="logo my-2 grid grid-cols-2 w-full" ><img :src="menuLogo"> <span class="text-white w-full col-span-1 items-center flex justify-center text-center text-xl">X Invoice</span></div>
      <a-menu class="bg-[#10C0CB]" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item v-for="item in menuItems" :key="item.key" class="grid h-full w-full">
          
      <span class="nav-text grid grid-cols-3"><i class="mt-2 " :class="['fa fas', item.icon]"></i>  <span class="text-lg">{{ item.text }}</span> </span>
    </a-menu-item>
      </a-menu>
    </a-layout>
    <a-layout class="lg:ml-[250px] md:ml-[190px]">
      <a-layout-content :style="{ overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          <RouterView
      v-if="enableSidebar"
      :style="{ paddingLeft: !online ? '0 !important' : '' }"
      class="max-w-full pl-[250px] lg:pl-[250px] md:pl-[195px] pt-16 h-96 "
    />
    <RouterView v-else />
    <div v-if="!online" class="offline-message">
      <p>No Internet Connection</p>
      
      <!-- You can style this message as needed -->
    </div>
    <div class="fixed bottom-0 w-full left-0  z-[999]" v-if="enableSidebar && online">
      <button
        @click="handleExitButtonClick" 
        type="primary"
        class="flex items-center text-red-600 py-8 justify-center h-[40px] rounded cursor-pointer trans shadow-lg"
        v-if="invoice.userProfileData.userRole !== 'iSuperAdmin'"
      >
        <span class="mx-4 text-lg"><i class="fas fa-user mr-2"></i>Logout</span>
      </button>
    </div>
  <div class="block md:hidden text-justify bg-[#10C0CB] px-3 h-screen">
    <h1 class="text-lg font-medium">  For a better experience, we suggest using this website on a horizontal or larger screen. Thank you!</h1>
  </div>
        </div>
      </a-layout-content>

    </a-layout>
  </a-layout>
</template>
<script setup>
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { getUserDetailsApi } from "../service/LoginService";
import { computed, ref, onMounted, watch } from "vue";
import { useInvoiceStore } from "../stores/index";
const router = useRouter();
const invoice = useInvoiceStore();
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
    invoice.userProfileData.userRole = "";
    router.push({ name: "Login" });
  }
};
const enableExitButton = true;
const isLoading = ref(false);
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
const UserRole = async () => {
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
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error During Getting Account User Role:", error),
      footer: "Please try again ",
    });
    console.error("Error During getting Getting User Role:", error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  UserRole();
});
const selectedKeys = ref(['4']);
const menuItems = [
  { key: '1', text: "DashBoard", icon: "fa-chart-line " },
  { key: '2', text: "Invoices", icon: "fa-inbox " },
  { key: '3', text: "All Clients", icon: "fa-users "},
  { key: '4', text: "Business", icon: "fa-user " },
];
const menuLogo =
  "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
const profileImg =
  "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
  const upgradeAccount = () => {
  router.push("/subscription");
};

const online = ref(navigator.onLine);
watch(online, (value) => {
});
window.addEventListener("online", () => {
  online.value = true;
});
window.addEventListener("offline", () => {
  online.value = false;
});
const handleMenuItemClicked = () => {
  alert("Hey");
};
const route = useRoute();
const enableSidebar = computed(() => {
  if (
    invoice.userProfileData.userRole === undefined ||
    invoice.userProfileData.userRole === ""
  ) {
    return false;
  }
  return componentsWithSidebar.includes(route.name);
});
const currentRoute = useRoute(); // Track current route

// Update menu items to include isActive property
menuItems.forEach(item => {
  item.isActive = item.link === currentRoute.path;
});

</script>
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
.sidebar.open .profile #log_out{
  width:100%;
  background: #10C0CB;
}
@media (max-width: 1023px) {
  .sidebar {
    width: 195px !important;
  }
  .trans {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  width:195px !important;  
}
}
@media (max-width: 1023px) {
  .sidebar div.profile {
    width: 195px !important;
  }
  .trans {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  width:195px !important;  

}
}
.sidebar div.profile  {
background-color: transparent !important;
  }

  .sidebar div.profile {
    display: none !important;
  }

button:focus {
  outline: none;
}
.sidebar {
  transition: none !important;
}
.trans {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  width:250px;  

}
.trans {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}
#btn {
  display: none;
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
</style>
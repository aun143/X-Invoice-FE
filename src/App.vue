
<script setup>
import Swal from "sweetalert2";
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { useRoute, useRouter } from "vue-router";
import { getUserDetailsApi } from "../src/service/LoginService";
import { computed, ref, onMounted, watch } from "vue";
import { useInvoiceStore } from "../src/stores/index";
import { Colors } from "./utils/color";

const menuItems = [
  { link: "/dashBoard", name: "DashBoard", icon: "bxs-dashboard" },
  { link: "/Index", name: "Invoices", icon: "bxs-inbox" },
  { link: "/AllClients", name: "All Clients", icon: "bxs-user-detail" },
  { link: "/businessProfile", name: "Business", icon: "bxs-user-account" },
];

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("UserId");
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
const userRole = ref();
onMounted(async () => {
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
      text: ("Error During Getting Account:", error),
      footer: "Please try again ",
    });
    console.error("Error During getting Business Profile:", error);
  } finally {
    isLoading.value = false;
  }
});

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

const menuLogo =
  "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
const profileImg =
  "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";

const upgradeAccount = () => {
  router.push("/subscription");
};

const online = ref(navigator.onLine);
watch(online, (value) => {
  if (!value) {
    Swal.fire({
      icon: "error",
      title: "No Internet Connection",
      text: "Please check your internet connection and try again.",
      showConfirmButton: false,
      allowOutsideClick: false, // Prevent closing when clicking outside
      didOpen: () => {
        const interval = setInterval(() => {
          if (navigator.onLine) {
            Swal.close();
            clearInterval(interval);
          }
        }, 1000); // Check internet connection every second
      },
    });
  }
});

window.addEventListener("online", () => {
  online.value = true;
});

window.addEventListener("offline", () => {
  online.value = false;
});
</script>
<template>
  <div class="overflow-hidden">
    <div class="">
      <VueSidebarMenuAkahon
        v-if="online && enableSidebar"
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
    <RouterView
      v-if="online && enableSidebar"
      class="max-w-full pb-6 pl-[250px] lg:pl-[250px] md:pl-[195px]"
    />
    <RouterView v-else />
    <div class="fixed bottom-[28px] right-[28px] z-[999]">
      <button
        v-if="invoice.userProfileData.userRole"
        @click="upgradeAccount"
        class="mb-[8px] flex items-center justify-center h-[40px] rounded bg-[#4AA7AD] text-white cursor-pointer tran hover:bg-[#10C0CB] hover:text-white"
      >
        <span class="mx-4" > {{ invoice.userProfileData.userRole === 'iSuperAdmin'? 'Downgrade': 'Upgrade' }} </span>
      </button>
    </div>
  </div>
</template>

<style>
/* Your styles */
</style>

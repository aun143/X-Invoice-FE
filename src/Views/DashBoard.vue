<script setup>
import { ref, onMounted } from 'vue';
import { getAllInvoice } from '../service/IndexService'; // Import your API function
import { getAllClient } from '../service/ClientService'; // Import your API function
import { getUserDetailsApi } from "../service/LoginService";
import { useInvoiceStore } from "../stores/index.js";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
const totalClients = ref(0); // Initialize total clients count
const totalInvoices = ref(0); // Initialize total invoices count
const invoice = useInvoiceStore();
const router = useRouter();
const dropdownTitle = "Add New";
const dropdownItems = [{ title: "Create Invoice" }, { title: "Create Client" }];
const handleSaveDraftButtonClick = () => {
router.push("/new");
};
const handleDropdownItemClickParent = (clickedItem) => {
if (clickedItem.title === "Create Invoice") {
  // invoice.formData.$reset;
  router.push("/new");
} else if (clickedItem.title === "Create Client") {
  router.push("/Client");
}
};
const fetchClients = async () => {
  try {
    const { success, data, error } = await getAllClient();
    if (success) {
      totalClients.value = data.totalItems; // Set total clients count
    } else {
      console.error('Error fetching clients:', error);
    }
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
};
const fetchUserProfile = async () => {
try {
  const userId = localStorage.getItem("UserId");
  const userProfileData = await getUserDetailsApi(userId);

  invoice.userProfileData = userProfileData;
} catch (error) {
  console.error("Error Fetching User Details:", error);
}
}
const fetchInvoices = async () => {
  try {
    const { success, data, error } = await getAllInvoice();
    if (success) {
      totalInvoices.value = data.length; 
    } else {
      console.error('Error fetching invoices:', error);
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
};

const handleProfileCard = () => {
router.push("/BusinessProfile")
};

const handleClientCard = () => {
  router.push("/AllClientc");
};const handleSubscriptionCard = () => {
  router.push("/subscription");
};const handleInvoiceCard = () => {
  router.push("/Index");
};


onMounted(async () => {
  await fetchClients();
  await fetchUserProfile();
  await fetchInvoices();
});

</script>

<template>
    <div>
      <Header
        :showBackButton="true"
        headerTitle="DashBoard"
        backRoute="Index"
        :dropdownTitle="dropdownTitle"
        :showDraftButton="true"
        :dropdownItems="dropdownItems"
        saveDraftButtonColor="#ff6633"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="true"
        :onDropdownItemClick="handleDropdownItemClickParent"
      />
      <div class="mx-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg shadow-md p-4 card" @click="handleSubscriptionCard">
            <h2 class="text-lg font-semibold mb-4">Current Subscription Plan</h2>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                <strong class="col-span-1"><i class="fas fa-user-circle"></i> UserRoles:</strong>
                <p class="col-span-1 items-start justify-start">{{ invoice.userProfileData.userRole }}</p>
              </div>
              <div class="grid grid-cols-2">
                <strong class="col-span-1"><i class="fas fa-user"></i> Plan Name:</strong>
                <p class="col-span-1 items-center justify-center">{{ invoice.userProfileData.planeName }}</p>
              </div>
              <div class="grid grid-cols-2">
                <strong class="col-span-1"><i class="fas fa-file-invoice"></i> Max Invoice:</strong>
                <p class="col-span-1 items-center justify-center">{{ invoice.userProfileData.maxInvoices }}</p>
              </div>
              <div class="grid grid-cols-2">
                <strong class="col-span-1"><i class="fas fa-users"></i> Max Clients:</strong>
                <p class="col-span-1 items-center justify-center">{{ invoice.userProfileData.maxClients }}</p>
              </div>
              
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 card" @click="handleProfileCard">
      <h2 class="text-lg font-semibold mb-4">Profile</h2>
      <div class="flex flex-col">
        <div class="grid grid-cols-2">
          <strong class="col-span-1"><i class="fas fa-user"></i> Username:</strong>
          <p class="col-span-1 items-start justify-start">{{ invoice.userProfileData.username }}</p>
        </div>
        <div class="grid grid-cols-2">
          <strong class="col-span-1"><i class="fas fa-envelope"></i> Email:</strong>
          <p class="col-span-1 items-start justify-start ">{{ invoice.userProfileData.email }}</p>
        </div>
        <div v-if="invoice.userProfileData.individualProfile.phone || invoice.userProfileData.organizationProfile.phone" class="grid grid-cols-2">
          <strong class="col-span-1"><i class="fas fa-phone"></i> Phone:</strong>
          <p class="col-span-1 items-start justify-start">
            {{ invoice.userProfileData.individualProfile.phone || invoice.userProfileData.organizationProfile.phone }}
          </p>
        </div>
      </div>
    </div>
          <div class="bg-white rounded-lg shadow-md p-4 card" @click="handleClientCard">
            <h2 class="text-lg font-semibold mb-4">Total Clients</h2>
            <div class="flex items-center justify-center"><i class="fas fa-user mr-2 text-lg"></i><p class="text-xl">  {{ totalClients }}</p></div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 card" @click="handleInvoiceCard">
            <h2 class="text-lg font-semibold mb-4">Total Invoices</h2>
            <div class="flex items-center justify-center"><i class="fas fa-file-invoice mr-2 text-lg"></i><p class="text-xl"> {{ totalInvoices }}</p></div>
          </div>
          <!-- Graphs -->
          <div class="rounded-lg shadow-md p-4 col-span-2 bg-[#4AA7AD]">
            <h2 class="text-lg font-semibold mb-4">Graphs</h2>
            <canvas ref="invoiceChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
.card {
  transition: transform 0.3s ease-in-out;
  background-color: #4AA7AD;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.02);
  background-color: #10C0CB;

}
  </style>
  
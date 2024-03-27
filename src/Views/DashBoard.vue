<script setup>
import { ref, onMounted } from "vue";
import { getAllInvoice } from "../service/IndexService"; // Import your API function
import { getAllClient } from "../service/ClientService"; // Import your API function
import { getUserDetailsApi } from "../service/LoginService";
import { useInvoiceStore } from "../stores/index.js";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Chart from "chart.js/auto";
const totalClients = ref(0); // Initialize total clients count
const totalInvoices = ref(0);
const pieChart = ref(null);
const isLoading = ref("");
const lineGraph = ref(null);
const barChart = ref(null); // Initialize total invoices count
const invoice = useInvoiceStore();
const router = useRouter();
const dropdownTitle = "Add New";
const dropdownItems = [{ title: "Create Invoice" }, { title: "Create Client" }];
const handleSaveDraftButtonClick = () => {
  router.push("/new");
};
const createBarChart = () => {
  const ctx = barChart.value.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 
    labels: [` `],
      datasets: [{
        label: 'Total Clients',
        data: [totalClients.value],

        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      }, {
        label: 'Total Invoices',
        data: [ totalInvoices.value],

        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 10,
          stepSize: 1,
        },
      },
    },
  });
};
const createLineGraph = (data) => {
  const ctx = lineGraph.value.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      // labels: ['2024', '2023'], 
    labels: [`Total Clients `, `Total Invoices  `],
      datasets: [{
        label: 'Data', 
        data: [totalClients.value, totalInvoices.value],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],        borderWidth: 1,
        fill: false,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 10,
          stepSize: 1,
        },
      },
    },
  });
};
const createPieChart = () => {
  const ctx = pieChart.value.getContext('2d');
  const total = totalClients.value + totalInvoices.value;
  const invoicesPercentage = ((totalInvoices.value / total) * 100).toFixed(2);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [`Total Clients (${100 - invoicesPercentage}%)`, `Total Invoices (${invoicesPercentage}%) `],
      datasets: [{
        label: 'Data',
        data: [totalClients.value, totalInvoices.value],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)', 
        ],
        borderWidth: 1,
      }],
    },
  });
};

const handleDropdownItemClickParent = (clickedItem) => {
  if (clickedItem.title === "Create Invoice") {
    router.push("/new");
  } else if (clickedItem.title === "Create Client") {
    router.push("/Client");
  }
};
const fetchClients = async () => {
  try {
    isLoading.value=true;
    const { success, data, error } = await getAllClient();
    if (success) {
      totalClients.value = data.totalItems; // Set total clients count
    } else {
      console.error("Error fetching clients:", error);
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
  }finally{
    isLoading.value=false;
  }
};
const fetchUserProfile = async () => {
  try {
    isLoading.value=true;
    const userId = localStorage.getItem("UserId");
    const userProfileData = await getUserDetailsApi(userId);

    invoice.userProfileData = userProfileData;
  } catch (error) {
    console.error("Error Fetching User Details:", error);
  }finally{
    isLoading.value=false;
  }
};
const fetchInvoices = async () => {
  try {
    isLoading.value=true;
    const { success, data, error } = await getAllInvoice();
    if (success) {
      totalInvoices.value = data.length;
    } else {
      console.error("Error fetching invoices:", error);
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }finally{
    isLoading.value=false;
  }
};

const handleProfileCard = () => {
  router.push("/BusinessProfile");
};

const handleClientCard = () => {
  router.push("/AllClientc");
};
const handleSubscriptionCard = () => {
  router.push("/subscription");
};
const handleInvoiceCard = () => {
  router.push("/Index");
};

onMounted(async () => {
  await fetchClients();
  await fetchUserProfile();
  await fetchInvoices();
  createPieChart();
  createLineGraph();
  createBarChart();
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
    <div v-if="isLoading" class=""><a-spin size="large" ></a-spin></div>
    <div class="mx-4 py-8" v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          class="bg-white rounded-lg shadow-md p-4 card"
          @click="handleSubscriptionCard"
        >
          <h2 class="text-lg font-semibold mb-4">Current Subscription Plan</h2>
          <div class="flex flex-col">
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-user-circle"></i> UserRoles:</strong
              >
              <p class="col-span-1 items-start justify-start">
                {{ invoice.userProfileData.userRole }}
              </p>
            </div>
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-user"></i> Plan Name:</strong
              >
              <p class="col-span-1 items-center justify-center">
                {{ invoice.userProfileData.planeName }}
              </p>
            </div>
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-file-invoice"></i> Max Invoice:</strong
              >
              <p class="col-span-1 items-center justify-center">
                {{ invoice.userProfileData.maxInvoices }}
              </p>
            </div>
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-users"></i> Max Clients:</strong
              >
              <p class="col-span-1 items-center justify-center">
                {{ invoice.userProfileData.maxClients }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-md p-4 card"
          @click="handleProfileCard"
        >
          <h2 class="text-lg font-semibold mb-4">Profile</h2>
          <div class="flex flex-col">
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-user"></i> Username:</strong
              >
              <p class="col-span-1 items-start justify-start">
                {{ invoice.userProfileData.username }}
              </p>
            </div>
            <div class="grid grid-cols-2">
              <strong class="col-span-1"
                ><i class="fas fa-envelope"></i> Email:</strong
              >
              <p class="col-span-1 items-start justify-start">
                {{ invoice.userProfileData.email }}
              </p>
            </div>
            <div
              v-if="
                invoice.userProfileData.individualProfile.phone ||
                invoice.userProfileData.organizationProfile.phone
              "
              class="grid grid-cols-2"
            >
              <strong class="col-span-1"
                ><i class="fas fa-phone"></i> Phone:</strong
              >
              <p class="col-span-1 items-start justify-start">
                {{
                  invoice.userProfileData.individualProfile.phone ||
                  invoice.userProfileData.organizationProfile.phone
                }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-md p-4 card"
          @click="handleClientCard"
        >
          <h2 class="text-lg font-semibold mb-4">Total Clients</h2>
          <div class="flex items-center justify-center">
            <i class="fas fa-user mr-2 text-lg"></i>
            <p class="text-xl">{{ totalClients }}</p>
          </div>
        </div>
        <div
          class="bg-white rounded-lg shadow-md p-4 card"
          @click="handleInvoiceCard"
        >
          <h2 class="text-lg font-semibold mb-4">Total Invoices</h2>
          <div class="flex items-center justify-center">
            <i class="fas fa-file-invoice mr-2 text-lg"></i>
            <p class="text-xl">{{ totalInvoices }}</p>
          </div>
        </div>
      </div>
      <div class="grid">
      <div class="rounded-lg shadow-md bg-white my-8 grid">
        <h2 class="text-lg font-semibold">Bar Chart</h2>
        <canvas ref="barChart" width="100" height="20"></canvas>
      </div>
      <div class="w-full grid grid-cols-2 gap-5">
        <div class="rounded-lg shadow-md p-2 bg-white grid">
  <h2 class="text-lg font-semibold">Pie Chart</h2>
  <canvas ref="pieChart" width="100" height="100"></canvas>
</div>
        <div class="rounded-lg shadow-md p-2 bg-white grid">
          <h2 class="text-lg font-semibold">Line Graph</h2>
          <canvas ref="lineGraph" width="200" height="200"></canvas>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  transition: transform 0.3s ease-in-out;
  background-color: #4aa7ad;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.02);
  background-color: #10c0cb;
}
</style>

<!-- <script setup>
import { ref, onMounted, computed } from "vue";

import { Colors } from "../utils/color";

import { getAllClient } from "../service/ClientService";
import { useRouter, useRoute } from "vue-router";
import Header from "../components/Header.vue";

const pageSize = 10; // Set your desired page size
const totalPages = ref(1);
const currentPage = ref(1);
const route = useRoute();
const clientId = ref(null);
const filterStatus = ref("All");
const clients = ref([]);
const router = useRouter();

const goToInvoice = (clientId) => {
  router.push(`/clients/${clientId}/edit`, {});
};

const handleSaveDraftButtonClick = () => {
  router.push("/new");
};

const fetchClients = async (page) => {
  try {
    const result = await getAllClient({ page, pageSize });
    clients.value = result.data;

    totalPages.value = Math.ceil(result.totalItems / pageSize);
    currentPage.value = result.page;
    console.log("All Clients:", clients.value);
  } catch (error) {
    console.error("Error fetching all Clients:", error.message);
  }
};

onMounted(() => {
  fetchClients(currentPage.value);
});

const filteredClients = computed(() => {
  if (filterStatus.value === "All") {
    return clients.value;
  } else {
    return clients.value.filter(
      (client) => client.paymentStatus === filterStatus.value
    );
  }
});

const setFilterStatus = (status) => {
  filterStatus.value = status;
  fetchClients(currentPage.value);
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchClients(currentPage.value + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    fetchClients(currentPage.value - 1);
  }
};

const dropdownTitle = "Add New";
const dropdownItems = [{ title: "Create Client" }, { title: "Create Invoice" }];

const handleDropdownItemClickParent = (clickedItem) => {
  if (clickedItem.title === "Create Client") {
    router.push("/Client");
  } else if (clickedItem.title === "Create Invoice") {
    router.push("/new");
  }
};
</script>


<template>
  <div>
    <Header
      :showBackButton="true"
      headerTitle="Clients"
      :dropdownTitle="dropdownTitle"
      :showDraftButton="true"
      :dropdownItems="dropdownItems"
      :saveDraftButtonColor="Colors.orange"
      :onSaveDraftButtonClick="handleSaveDraftButtonClick"
      :showDropdown="true"
      :onDropdownItemClick="handleDropdownItemClickParent"
    />
  </div>
  <div class="content-center">
      <div class="flex-col m-auto flex p-4 max-w-full">
        <div class="flex flex-col ">
          <span class="meta" style="display: inline"></span>
          <div class="">
            <div class="flex justify-end">
              <div class="flex space-x-2 mt-12 mr-4 pb-6">
                <a href="#" class="tab p-4" @click="setFilterStatus('All')"
                  >&nbsp;&nbsp; All &nbsp;&nbsp;</a
                >
              </div>
            </div>
          </div>

        
          <div class="flex justify-center bg-gray-100 shadow ">
            <div class="min-w-full">
              <table class="min-w-full ">
                <thead class="p-2 text-xl shadow-md  ">
                  <tr>
                    <th class="text-center">Sr No.</th><th class="text-center">First Name</th>
                    <th class="text-center">Last Name</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Phone No</th>
                  </tr>
                </thead>
                <tbody class="">
                  <tr v-for="(client,i) in filteredClients" :key="client._id">
                    <td class="text-center p-2">
                      <a
                        class="cursor-pointer"
                        @click="() => goToInvoice(client._id)"
                        >{{ i+1 }}
                      </a>
                    </td><td class="text-center">
                      <a
                        class="cursor-pointer"
                        @click="() => goToInvoice(client._id)"
                        >{{ client.firstName }}
                      </a>
                    </td>
                    <td class="text-center">{{ client.lastName }}</td>
                    <td class="text-center">{{ client.email }}</td>
                    <td class="text-center">{{ client.phone }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button
          class="bg-blue-500 text-white px-4 py-2 mr-2"
          @click="previousPage"
        >
          Previous
        </button>
        <button
          class="bg-blue-500 text-white px-4 py-2"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
</template>

<style scoped>
.tab {
  border: 1px solid #ccc;
  background-color: #f3f3f4;
}

.bg-red-200 {
  background-color: #ffcccc;
}
</style> -->

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllClient } from '../service/clientService';
import { useRoute,useRouter } from 'vue-router';
import Header from "../components/header.vue";
const isLoading = ref(false);

const router = useRouter();
const pageSize = ref(10);
const currentPage = ref(1);
const totalItems = ref(0);
const clients = ref([]);
 const totalPages = ref(1);
const route = useRoute();
const clientId = ref(null);
const filterStatus = ref("All");
const dropdownTitle = "Add New";
const dropdownItems = [{ title: "Create Client" }, { title: "Create Invoice" }];
const searchQuery = ref('');
const handleDropdownItemClickParent = (clickedItem) => {
  if (clickedItem.title === "Create Client") {
    router.push("/Client");
  } else if (clickedItem.title === "Create Invoice") {
    router.push("/new");
  }
};
const fetchClients = async () => {
  try {
     isLoading.value = true;
 const result = await getAllClient({ page: currentPage.value, pageSize: pageSize.value });
    clients.value = result.data;
    totalItems.value = result.totalItems;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  }finally{
       isLoading.value = false;

  }
};

onMounted(fetchClients);

const handlePageChange = async (page) => {
  currentPage.value = page;
  await fetchClients();
};

const handlePageSizeChange = async (current, size) => {
  pageSize.value = size;
  currentPage.value = 1; // Reset current page when page size changes
  await fetchClients();
};
const customRow = (record) => {
  return {
    onClick: () => {
      const clickedClient = record;
      handleCellClick(clickedClient._id);
    },
  };
};
const handleCellClick = (clientId) => {
  router.push(`/clients/${clientId}/edit`);
};

const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: true,
    onCell: (record) => ({
        onClick: () => handleClientItemClick(record.id),
      }),
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: true
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Phone No',
    dataIndex: 'phone',
    key: 'phone'
  }
];
const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clients.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    return clients.value.filter((client) => {
      return (
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query)
      );
    });
  }
});
</script>

<template>
  <div>
    <Header
      :showBackButton="true"
      headerTitle="Clients"
      :dropdownTitle="dropdownTitle"
      :showDraftButton="true"
      :dropdownItems="dropdownItems"
      :saveDraftButtonColor="white"
      :onSaveDraftButtonClick="handleSaveDraftButtonClick"
      :showDropdown="true"
      :onDropdownItemClick="handleDropdownItemClickParent"
    />
  </div>

  <div class="content-center">
    <div class="flex-col m-auto flex p-4 max-w-full">
      <div class="flex flex-col ">
        <span class="meta" style="display: inline"></span>
        <div class="">
          <div class="flex justify-end">
            <div class="flex space-x-2 mt-12 mr-4 pb-4">
              <a href="#" class="tab p-4" @click="setFilterStatus('All')"
                >&nbsp;&nbsp; All &nbsp;&nbsp;</a
                >
              </div>
            </div>
            <div class="flex justify-end">
            <a-input
          v-model="searchQuery"
          placeholder="Search clients..."
          class="p-2 mb-4 border border-gray-300 rounded-md w-40 "
        />
        <a-button type="primary" @click="handleSearch" class="ml-2 bg-[#10C0CB]">
          Search
        </a-button>
      </div>
        </div>

        <a-table
        :loading="isLoading"
        :customRow="customRow" 
    :columns="columns"
    :data-source="filteredClients || sortedClients"
    rowKey="clientId"
    :scroll="{ x: 'max-content' }"
    :pagination="{
      showSizeChanger: false,
      showQuickJumper: false,
      pageSize: pageSize,
      total: totalItems,
      onChange: handlePageChange,
      onShowSizeChange: handlePageSizeChange
    }"
  >
  </a-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab {
  border: 1px solid #ccc;
  background-color: #f3f3f4;
}

.bg-red-200 {
  background-color: #ffcccc;
}
</style>

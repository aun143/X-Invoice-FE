<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllClient } from '../service/ClientService';
import { useRoute, useRouter } from 'vue-router';
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import Swal from "sweetalert2";
import { Colors } from "../utils/color";

const invoice = useInvoiceStore();
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
    invoice.resetState();
    router.push("/Client");
  } else if (clickedItem.title === "Create Invoice") {
    router.push("/new");
  }
};

// const fetchClients = async () => {
//   try {
//     isLoading.value = true;
//     const result = await getAllClient({ page: currentPage.value, pageSize: pageSize.value });
//     clients.value = result.data;
//     totalItems.value = result.totalItems;
//   } catch (error) {
//     console.error('Error fetching clients:', error.message);
//   } finally {
//     isLoading.value = false;
//   }
// };

// onMounted(fetchClients);

// const handlePageChange = async (page) => {
//   currentPage.value = page;
//   await fetchClients();
// };
// console.log("handlePageChange ",currentPage.value)

// const handlePageSizeChange = async (current, size) => {
//   pageSize.value = size;
//   currentPage.value = 1;
//   await fetchClients();
// };
const fetchClients = async () => {
  try {
    isLoading.value = true;
    const result = await getAllClient();
    clients.value = result.data;
    totalItems.value = result.totalItems;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchClients);

const customRow = (record) => {
  return {
    onClick: () => {
      const clickedClient = record;
      handleCellClick(clickedClient._id);
    },
  };
};

const handleCellClick = (clientId) => {
  router.push(`/ViewClient/${clientId}`);
};

const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    // sorter: true,
    onCell: (record) => ({
        onClick: () => handleClientItemClick(record.id),
      }),
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    // sorter: true
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
  },
  // {
  //   title: 'Client Type',
  //   dataIndex: 'clientType',
  //   key: 'phone'
  // }
];

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clients.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    const filtered = clients.value.filter((client) => {
      return (
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) 
      );
    });

    if (filtered.length === 0) {
      // If no search results are found, display a message
      console.log("No results found");
    }

    return filtered;
  }
});
</script>

<template>
  <div>
  <div class="">
    <Header
      :showBackButton="true"
      headerTitle="Clients"
      :dropdownTitle="dropdownTitle"
      :showDraftButton="true"
      :dropdownItems="dropdownItems"
      :showDropdown="true"
      :onDropdownItemClick="handleDropdownItemClickParent"
    />
  </div>

  <div class="content-center px-6 mt-2">
    <div class="flex-col m-auto flex p-4 max-w-full ">
      <div class="flex flex-col ">
        <span class="" style="display: inline"></span>
        <div class="">
          <div class="flex justify-end">
            <a-input
              v-model:value="searchQuery"
              placeholder="Search clients..."
              class="w-[150px] my-4"
            />
            <!-- <a-button type="primary" @click="handleSearch" class="ml-2 bg-[#10C0CB]">
              Filter
            </a-button> -->
            
          </div>
        </div>

        <a-table
          :loading="isLoading"
          :customRow="customRow" 
          :columns="columns"
          :data-source="filteredClients"
          rowKey="clientId"
          :pagination="{ 
            showSizeChanger: false,
            showQuickJumper: false,
            pageSize: pageSize,
            total: totalItems,
            // current: currentPage.value, 
            // onChange: handlePageChange,
            // onShowSizeChange: handlePageSizeChange
          }"
        >
        </a-table>

        <!-- Message for no search results -->
        
      </div>
    </div>
  </div>
</div>
</template>

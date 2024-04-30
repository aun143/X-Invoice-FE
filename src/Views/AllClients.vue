<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllClient } from '../service/ClientService';
import { useRoute, useRouter } from 'vue-router';
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { notification } from "ant-design-vue";

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
    const {success,data,error}= await getAllClient();
    if(success){
      clients.value = data.data;
    totalItems.value = data.totalItems;
    }else{
    openNotificationWithIcon("error", error);

  if (error === "Your subscription plan has expired. Please update your plan.") {
    router.push("/subscription");
  } else {
  }
    }

  } catch (error) {
    console.error('Error fetching get All Client:', error.message);
  } finally {
    isLoading.value = false;
  }
};
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 5, 
  });
};
onMounted(() => {
  fetchClients();
});
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
    onCell: (record) => ({
        onClick: () => handleClientItemClick(record.id),
      }),
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
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

  <div class="content-center  xl:px-6 mt-2">
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
          }"
        >
        </a-table>
     </div>
    </div>
  </div>
</div>
</template>

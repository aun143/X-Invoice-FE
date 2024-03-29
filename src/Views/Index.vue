<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Colors } from "../utils/color";
import Header from "../components/Header.vue";
import { getSingleClient } from "../service/ClientService";
import { getAllInvoice } from "../service/IndexService";
import { useInvoiceStore } from "../stores/index.js";
const invoice=useInvoiceStore();
const filterStatus = ref("All");
const invoices = ref();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const invoiceNumberFilter = ref("");
const nameFilter = ref("");
const filteredInfo = ref("");
const filteredData = computed(() => {
  if (!invoices.value || !filterStatus.value) {
    return [];
  }

  if (filterStatus.value === "All") {
    return invoices.value;
  } else {
    return invoices.value.filter((invoice) => invoice.paymentStatus === filterStatus.value);
  }
});

const sortedInfo = reactive({
  columnKey: "invoiceNumber",
  order: "ascend",
});
const handleSaveDraftButtonClick = () => {
  router.push("/new");
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const result = await getAllInvoice();

    const invoicesWithReceiverNames = await Promise.all(result.map(async (invoice) => {
      const receiverDetails = await getSingleClient(invoice.receiver);
  
      const receiverName = receiverDetails.firstName + " " + receiverDetails.lastName;
  return { ...invoice, receiverName };
    }));
    invoices.value = invoicesWithReceiverNames;
  } catch (error) {
    console.error("Error fetching all invoices:", error.message);
  } finally {
    isLoading.value = false;
  }
});

const sortedInvoices = computed(() => {
  if (!invoices.value) {
    return [];
  }

  let sorted = invoices.value.slice();

  if (sortedInfo.columnKey) {
    const { columnKey, order } = sortedInfo;
    //console.log("Sorting:", columnKey, order);

    sorted = sorted.sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "ascend" ? aValue - bValue : bValue - aValue;
      } else {
        const aString = String(aValue);
        const bString = String(bValue);

        return order === "ascend"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }
    });
  }

  //console.log("Sorted:", sorted);
  return sorted;
});

watch(
  () => sortedInfo,
  (newSortedInfo, oldSortedInfo) => {
    //console.log("sortedInfo changed:", newSortedInfo);
  },
  { deep: true }
);

const setFilterStatus = (status) => {
  filterStatus.value = status;

};

const dropdownTitle = "Add New";
const dropdownItems = [{ title: "Create Invoice" }, { title: "Create Client" }];

const handleDropdownItemClickParent = (clickedItem) => {
  if (clickedItem.title === "Create Invoice") {
    invoice.resetFormData();
    router.push("/new");
  } else if (clickedItem.title === "Create Client") {
    router.push("/Client");
  }
};

const columns = computed(() => {
  return [
    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      sorter: true,
      slots: { customRender: "invoiceNumber" },
      onCell: (record) => ({
        onClick: () => handleInvoiceNumberClick(record.id),
      }),
      onHeaderCell: (column) => ({
        onClick: () => handleHeaderClick(column),
      }),
    },
    {
      title: "Sender",
      dataIndex: ["sender", "firstName" ],
      key: "sender",
      sorter: true,
      onHeaderCell: (column) => ({
        onClick: () => handleHeaderClick(column),
      }),
    },
    {
      title: "Receiver",
      dataIndex: "receiverName", // Use receiverName instead of receiver
      key: "receiverName", // Use receiverName instead of receiver
      sorter: true,
      onHeaderCell: (column) => ({
        onClick: () => handleHeaderClick(column),
      }),
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      slots: { customRender: "status" },
      onHeaderCell: (column) => ({
        onClick: () => handleHeaderClick(column),
      }),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: true,
      onHeaderCell: (column) => ({
        onClick: () => handleHeaderClick(column),
      }),
    },
  ];
});

const handleFilter = () => {
  filteredInfo.value = invoices.value.filter((invoice) => {
    const matchesInvoiceNumber = invoice.invoiceNumber.toLowerCase().includes(invoiceNumberFilter.value.toLowerCase());
    const matchesSender = invoice.sender.firstName.toLowerCase().includes(nameFilter.value.toLowerCase());
    //console.log("object,",matchesSender)
    //console.log("matchesInvoiceNumber,",matchesInvoiceNumber)
    
    return matchesInvoiceNumber && matchesSender;
  });
};

const handleHeaderClick = (column) => {

  if (column.sorter) {
    const isAscend = sortedInfo.order === "ascend";
    sortedInfo.columnKey = column.dataIndex;
    sortedInfo.order = isAscend ? "descend" : "ascend";
  } else {
    // If the column is not sortable, reset sorting
    sortedInfo.columnKey = null;
    sortedInfo.order = null;
  }
};

const getStatusClass = (status) => {
  return {
    "bg-[#10C0CB] px-2 text-black items-center flex w-[50%] sm:w-[100%] lg:w-[55%] 2xl:w-[35%] rounded m-[1px]  px-4 py-1": status === "Paid",
    "bg-orange-300 text-black  flex w-[50%] sm:w-[100%] lg:w-[55%] 2xl:w-[35%] rounded m-[1px] px-2 py-1": status === "Unpaid",
    "bg-[#bababa] px-2 text-black items-center flex w-[50%] sm:w-[100%] lg:w-[55%] 2xl:w-[35%] rounded m-[1px] px-4 py-1": status === "Draft",
  };
};

const goToInvoice = (invoiceId) => {
  router.push(`/GetInvoice/${invoiceId}`);
};
// const goToInvoice = (invoiceId,businessId) => {
//   const userId =localstorage.getItems("UserId");
//   router.push(`/pdf/generate/${invoiceId}/${businessId}/${userId}`);
// };
const customRow = (record) => {
  return {
    onClick: () => {
      const clickedInvoice = record;
      goToInvoice(clickedInvoice._id);
    },
  };
};
</script>

<template>
  <div>
    <Header
      :showBackButton="true"
      headerTitle="Invoices"
      backRoute="Index"
      :dropdownTitle="dropdownTitle"
      :showDraftButton="true"
      :dropdownItems="dropdownItems"
      saveDraftButtonColor="#ff6633"
      :onSaveDraftButtonClick="handleSaveDraftButtonClick"
      :showDropdown="true"
      :onDropdownItemClick="handleDropdownItemClickParent"
    />
    <div class="content-center mt-6">
      <div class="flex-col m-auto flex max-w-full p-2">
        <div class="flex flex-col max-w-[100%]">
          <span class="meta" style="display: inline"></span>
          <div class="">
            <div class="flex justify-end">
              <div class="flex space-x-2 ">
                <a
                
                  class="bg-[#e2e2e3] p-1 rounded visited:bg-[#10C0CB]"
                  @click="setFilterStatus('All') "
                  ><span class="mx-4 cursor-pointer"> All</span></a
                >
                <a
                  
                  class="bg-[#e2e2e3] rounded p-1 visited:bg-[#10C0CB]"
                  @click="setFilterStatus('Draft')"
                  ><span class="mx-2 cursor-pointer"> Draft</span></a
                >
                <a
                 
                  class="bg-[#e2e2e3] rounded p-1 visited:bg-[#10C0CB]"
                  @click="setFilterStatus('Paid')"
                  ><span class="mx-3 cursor-pointer"> Paid</span></a
                >
                <a
               
                  class="bg-[#e2e2e3] rounded p-1 visited:bg-[#10C0CB]"
                  @click="setFilterStatus('Unpaid')"
                  ><span class="mx-1 cursor-pointer"> Unpaid</span></a
                >
              </div>
            </div>
          </div>
          <div class="flex justify-end my-4">
            <!-- Filter by Invoice No -->
            <a-input
              v-model:value="invoiceNumberFilter"
              placeholder="Invoice No"
              style="width: 150px; margin-right: 8px"
            /><a-input
              v-model:value="nameFilter"
              placeholder="Sender Name"
              style="width: 150px; margin-right: 8px"
            />
            
            <!-- Filter button -->
            <a-button type="primary" @click="handleFilter" class="bg-[#10C0CB]"
              >Filter</a-button
            >
          </div>
          <a-table
            :loading="isLoading"
            :dataSource="filteredInfo || filteredData || sortedInvoices "
            :columns="columns"
            :customRow="customRow"
          >
            <template #status="{ text, record }" >
              <div ><span class="justify-center items-center flex" :class="getStatusClass(record.paymentStatus)">
                {{ text }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

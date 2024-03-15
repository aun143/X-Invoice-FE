<script setup>
import { ref, watch, computed, onMounted, watchEffect,onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import Button from "../components/Button.vue";
import Client from "./Client.vue";
import { Colors } from "../utils/color";
// import Modal from "../components/Modal.vue";
import { getAllClient } from "../service/ClientService";
// import InvoiceService from "../service/InvoiceService";
import { getUserDetailsApi } from "../service/LoginService";
import Swal from "sweetalert2";
import { notification } from "ant-design-vue";
import { postInvoiceData } from "../service/MainService";
import { BASE_URL } from "../utils/config";
import { uploadImage } from "../service/UploadImage";
// import {  Input } from "ant-design-vue";

const date = ref("");
const { getDate, setDate } = useInvoiceStore();
// watchEffect(() => {
//   setDate(date.value); // Update the store when the value changes in the component
// });

const route = useRoute();
const router = useRouter();
const invoiceId = route.params.id;
const invoice = useInvoiceStore();
const isLoadingImg = ref(false);
// watchEffect(() => {
//   const unwatch = watch(invoice.formData, (newValue, oldValue) => {
//     if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
//       invoice.updateFormData(newValue);
//     }
//   }, { deep: true });

//   // Cleanup function to stop watching when component is unmounted
//   // onUnmounted(unwatch);
// });

const invoiceSubmit = async () => {
  // if (isLoadingImg.value) {
  //   openNotificationWithIcon("error", "Please wait To Upload Image First");
  //   return;
  // }
  try {
    isLoading.value = true;

    if (!validateForm()) return;
    if (!validateDueDate()) {
      return;
    }
    const { success, data, error } = await postInvoiceData(invoice.formData);

if (success) {
  router.push("/");
    invoice.resetFormData();
  Swal.fire({
    icon: "success",
    title: "Invoice Created",
    text: data.message || "Invoice has been Created successfully.",
  });
} else {
  console.error("Error During Invoice Creation:", error);
  Swal.fire({
    icon: "error",
    title: "Error During Invoice Creation",
    text: error || "An error occurred while Creating the Invoice.",
  });
  if (error === "Your subscription plan has expired. Please update your plan.") {
    router.push("/subscription");
  } else {
    openNotificationWithIcon("error", error);
  }
}
} catch (error) {
console.error("Error During Invoice Creation:", error);
openNotificationWithIcon("error", "An error occurred while Creating the Invoice.");
} finally {
isLoading.value = false;
}
};
const open = ref(false);
const showModal = () => {
  open.value = true;
};

const validateForm = () => {
  const emptyFields = [];

  if (!invoice.formData.sender) {
    emptyFields.push("Sender");
  }
  if (!invoice.formData.invoiceNumber) {
    emptyFields.push("Invoice Number");
  }
  if (!invoice.formData.receiver) {
    emptyFields.push("Receiver");
  }
  if (!invoice.formData.invoiceName) {
    emptyFields.push("Invoice Name");
  }
  if (!invoice.formData.description) {
    emptyFields.push("Description");
  }
  // if (!invoice.formData.date) {
  //   emptyFields.push("Date");
  // }
  if (!invoice.formData.invoiceDueDate) {
    emptyFields.push("Invoice Due Date");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: ${emptyFields.join(
      ", "
    )}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const calculateAmount = (item) => {
  // Calculate the amount
  const amount = item.quantity * item.rate;
  // Update the item's amount property
  item.amount = amount;
  // Return the calculated amount
  return amount;
};
// const modalActive = ref(false);
// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };
//console.log("invoice",invoice)
const dropdownTitle = "Save";
const dropdownItems = [
  { title: "Save", link: "/" },
  { title: "Save & Send", link: "#" },
  { title: "Save & Mark Send", link: "#" },
];
const handleUnitChange = (index, selectedUnit) => {
  invoice.formData.items[index].unit = selectedUnit;
};
const draggedIndex = ref(null);
const handleDragStart = (index) => {
  draggedIndex.value = index;
};

const handleDragOver = (index) => {
  // Prevent the default behavior to allow dropping
  event.preventDefault();
  const draggedOverIndex = index;
  if (draggedOverIndex !== draggedIndex.value) {
    // Swap the items in the array
    const tempItem = invoice.formData.items[draggedOverIndex];
    invoice.formData.items[draggedOverIndex] =
      invoice.formData.items[draggedIndex.value];
    invoice.formData.items[draggedIndex.value] = tempItem;
    draggedIndex.value = draggedOverIndex;
  }
};
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3,
  });
};

const fontSize = "12px";
const handleDrop = (index) => {
  // Prevent the default behavior
  event.preventDefault();
};
const filteredClients = computed(() => {
  if (filterStatus.value === "All") {
    return clients.value;
  } else {
    return clients.value.filter(
      (client) => client.paymentStatus === filterStatus.value
    );
  }
});

const handleDragEnd = () => {
  draggedIndex.value = null;
};
const logoInputRef = ref(null);
const handleFileInputChange = async () => {
  const file = logoInputRef.value.files[0];
  if (file) {
    try {
      // isLoadingImg.value = true;
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        // Call displayImage to update the image preview
        displayImage(logoInputRef.value, imageUrl);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      // isLoadingImg.value = false;
    }
  }
};
const currentDate = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  console.log("date", `${month}/${day}/${year}`);
  return `${month}/${day}/${year}`;
});

const displayImage = (input, imageUrl) => {
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Update formData with the image URL
      invoice.formData.url = imageUrl; // Update formData with the image URL
      console.log("invoice.formData.url", invoice.formData.url);
      // Display the image using the URL
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = imageUrl;
    };

    reader.readAsDataURL(file);
  } else {
    // Handle the case when no file is selected
    console.error("No file selected");
  }
};

const deleteItem = (index) => {
  if (invoice.formData.items.length > 1) {
    invoice.formData.items.splice(index, 1);
  } else {
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Cannot Delete Item',
    //   text: 'At least one item must remain in the invoice.',
    //   footer: 'Please make sure there is at least Two item before deleting.'
    // });
    openNotificationWithIcon("error", "Cannot Delete All Items");
  }
};

// const dropdownOpen = ref(new Array(invoice.formData.items.length).fill(true).map(() => ref(true)));

const addMoreItem = () => {
  invoice.addMoreItem();
};

const getSubtotal = () => {
  return invoice.getSubtotal();
};

const getTotal = () => {
  return invoice.getTotal();
};
// const changeUnpaidStatus = async () => {
//   try {
//     console.log("Changing status for invoiceId:", invoiceId);
//     const unpaidStatus = await invoiceService.updateUnpaidInvoiceStatus(invoiceId);
//     console.log("Status updated successfully:", unpaidStatus);
//   } catch (error) {
//     console.error("Error updating invoice status:", error);
//   }
// };

const handleSaveDraftButtonClick = async () => {
  try {
    invoiceSubmit();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error Submitting Invoice:", error),
      footer: "Please try again ",
    });
    console.error("Error Submitting Invoice:", error);
  }
};
const handleDropdownItemClick = (clickedItem) => {
  if (clickedItem.title === "Save") {
    invoiceSubmit();
    // changeUnpaidStatus(invoiceId);
  } else if (clickedItem.title === "Save & Send") {
    invoiceSubmit();
    router.push(`/GetInvoice/${invoiceId}/send`);
  } else if (clickedItem.title === "Save & Mark Send") {
    invoiceSubmit();
  }
};
const isLoading = ref(false);
const filterStatus = ref("All");
const client = ref([]);
const clients = ref([]);
const profile = ref({});
const BusinessProfile = async () => {
  try {
    invoice.resetFormData();

    // const invoice=useInvoiceStore();
    isLoading.value = true;
    const UserId = localStorage.getItem("UserId");
    if (UserId) {
      const userProfileData = await getUserDetailsApi(UserId);
      //console.log("userProfileType >>>", invoice.selectedProfileType);
      if (invoice.selectedProfileType === "individual") {
        const individualData = userProfileData.individualProfile;
        console.log("object",individualData)
        // Update specific fields of sender without overwriting it
        Object.assign(invoice.formData.sender, individualData);
        //console.log("individualData<", individualData);
      } else if (invoice.selectedProfileType === "organization") {
        const organizationData = userProfileData.organizationProfile;
        // Update specific fields of sender without overwriting it
        Object.assign(invoice.formData.sender, organizationData);
        //console.log("invoice sender<><><", organizationData);
      }
    } else {
      router.push("/login");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error Submitting Invoice:", error),
      footer: "Please try again ",
    });
    console.error("Error getting account in Invoice", error);
  } finally {
    isLoading.value = false;
  }
};
const ClientProfile=async ()=>{
  try {
    invoice.resetFormData();

    isLoading.value = true;
    const result = await getAllClient();
    if (result && result.data) {
      clients.value = result.data;
    } else {
      throw new Error("No data received from server");
    }
  } catch (error) {
    console.error("Error fetching Clients:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error fetching Clients: " + error.message,
      footer: "Please try again",
    });
  } finally {
    isLoading.value = false; // Set isLoading back to false after fetching data
  }
}
onMounted(async () => {
  invoice.formData.date = currentDate.value;
  BusinessProfile();
  ClientProfile();
});

const invoiceName = ref("");
const upcomingDueDate = ref(new Date());
const formattedDueDate = computed(() => {
  if (invoice.formData.invoiceDue instanceof Date) {
    const upcomingDueDate = invoice.formData.invoiceDue;
    return `${upcomingDueDate.getDate()}-${
      upcomingDueDate.getMonth() + 1
    }-${upcomingDueDate.getFullYear()}`;
  }
  return null;
});

// const calculateUpcomingDueDate = () => {
//   const selectedDueDate = invoice.formData.invoiceDueDate;
//   if (selectedDueDate) {
//     const currentDate = new Date(invoice.formData.date);
//     const upcomingDate = new Date(currentDate);
//     upcomingDate.setDate(currentDate.getDate() + parseInt(selectedDueDate));
//     // Check if upcomingDate is a valid date object
//     if (!isNaN(upcomingDate.getTime())) {
//  const formattedDate = upcomingDate.toLocaleDateString('en-GB', {  year: 'numeric' , month: '2-digit',day: '2-digit'});
// invoice.formData.invoiceDueDate=formattedDate;
// console.log("upcomingDate", formattedDate);
//     } else {
//       alert("Invalid upcoming date:", invoice.formData.invoiceDueDate);
//     }
//   } else {
//     upcomingDueDate.value = null;
//   }
// };
const validateDueDate = () => {
  const invoiceDate = new Date(invoice.formData.date); // Get formData.date

  // Check if formData.date is provided
  if (!invoiceDate || isNaN(invoiceDate.getTime())) {
    openNotificationWithIcon("error", "Please select an invoice date first");
    return false;
  }

  const dueDate = new Date(invoice.formData.invoiceDueDate);

  // Check if due date is before the invoice date or is more than 60 days ahead
  if (dueDate < invoiceDate) {
    openNotificationWithIcon(
      "error",
      "Invoice due date cannot be before the invoice date"
    );
    return false;
  }

  const maxDueDate = new Date(invoiceDate); // Set maxDueDate as a copy of invoiceDate
  maxDueDate.setDate(maxDueDate.getDate() + 60);

  // Check if due date is more than 60 days in the future relative to invoice date
  if (dueDate > maxDueDate) {
    openNotificationWithIcon(
      "error",
      "Invoice due date cannot be more than 60 days in the future"
    );
    return false;
  }

  return true; // Due date is valid
};

// const formatDate = (date) => {
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear();
//   return `${year}/${month}/${day}`;
// };
const profileType = ref(invoice.selectedProfileType);


const switchProfileType = (type) => {
  invoice.selectProfileType(type);
  profileType.value = type;
  BusinessProfile();
};
</script>

<template>
  <div class="bg-gray-100">
    <div class="bg-white">
      <Header
        headerTitle="New Invoice"
        backButtonText=" &nbsp &lt  Invoices &nbsp  &nbsp "
        backRoute="Index"
        :dropdownItems="dropdownItems"
        :dropdownTitle="dropdownTitle"
        saveButtonText="Save"
        saveDraftButtonText=" Save Draft"
        :saveDraftButtonColor="Colors.orange"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="false"
        :onDropdownItemClick="handleDropdownItemClick"
        :showBackButton="false"
      />
    </div>

    <!-- <form @submit.prevent class="container mt-6 ml-6 bg-white max-w-[1000px]  p-6"> -->
    <form
      @submit.prevent
      class=""
    >
     
      <div class="container ">
        <div class="">
          <div class="mt-4 text-left">
            <div
              v-if="isLoading"
              class="flex justify-center flex-col items-center"
            >
              <a-space class="w-full">
                <a-spin size="large" />
              </a-space>
            </div>
            <div v-else>
              <div class="flex w-full">
                <p><span class="text-[#ff0000] ml-2">*</span>From:</p>
                <p class="justify-end flex w-full text-left">
                  <button
                    @click="switchProfileType('individual')"
                    v-if="profileType === 'organization'"
                    class="text-[#10C0CB]"
                  >
                    Switch to Individual
                  </button>
                  <button
                    @click="switchProfileType('organization')"
                    v-if="profileType === 'individual'"
                    class="text-[#10C0CB]"
                  >
                    Switch to Organization
                  </button>
                </p>
              </div>
              <div class="ml-2 border rounded-lg">
                <div
                  v-if="invoice.selectedProfileType === 'individual'"
                  class=" pl-2 border-gray-100 rounded-2"
                >
                  <!-- <span class="ml-2">{{ invoice.formData.sender.profileType }}</span><br> -->
                  <p class="">
                    <span class="">
                      Selected Profile Type:
                      {{ invoice.formData.sender.profileType }} </span
                    ><br />
                    <span v-if="invoice.formData.sender.firstName"
                      >{{ invoice.formData.sender.firstName }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.lastName">{{
                      invoice.formData.sender.lastName
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.address1"
                      >{{ invoice.formData.sender.address1 }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.address2">{{
                      invoice.formData.sender.address2
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.postalCode"
                      >{{ invoice.formData.sender.postalCode }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.city">{{
                      invoice.formData.sender.city
                    }}</span>
                    <span v-if="invoice.formData.sender.state">{{
                      invoice.formData.sender.state
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.email">{{
                      invoice.formData.sender.email
                    }}</span
                    ><br />
                  </p>
                </div>
                <div
                  v-if="invoice.selectedProfileType === 'organization'"
                  class=" pl-2 border-gray-300 rounded-2"
                >
                  <p class="">
                    <span class="">
                      Selected Profile Type:
                      {{ invoice.formData.sender.profileType }} </span
                    ><br />

                    <span v-if="invoice.formData.sender.organizationName"
                      >{{
                        invoice.formData.sender.organizationName
                      }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.firstName"
                      >{{ invoice.formData.sender.firstName }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.lastName">{{
                      invoice.formData.sender.lastName
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.address1"
                      >{{ invoice.formData.sender.address1 }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.address2">{{
                      invoice.formData.sender.address2
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.postalCode"
                      >{{ invoice.formData.sender.postalCode }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.sender.city">{{
                      invoice.formData.sender.city
                    }}</span>
                    <span v-if="invoice.formData.sender.state">{{
                      invoice.formData.sender.state
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.sender.email">{{
                      invoice.formData.sender.email
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end mt-4 ml-auto">
          <div class="flex items-end mb-2">
            <div>
              <p class="w-4/5 mb-0 ml-3 text-start">Date</p>
              <a-input
                type="Date"
                v-model:value="invoice.formData.date"
                class="ml-2 w-[200px]"
              />
            </div>
          </div>
          <div class="flex items-end mb-2">
            <div>
              <p class="w-4/5 ml-2 text-start" ml-2 text-start>
                <span class="text-[#ff0000]">*</span>Invoice Due
              </p>
              <a-input
                type="Date"
                v-model:value="invoice.formData.invoiceDueDate"
                class="ml-2 w-[200px]"
              />
            </div>
          </div>

          <div class="flex items-end">
            <div>
              <p class="w-3/3 mb-0 ml-4 text-start">Purchase Order Number</p>
              <a-input-number
                v-model:value="invoice.formData.purchaseOrderNumber"
                class="ml-2 w-[200px]"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <hr />
    </form>
  </div>
</template>

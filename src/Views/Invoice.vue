<script setup>
import { ref, watch, computed, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import Button from "../components/Button.vue";
import Client from "./Client.vue";
import { Colors } from "../utils/color";
import { updateInvoiceStatus } from "../service/invoiceService";
import { getAllClient } from "../service/ClientService";
// import InvoiceService from "../service/InvoiceService";
import { getUserDetailsApi } from "../service/LoginService";
import { notification } from "ant-design-vue";
import { postInvoiceData } from "../service/MainService";
import { uploadImage } from "../service/UploadImage";
const route = useRoute();
const router = useRouter();
const invoice = useInvoiceStore();
const isLoadingImg = ref(false);
const isLoader = ref(false);
watchEffect(() => {
  const unwatch = watch(
    invoice.formData,
    (newValue, oldValue) => {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        invoice.updateFormData(newValue);
      }
    },
    { deep: true }
  );
});

const invoiceSubmit = async () => {
  if (isLoadingImg.value) {
    openNotificationWithIcon("error", "Please wait To Upload Image First");
    return;
  }
  try {
    isLoader.value = true;

    if (!validateForm()) return;
    if (!validateDueDate()) {
      return;
    }
    const { success, data, error } = await postInvoiceData(invoice.formData);
    if (success) {
      //console.log('Invoice submitted successfully:', response);
      invoice.resetFormData();
      openNotificationWithIcon("success", data.message || "Invoice has been Created successfully.")

      return data._id; // Return the ID of the created invoice
    } else {
      openNotificationWithIcon(
        "error",
        error || "An error occurred while creating the invoice"
      );
      return null; // Return null indicating failure
    }
  } catch (error) {
    openNotificationWithIcon("error", error || "An error occurred while creating the invoice.")

    console.error("Error During Invoice creation:", error);
  } finally {
    isLoader.value = false;
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
const dropdownItems = [
  { title: "Save", link: "/Index" },
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
      isLoadingImg.value = true;
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
      isLoadingImg.value = false;
    }
  }
};
const currentDate = ref(new Date().toISOString().slice(0, 10));
invoice.formData.date = currentDate.value;
watchEffect(() => {
  invoice.formData.date = currentDate.value;
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
    openNotificationWithIcon("error", "Cannot Delete All Items");
  }
};
const addMoreItem = () => {
  invoice.addMoreItem();
};
const SubTotal = computed(() => {
  let subtotal = 0;
  invoice.formData.items.forEach((item) => {
    subtotal += item.amount;
  });
  return subtotal;
});
watch(SubTotal, (newSubtotal, oldSubtotal) => {
  invoice.formData.subtotal = newSubtotal;
});
const Total = computed(() => {
  let total = 0;
  invoice.formData.items.forEach((item) => {
    total += item.amount;
  });
  return total;
});
watch(Total, (newTotal, oldtotal) => {
  invoice.formData.total = newTotal;
});
const handleSaveDraftButtonClick = async () => {
  try {
    const invoiceId = await invoiceSubmit();
    if (invoiceId) {
      router.push("/Index");
    }
  } catch (error) {
       console.error("Error Submitting Invoice:", error);
  }
};
const invoiceID = ref("");
const handleDropdownItemClick = async (clickedItem) => {
  if (clickedItem.title === "Save") {
    try {
      const invoiceId = await invoiceSubmit();
      if (invoiceId) {
        router.push(`/GetInvoice/${invoiceId}`);
      }
    } catch (error) {
            console.error("Error Submitting Invoice:", error);
    }
  } else if (clickedItem.title === "Save & Send") {
    try {
      const invoiceId = await invoiceSubmit();
      if (invoiceId) {
        router.push(`/GetInvoice/${invoiceId}/send`);
      }
    } catch (error) {
      console.error("Error Submitting Invoice:", error);
    }
  } else if (clickedItem.title === "Save & Mark Send") {
    try {
      invoiceID.value = await invoiceSubmit();
      console.log("invoiceId", invoiceID.value);
      if (invoiceID.value) {
        changeStatus(invoiceID.value);
      }
    } catch (error) {
      console.error("Error Submitting Invoice:", error);
    }
  }
};
const changeStatus = async () => {
  try {
    isLoading.value = true;
    //console.log("Changing status for invoiceId:", invoiceId);
    const updateData = {
      paymentStatus: "Paid",
    };
    const { success, data, error } = await updateInvoiceStatus(
      invoiceID.value,
      updateData
    );

    if (success) {
      router.push("/Index");
      openNotificationWithIcon("success", data.message || "Payment Method has been Updated successfully.")

    } else {
      console.error("Error During Payment Method updation:", error);
      openNotificationWithIcon("error", error || "error During Payment Method  Updation.")

      if (error === "Maximum invoices limit reached for the user") {
        router.push("/subscription");
      } else {
        openNotificationWithIcon("error", error);
      }
    }
  } catch (error) {
    console.error("Error During Payment Method Updation:", error);
    openNotificationWithIcon(
      "error",
      "An error occurred while updating the Payment Method."
    );
  } finally {
    isLoading.value = false;
  }
};
const isLoading = ref(false);
const filterStatus = ref("All");
const clients = ref([]);
const BusinessProfile = async () => {
  try {
    invoice.resetFormData();
    // const invoice=useInvoiceStore();
    isLoading.value = true;
    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const userProfileData = await getUserDetailsApi(UserId);
      invoice.userProfileData.userRole = userProfileData.userRole;
      //console.log("userProfileType >>>", invoice.selectedProfileType);
      if (invoice.selectedProfileType === "individual") {
        const individualData = userProfileData.individualProfile;
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
    openNotificationWithIcon("error", error || "error During fetching Business Profile.")

    console.error("Error getting account in Invoice", error);
  } finally {
    isLoading.value = false;
  }
};
const ClientProfile = async () => {
  try {
    invoice.resetFormData();

    isLoading.value = true;
    const result = await getAllClient();
    if (result && result.data.data) {
      clients.value = result.data.data;
    } else {
      throw new Error("No data received from server");
    }
  } catch (error) {
    console.error("Error fetching Clients:", error);
    openNotificationWithIcon("error", error || "error During fetching Client.")

  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  BusinessProfile();
  ClientProfile();
});
const validateDueDate = () => {
  const invoiceDate = new Date(invoice.formData.date);
  if (!invoiceDate || isNaN(invoiceDate.getTime())) {
    openNotificationWithIcon("error", "Please select an invoice date first");
    return false;
  }
  const dueDate = new Date(invoice.formData.invoiceDueDate);
  if (dueDate < invoiceDate) {
    openNotificationWithIcon(
      "error",
      "Invoice due date cannot be before the invoice date"
    );
    return false;
  }
  const maxDueDate = new Date(invoiceDate);
  maxDueDate.setDate(maxDueDate.getDate() + 60);
  if (dueDate > maxDueDate) {
    openNotificationWithIcon(
      "error",
      "Invoice due date cannot be more than 60 days in the future"
    );
    return false;
  }
  return true;
};
const profileType = ref(invoice.selectedProfileType);
const switchProfileType = (type) => {
  invoice.selectProfileType(type);
  profileType.value = type;
  BusinessProfile();
};
const showOptions = ref(false);
const filterOptions = (event) => {
  const input = event.target.value.trim().toLowerCase();
  filteredOptions.value =
    input === ""
      ? []
      : clients.value.filter((client) => {
          const fullName =
            `${client.firstName} ${client.lastName}`.toLowerCase();
          return fullName.includes(input);
        });
};
const emptyReciever = () => {
  invoice.formData.receiver = "";
};
const filteredOptions = ref(clients.value);

const selectOption = (client,event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log("Selected clien:", client);
  invoice.formData.receiver = client;
  hideDropdown();
};
const showDropdown = () => {
  showOptions.value = true;
  console.log("Selected clients:", showOptions.value);
};
const hideDropdown = () => {
  setTimeout(() => {
    showOptions.value = false;
    console.log(" client:", showOptions.value);
  }, 100);
};
</script>

<template>
  <div >
    <div class="bg-white sticky-header">
      <Header
        headerTitle="New Invoice"
        :isLoader="isLoader"
        backButtonText=" &nbsp &lt  Invoices &nbsp  &nbsp "
        backRoute="Index"
        saveButtonText="Save"
        :dropdownItems="dropdownItems"
        dropdownTitle="Save"
        :onDropdownItemClick="handleDropdownItemClick"
        saveDraftButtonText=" Save Draft"
        :saveDraftButtonColor="Colors.draft"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="true"
        :showBackButton="false"
      />
    </div>
<div class="bg-gray-200 h-[max-content] p-4">
    <form
      @submit.prevent
      class="container  bg-white w-[50%] md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[50%] p-6"
    >
      <div class="container">
        <div class="flex justify-between">
          <div class="flex flex-col space-y-5 w-1/2s sm:flex">
            <div class=" ">
              <div class="mt-2 text-2xl ml-2 text-left flex">
                <span
                  class="mr-6 bg-[#bababa] text-[12px] h-8 text-white px-3 rounded"
                  >Draft</span
                >
                <a-input
                  v-model:value="invoice.formData.invoiceName"
                  class="w-[250px] h-12 text-left text-[15px]"
                  type="text"
                  placeholder="Invoice Name"
                />
              </div>
            </div>
            <div>
              <div class="flex">
                <span class="text-[#ff0000] mr-1">*</span>
                <a-textarea
                  v-model:value="invoice.formData.description"
                  placeholder="Enter Brief Description "
                  name=""
                  id=""
                  cols="60"
                  row="2"
                ></a-textarea>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-1/2 items-end">
            <label for="logoInput" class="">
              <div
                class="logo-placeholder hover:border-dashed border-none cursor-pointer rounded md:w-28 lg:w-48 h-32 border-2 grid place-items-center text-slate-500 text-5xl"
              >
                <div v-if="isLoadingImg"><a-spin size="large" /></div>
                <img
                  v-else
                  id="imagePreview"
                  src="https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png"
                  class="logo w-32 rounded"
                  alt="Logo"
                />
              </div>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                class=""
                style="display: none"
                @change="handleFileInputChange"
                ref="logoInputRef"
              />
            </label>
          </div>
        </div>
        <div class="mt-10 lg:mt-10 md:mt-2 flex w-full">
          <div class="">
            <p class="ml-auto mr-16 font-medium text-[14px]">
              <span class="text-[#ff0000]">*</span>Invoice No.
            </p>
            <a-input-number
              required
              type="number"
              v-model:value="invoice.formData.invoiceNumber"
              class="ml-2 w-full"
            />
          </div>
          <div class="flex items-end justify-end w-full">
            <div class="">
              <p class="text-left ml-4 font-medium text-[14px]">Language</p>
              <a-select
                size="medium"
                v-model:value="invoice.formData.language"
                class="ml-2 lg:w-[200px] w-[150px] md:w-[130px]"
                style="text-align: left"
              >
                <a-select-option
                  v-for="language in invoice.languageOptions"
                  :key="language.value"
                >
                  {{ language.label }}
                </a-select-option>
              </a-select>
            </div>
            <div>
              <p class="text-left ml-4 font-medium text-[14px]">Currency</p>
              <a-select
                size="medium"
                v-model:value="invoice.formData.currency"
                class="ml-2 lg:w-[200px] w-[200px] md:w-[170px]"
                style="text-align: left"
              >
                <a-select-option
                  v-for="currency in invoice.currencyOptions"
                  :key="currency.value"
                  :value="currency.value"
                >
                  {{ currency.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <br />
        <hr />
      </div>
      <div class="container flex my-4">
        <div class="flex-left lg:w-[45%] md:w-[50%] justify-center">
          <div class="mt-4 text-left">
            <div>
              <div class="grid md:flex md:flex-row lg:grid-cols-5 w-full">
                <div
                  class="font-medium text-[14px] col-span-2 w-full justify-start"
                >
                  <span class="text-[#ff0000] ml-2">*</span>Billed From:
                </div>
                <div class="justify-end col-span-3 w-full text-right">
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
                </div>
              </div>
              <div
                v-if="isLoading"
                class="flex justify-center flex-col items-center"
              >
                <a-space class="w-full">
                  <a-spin size="large" />
                </a-space>
              </div>
              <div class="ml-2 my-1 border rounded-lg" v-else>
                <div
                  v-if="invoice.selectedProfileType === 'individual'"
                  class="pl-2 border-gray-100 rounded-2"
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
                  class="pl-2 border-gray-300 rounded-2"
                >
                  <p class="">
                    <span class="">
                      Selected Profile Type:
                      {{ invoice.formData.sender.profileType }} </span
                    ><br />

                    <span v-if="invoice.formData.sender.organizationName"
                      >{{ invoice.formData.sender.organizationName }}<br
                    /></span>
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
                    <span v-if="invoice.formData.sender.city"
                      >{{ invoice.formData.sender.city }}&nbsp;</span
                    >
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
            <div class="flex mt-4 my-1">
              <div
                class="ml-2 justify-start flex w-full font-medium text-start text-[14px]"
              >
                <span class="text-[#ff0000]">*</span>Bill To:
              </div>
              <div class="justify-end flex w-full text-left">
                <!-- <div  @click="toggleModal" class="">New Client</div> -->
                <div
                  type="primary"
                  class="text-[#10C0CB] cursor-pointer"
                  @click="showModal"
                >
                  New Client
                </div>
                <div class="home">
                  <a-modal
                    v-model:open="open"
                    width="100%"
                    class="max-w-[100%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] 2xl:max-w-[50%]"
                  >
                    <Client  :showHeader="true" :width="true" :createButton="true" />
                  </a-modal>
                </div>
              </div>
            </div>
            <div class="flex ml-2 border relative px-2 rounded-lg" v-if="invoice.formData.receiver">
              <span class="absolute right-2 text-red-600 hover:text-red-400 cursor-pointer text" @click="emptyReciever">X</span>
              <div class="borde rounded-lg">
                <span v-if="invoice.formData.receiver.firstName" class="mr-2">{{
                      invoice.formData.receiver.firstName
                    }}</span> 
                    <span v-if="invoice.formData.receiver.lastName">{{
                      invoice.formData.receiver.lastName
                    }}</span>
                <br />
                    <span v-if="invoice.formData.receiver.address1"
                      >{{ invoice.formData.receiver.address1 }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.receiver.address2">{{
                      invoice.formData.receiver.address2
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.receiver.postalCode"
                      >{{ invoice.formData.receiver.postalCode }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.receiver.city"
                      >{{ invoice.formData.receiver.city }}&nbsp;</span
                    >
                    <span v-if="invoice.formData.receiver.state">{{
                      invoice.formData.receiver.state
                    }}</span
                    ><br />
                    <span v-if="invoice.formData.receiver.email">{{
                      invoice.formData.receiver.email
                    }}</span>
              </div>
              
            </div>
            <div class="relative ml-2" v-else-if="!invoice.formData.receiver">
              <a-input
              readonly
                v-model:value="invoice.formData.receiver"
                @focus="showDropdown"
                @blur="hideDropdown"
                @input="filterOptions"
                placeholder="Select Client"
                class="w-full"
              />
              <ul
                v-show="showOptions"
                class="dropdown absolute border rounded mt-2 overflow-y-auto w-full max-h-44 flex gap-2 flex-col bg-white text-left"
              >
                <li
                  v-for="client in filteredClients"
                  :key="client._id"
                  @click="selectOption(client,$event)"
                  class="ml-2"
                >
                  {{ client.firstName }} {{ client.lastName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end mt-1 ml-auto">
          <div class="flex items-end mb-2">
            <div>
              <p
                class="w-4/5 mb-0 ml-1 py-1 text-start font-medium text-[14px]"
              >
                <span class="text-[#ff0000]">*</span>Date
              </p>
              <a-input
                type="Date"
                v-model:value="invoice.formData.date"
                class="ml-2 w-[200px]"
              />
            </div>
          </div>
          <div class="flex items-end mb-2">
            <div>
              <p class="w-4/5 ml-2 text-start py-1 font-medium text-[14px]">
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
              <p
                class="w-3/3 mb-0 ml-3 py-1 text-start font-medium text-[14px]"
              >
                Purchase Order Number
              </p>
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
      <div class="">
        <table class="table-auto w-full my-4">
          <tr class="text-left text-black">
            <th class="align-top md:hidden lg:block"></th>
            <th class="p-2 w-1/2 align-top">Description</th>
            <th class="p-2 align-top text-right">Quantity</th>
            <th class="p-2 align-top text-right">
              <span class="ml-4">Rate</span>
            </th>
            <th class="p-2 w-[150px] text-right align-top">
              <span class="ml-4">Amount</span>
            </th>
            <th class="p-2 w-[30px] text-right align-top">Options</th>
          </tr>

          <tr
            v-for="(item, index) in invoice.formData.items"
            :key="index"
            draggable="true"
            :ButtonColor="Colors.orange"
            @dragstart="handleDragStart(index)"
            @dragover="handleDragOver(index)"
            @drop="handleDrop(index)"
            @dragend="handleDragEnd"
            class=""
          >
            <td class="align-top md:hidden lg:block">
              <div class=""></div>
              <svg
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="cursor-move"
                style="width: 20px; height: 20px; margin-right: 10px"
              >
                <path
                  d="M5 3H3v2h2V3zm14 4h2v6h-2V9H9v10h4v2H7V7h12zM7 3h2v2H7V3zM5 7H3v2h2V7zm-2 4h2v2H3v-2zm2 4H3v2h2v-2zm6-12h2v2h-2V3zm6 0h-2v2h2V3zm-2 14v-2h6v2h-2v2h-2v2h-2v-4zm4 2v2h2v-2h-2z"
                  fill="currentColor"
                />
              </svg>
            </td>

            <td class="align-top">
              <a-textarea
                v-model:value="item.description"
                name=""
                id=""
                cols="50"
              ></a-textarea>
            </td>
            <td class="align-top">
              <a-input-number
                v-model:value="item.quantity"
                class="w-full mx-2"
                type="number"
                placeholder="0"
              />
            </td>
            <td class="align-top">
              <a-input-number
                v-model:value="item.rate"
                class="w-full mx-4"
                type="number"
                placeholder="0"
              />
              <a-select
                size="medium"
                v-model:value="item.unit"
                class="mt-1 mb-2 text-left flex ml-6"
                @change="() => handleUnitChange(index, item.unit)"
              >
                <a-select-option
                  v-for="unit in invoice.unitOptions"
                  :key="unit.value"
                  :value="unit.value"
                  class=""
                >
                  {{ unit.value }}
                </a-select-option>
              </a-select>
            </td>
            <td class="align-top">
              <!-- <a-textarea v-model:value="item.amount" readonly class="" cols="10" rows="1" placeholder="Amount" >{{ item.quantity * item.rate }}</a-textarea> -->
              <a-input-number
                readonly
                v-model:value="item.amount"
                class="w-24 ml-6"
                type="number"
                placeholder="0"
              />

              <div readonly class="hidden ml-12">
                {{ (item.amount = item.quantity * item.rate) }}
              </div>
            </td>
            <td class="align-top">
              <a-button
                @click="deleteItem(index)"
                class="border relative border-gray-300 bg-[#f3f3f4]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M20 7v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7H2V5h20v2h-2zM6 7v13h12V7H6zm5 2h2v2h-2V9zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zM7 2h10v2H7V2z"
                    />
                  </g>
                </svg>
              </a-button>
              <!-- <ul v-if="dropdownOpen[index]" class="absolute flex justify-center flex-col bg-white gap-5 p-2 border items-center">
        <li @click="deleteItem(index)" class="cursor-pointer">Delete</li>
        <li @click="saveItem(index)" class="cursor-pointer">Save Item</li>
      </ul> -->
            </td>
          </tr>
        </table>
        <hr class="mb-2" />

        <div style="text-align: left; margin-left: 10px" class="w-[50%]">
          <Button
            :bgColor="Colors.addMore"
            :textColor="Colors.white"
            :fontSize="fontSize"
            buttonText="New Line"
            class=""
            @click="addMoreItem()"
          />
        </div>
        <div class="flex justify-between items-center">
          <div class="flex-y-5 text-right space-y-3 w-full">
            <div class="my-4">
              <span class="font-medium text-[14px]">SubTotal</span>
              <a-input
                v-model:value="SubTotal"
                readonly
                class="focus:ring-0 focus:ring-offset-0 text-right ml-2 pr-4 border-0 2xl:w-[440px] xl:w-[350px] lg:w-[230px] md:w-[200px]"
                placeholder="Subtotal"
              />
            </div>

            <div class="">
              <span class="mr-6 font-medium text-[14px]">Total</span>
              <a-input
                v-model:value="Total"
                readonly
                class="focus:ring-0 focus:ring-offset-0 text-right ml-2 pr-4 border-0 2xl:w-[440px] xl:w-[350px] lg:w-[230px] md:w-[200px]"
                placeholder="Total"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <div class="container flex my-4">
        <div class="flex-left">
          <div class="text-left space-y-3">
            <div>
              <div class="flex w-full">
                <p class="ml-1 font-medium text-[14px]">
                  Invoice Notes<a href="#">(Default Note)</a>
                </p>
              </div>
              <a-textarea
                class="border-none"
                cols="60"
                v-model:value="invoice.formData.notes"
              ></a-textarea>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  </div>
</template>

<style>
.ant-modal-footer {
  display: none !important;
}

</style>

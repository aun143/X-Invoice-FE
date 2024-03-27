<script setup>
import { ref, onMounted,computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInvoiceStore } from "../stores/index";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
import { getAllClient } from "../service/ClientService";
import  axiosInstance  from "../service/axios";
import  {sendInvoiceEmail,getInvoiceEmail}  from "../service/mail";
import { notification } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
const invoice = useInvoiceStore();
const invoiceId = ref(route.params._id);
const subject = ref("X-Invoice Email");
const isLoading = ref(false);
const isLoader = ref(false);
const clients = ref("");
const filterStatus  = ref("All");
const toEmail = ref(""); // Define reactive variable to store email address
const invoiceData = ref(null); // Define reactive variable to store invoice data

const getSingleInvoice = async (invoiceId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axiosInstance.get(
      `/invoice/getInvoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      invoiceData.value = response;
    } else {
      throw new Error(`Failed to fetch invoice with ID ${invoiceId}`);
    }
  } catch (error) {
    throw new Error(`Error in getSingleInvoice service: ${error.message}`);
  }
};

onMounted(async () => {
  ClientProfile();
  try {
    await getSingleInvoice(invoiceId.value);
    //console.log("Invoice details fetched successfully:", invoiceData.value);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  }
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
    openNotificationWithIcon("error", error.message || "error During Invoice Send.")

  } finally {
    isLoading.value = false; // Set isLoading back to false after fetching data
  }
};
function toggleCheckbox() {
  var checkbox = document.getElementById("check");
  checkbox.checked = !checkbox.checked;
}
const validateForm = () => {
  const emptyFields = [];

  if (!toEmail.value) {
    emptyFields.push("Reciever");
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
const handleSendEmailButtonClick = async () => {
  try {
    if (!validateForm()) return;
    isLoader.value=true;
    const response = await axiosInstance.post(`/email/send`, {
      to: toEmail.value,
      subject: subject.value,
      invoiceId: route.params._id,
    });

    //console.log(response.data.message);
    router.push("/");
    openNotificationWithIcon("success", data || "Email Send Successfully")

  } catch (error) {
    console.error("Error Sending email:", error);
  }finally{
    isLoader.value=false;

  }
};
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3,
  });
};
</script>
<template>
  <div>
    <Header
      headerTitle="Send Invoice"
    :isLoader="isLoader"
      saveDraftButtonText="&nbsp; Send &nbsp;"
      backButtonText="Invoice"
      backRoute="GetInvoice"
      :saveDraftButtonColor="Colors.orange"
      :onSaveDraftButtonClick="handleSendEmailButtonClick"
      :showDropdown="false"
      :showBackButton="false"
    />
    <div class="mb-4 max-w-[800px]">
      <div class="m-4 border-gray-400 border p-4">
        <div class="text-left border pl-4 w-full bg-gray-300 p-1 font-medium">
          Send Invoice
        </div>
        <div class="text-left mt-4">
          <p>To</p>
          <a-select
              size="medium"
              v-model:value="toEmail"
              class=" w-[100%] "
              :loading="isLoading"
              style="text-align: left"
            >
              <a-select-option
                v-for="client in filteredClients"
                :key="client.email"
              >
                {{ client.firstName }} {{ client.lastName }} :
                {{ client.email }} 
              </a-select-option>
            </a-select>
        </div>
        <hr class="mt-4" />
        <div class="text-left mt-4">
          <p>Subject</p>
          <a-input
            class="w-full bg-gray-300 text-black"
            v-model:value="subject"
            readonly
          />
        </div>
        <hr class="mt-4" />
        <div class="text-left mb-4">
          <p>Message</p>
          <div v-if="isLoading"><a-spin size="medium" class="w-full p-3 bg-gray-300 text-black rounded-lg border py-8"></a-spin></div>
          <div v-else
            class="w-full p-3 bg-gray-300 text-black rounded-lg border"
           >
           <p v-if="invoiceData?.invoiceNumber"> Invoice Number: {{ invoiceData?.invoiceNumber }}</p>
           <p v-if="invoiceData?.description"> Invoice Description: {{ invoiceData?.description }}</p>
           <p v-if="invoiceData?.sender.firstName"> Sender: {{ invoiceData?.sender.firstName }}&nbsp;{{ invoiceData?.sender.lastName }}</p>
           <p v-if="invoiceData?.purchaseOrderNumber"> Purchase Order Number: {{ invoiceData?.purchaseOrderNumber }}</p>
           <p v-if="invoiceData?.subtotal"> Subtotal: {{ invoiceData?.subtotal }}</p>
           <p v-if="invoiceData?.total"> Total: {{ invoiceData?.total }}</p>
           <p v-if="invoiceData?.currency"> Currency: {{ invoiceData?.currency }}</p>
           <p v-if="invoiceData?.paymentStatus"> Payment Status: {{ invoiceData?.paymentStatus }}</p>
           <p v-if="invoiceData?.date">Invoice Date: {{ invoiceData?.date }}</p>
           <p v-if="invoiceData?.paymentStatus">Invoice Due Date: {{ invoiceData?.invoiceDueDate }}</p>
        </div>
        </div>


        <!-- <div class="text-left ml-4 mb-4">
          <input type="checkbox" id="check" />
          <span
            class="ml-4 mb-4 text-lg cursor-pointer"
            @click="toggleCheckbox"
          >
            Attach Pdf copy to email
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>

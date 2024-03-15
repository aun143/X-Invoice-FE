<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import {
  updateInvoiceStatus,
  updateUnpaidInvoiceStatus,
  deleteInvoice,
  getSingleInvoice,
} from "../service/invoiceService";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
import { useInvoiceStore } from "../stores/index";
import { getSingleClient } from "../service/ClientService";
import Swal from "sweetalert2";
import { BASE_URL } from "../utils/config";

const logoPreview = ref("");
const invoice = useInvoiceStore();
const router = useRouter();
const route = useRoute();
const invoiceId = route.params._id;
const dropdownTitle = "Actions";
const clientDetails = ref({});
const dropdownItems = [
  { title: "Edit" },
  { title: "Download as Pdf" },
  { title: "Mark as Paid" },
  { title: "Mark as Unpaid" },
  { title: "Send Invoice" },
  { title: "Delete" },
];

const isLoading = ref(false);
const businessId = ref("");
const clientId = ref("");

const changeStatus = async () => {
  try {
    isLoading.value = true;
    //console.log("Changing status for invoiceId:", invoiceId);
    const updateData = {
      paymentStatus: "Paid",
    };
    const status = await updateInvoiceStatus(invoiceId, updateData);
    router.push("/");
    Swal.fire({
      icon: "success",
      title: " Invoice PaymentStatus Updated ",
      text: " Invoice PaymentStatus has been Updated successfully.",
    });
    //console.log("Status updated successfully:", status);
  } catch (error) {
    console.error("Error updating invoice status:", error);
  } finally {
    isLoading.value = false;
  }
};

const changeUnpaidStatus = async () => {
  try {
    isLoading.value = true;
    //console.log("Changing status for invoiceId:", invoiceId);
    const updateData = {
      paymentStatus: "Unpaid",
    };
    const unpaidStatus = await updateUnpaidInvoiceStatus(invoiceId, updateData);
    router.push("/");
    Swal.fire({
      icon: "success",
      title: " Invoice PaymentStatus Updated ",
      text: " Invoice PaymentStatus has been Updated successfully.",
    });
    //console.log("Status updated successfully:", unpaidStatus);
  } catch (error) {
    console.error("Error updating invoice status:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteInvoicee = async () => {
  try {
    // console.log("Changing status for invoiceId:", invoiceId);
    const status = await deleteInvoice(invoiceId);
    router.push("/");
    Swal.fire({
      icon: "success",
      title: " Invoice Deleted ",
      text: " Invoice has been Deleted successfully.",
    });
    // console.log("invoice deleted successfully:", status);
  } catch (error) {
    console.error("Error deleting invoice:", error);
  }
};
const imageUrl = computed(() => {
  return invoice.formData.url
    ? invoice.formData.url
    : "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
});
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getSingleInvoice(invoiceId);
    const invoiceDetails = response;
    businessId.value = invoiceDetails.sender._id;
    clientId.value = invoiceDetails.receiver;
    const clientResponse = await getSingleClient(clientId.value);
    clientDetails.value = clientResponse.data;

    // Update the client name in the form data
    invoice.formData.receiver = clientDetails.value;
    //console.log("invoice.formData.receiver",clientDetails.value)
    invoice.updateFormData(invoiceDetails);
    logoPreview.value = invoiceDetails.logoPreview;
    //console.log("Invoice details fetched successfully:", invoiceDetails);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleDropdownItemClickParent = (clickedItem) => {
  // Handle the dropdown item click event in the parent component
  //console.log("Clicked item in parent component:", clickedItem);

  if (clickedItem.title === "Download as Pdf") {
    // alert("Download as Pdf");
    // router.push(`/pdf/generate/${clientId.value}/${businessId.value}/${invoiceId}`);
    const url = new URL(BASE_URL);
    // url.port = "3010";
    url.pathname = "/api/pdf/X-Invoice";
    url.searchParams.append("clientId", clientId.value);
    url.searchParams.append("businessId", businessId.value);
    url.searchParams.append("invoiceId", invoiceId);
    window.open(url.toString(), "_blank");
  } else if (clickedItem.title === "Edit") {
    router.push(`/GetInvoice/${invoiceId}/edit`);
  } else if (clickedItem.title === "Mark as Paid") {
    // alert("Mark as Paid");
    changeStatus(invoiceId);
    router.push("/");
  } else if (clickedItem.title === "Delete") {
    deleteInvoicee(invoiceId);
  } else if (clickedItem.title === "Send Invoice") {
    router.push(`/GetInvoice/${invoiceId}/send`);
  } else if (clickedItem.title === "Mark as Unpaid") {
    // alert("Mark as Unpaid");
    changeUnpaidStatus(invoiceId);
    router.push("/");
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
};
</script>

<template>
  <div v-if="isLoading">
    <a-space class="w-full p-8 flex justify-center mt-[25%]">
      <a-spin size="large" />
    </a-space>
  </div>

  <div class="bg-gray-200 h-[max-content]" v-else>
    {{ invoice.formData }}

    <div class="bg-white">
      <Header
        headerTitle="View Invoice"
        backButtonText=" &nbsp &lt Invoices &nbsp  &nbsp"
        backRoute="Index"
        :dropdownTitle="dropdownTitle"
        saveDraftButtonText="Edit"
        :showDraftButton="true"
        :dropdownItems="dropdownItems"
        :saveDraftButtonColor="Colors.orange"
        :showDropdown="true"
        :onDropdownItemClick="handleDropdownItemClickParent"
      />
    </div>
    <section
      class="w-[100%] 2xl:w-[50%] md:w-[93%] lg:w-[85%] xl:w-[63%] pt-4 px-4"
    >
      <form @submit.prevent class="p-4 bg-white">
        <div class="grid grid-cols-2 items-center">
          <div class="flex w-full mt-8">
            <div
              class="flex mr-5 items-center justify-center text-xl w-[60px] max-h-12 text-black"
            >
              <span
                class="px-[15px] py-[4px] rounded"
                :class="{
                  'bg-[#10C0CB] text-white text-[12px] ':
                    invoice.formData.paymentStatus === 'Paid',
                  'bg-[#FFB74D] text-white text-[12px]':
                    invoice.formData.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white text-[12px]':
                    invoice.formData.paymentStatus === 'Draft',
                }"
              >
                {{ invoice.formData.paymentStatus }}
              </span>
            </div>
            <div class="flex mt-2">
              <strong class="text-xl">{{
                invoice.formData.invoiceName
              }}</strong>
            </div>
          </div>

          <div
            class="w-32 mt-4 lg:ml-[40%] md:ml-[20%] 2xl:ml-[30%] h-auto flex justify-end items-end"
          >
            <img :src="imageUrl" alt="Logo" />
          </div>
        </div>
        <div class="flex mb-8 mt-4">
          <div class="flex flex-col mb-2">
            <p class="font-semibold">From:</p>
            <div class="text-left">
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
            <br />
            <p class="font-semibold">To:</p>

            <div class="text-left">
              {{ clientDetails.firstName }}
              {{ clientDetails.lastName }}<br />
              {{ clientDetails.address1 }}<br />
              {{ clientDetails.postalCode }}
              {{ clientDetails.city }}<br />
              {{ clientDetails.state }}<br />
              {{ clientDetails.country }}
            </div>
          </div>
          <div
            class="flex flex-col md:ml-[10%] lg:ml-[30%] xl:ml-[38%] 2xl:ml-[45%] mt-4"
          >
            <div>
              <p class="font-semibold">Invoice No</p>
              <div class="text-left">{{ invoice.formData.invoiceNumber }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Date</p>
              <div class="text-left">{{ invoice.formData.date }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Invoice Due</p>
              <div class="text-left">{{ invoice.formData.invoiceDueDate }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Purchase order Number</p>
              <div class="text-left">
                {{ invoice.formData.purchaseOrderNumber }}
              </div>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div
          class="flex max-w-[55%] lg:flex-row 2xl:flex-row xl:flex-row flex-col px-4"
        >
          <div class="w-full md:w-[50%]">
            <div class="text-left w-full font-semibold">Description</div>
            <textarea
              v-for="(item, index) in invoice.formData.items"
              :key="index"
              disabled
              cols="50"
              class="flex"
              v-model="item.description"
            ></textarea>
          </div>
          <div class="w-full">
            <div class="flex w-full font-semibold">Quantity</div>
            <input
              v-for="(item, index) in invoice.formData.items"
              :key="index"
              disabled
              cols="60"
              class="flex mb-8"
              v-model="item.quantity"
            />
          </div>
          <div class="w-full">
            <div class="flex w-full font-semibold">Rate</div>
            <input
              v-for="(item, index) in invoice.formData.items"
              :key="index"
              disabled
              cols="60"
              class="flex mb-8"
              v-model="item.rate"
            />
            <!-- <select disabled class="w-16 mt-2">
              <option v-for="unit in item.unit" :key="unit" :value="unit">
                {{ unit.name }}
              </option>
            </select> -->
          </div>
          <div class="w-full">
            <div class="flex w-full font-semibold text-left">Amount</div>
            <input
              v-for="(item, index) in invoice.formData.items"
              :key="index"
              disabled
              cols="60"
              class="flex mb-8"
              v-model="item.amount"
            />
            <!-- <div class="flex">{{8100}}</div> -->
          </div>
        </div>
        <br />
        <hr />

        <!-- <div
            style="text-align: left; margin-left: 10px"
            class="w-[50%]"
          ></div> -->

        <!-- <div class=" ">
                <span class="">Date</span>

                <input
                  readonly
                  class="w-[53vw] text-right border-0 bg-white"
                  placeholder="68970.00"
                />
              </div>
              <hr /> -->
        <div class="flex flex-col max-w-full items-end xl:mr-20 2xl:mr-60">
          <div
            class="flex justify-between xl:w-[70%] md:w-[75%] 2xl:w-[65%] items-end"
          >
            <div class="text-black flex">
              <span
                class="px-[4px] py-[10px] font-semibold border-black text-[12px] rounded"
              >
                SubTotal
              </span>
            </div>
            <div class="pb-2 pt-4 mr-8">
              {{ invoice.formData.subtotal }} {{ invoice.formData.currency }}
            </div>
            <!-- <div class="text-black">
              <span class=""> Total </span>
            </div> -->

            <!-- :value="getSubtotal()" -->
          </div>

          <div
            class="flex justify-between xl:w-[70%] md:w-[75%] 2xl:w-[65%] items-end"
          >
            <div class="">
              <span
                class="px-[6px] font-semibold py-[10px] border-black text-[12px] rounded"
                :class="{
                  'bg-[#10C0CB] text-white  ':
                    invoice.formData.paymentStatus === 'Paid',
                  'bg-[#FFB74D] text-white':
                    invoice.formData.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white':
                    invoice.formData.paymentStatus === 'Draft',
                }"
              >
                Balance
              </span>
            </div>
            <div class="pt-2 mr-8">
              {{ invoice.formData.subtotal }} {{ invoice.formData.currency }}
            </div>
            <!-- lg:w-[53vw] 2xl:w-[53vw]  md:w-32 -->
          </div>
        </div>

        <br />

        <div class="container flex">
          <div class="flex-left">
            <div class="text-left mt-8">
              <div>
                <div class="flex w-full">
                  <p class="font-semibold">Invoice Notes :</p>
                </div>
                <!-- v-model="invoice.formData.notes" -->
                <div>{{ invoice.formData.notes }}</div>
              </div>
            </div>
          </div>
        </div>
        <hr class="mt-10" />
        <div class="flex">
          <div class="text-left mt-8 mb-8 font-semibold">Email :</div>
          <div class="text-left mt-8 mb-8">
            {{ invoice.formData.sender.email }}
          </div>
        </div>
      </form>
    </section>
  </div>
</template>
<style scoped>
p {
  text-align: left;
}

input,
textarea,
select {
  border: none !important;
  background: none;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
}
</style>

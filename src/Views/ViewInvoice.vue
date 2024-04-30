<script setup>
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";
import { ref, onMounted, computed } from "vue";
import Header from "../components/Header.vue";
import Button from "../components/Button.vue";
import {
  getSingleInvoice,
} from "../service/invoiceService";
import { Colors } from "../utils/color";
import { useInvoiceStore } from "../stores/index";
import Swal from "sweetalert2";
import axiosInstance from "../service/axios"; 
const logoPreview = ref("");
const isLoader = ref(false);
const invoice = useInvoiceStore();
const route = useRoute();
const invoiceId = route.params._id;
const isLoading = ref(false);
const business = ref("");
const clientId = ref("");
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3,
  });
};
const dropdownTitle = "Actions";
const dropdownItems = [
  { title: "Download as Pdf" },
  { title: "Pay Now" }
];
const invoiceDetails = ref("");
const imageUrl = computed(() => {
  return invoiceDetails.value.url
    ? invoiceDetails.value.url
    : "https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png";
});
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getSingleInvoice(invoiceId);
    invoiceDetails.value = response.data;
    // console.log("response", response);
    business.value = invoiceDetails.value.sender;
    clientId.value = invoiceDetails.value.receiver._id;
    // const clientResponse = await getSingleClient(clientId.value);
    // clientDetails.value = clientResponse.data;
    invoice.updateFormData(invoiceDetails);
    logoPreview.value = invoiceDetails.logoPreview;
    //console.log("Invoice details fetched successfully:", invoiceDetails);
  } catch (error) {
    console.error("Error fetching GetInvoice details:", error);
  } finally {
    isLoading.value = false;
  }
});
const info=()=>{
  Swal.fire({
    title: 'Info',
    html: `Description Item's are Resizeable`, 
    confirmButtonText: 'Close',
  });
};
const handleDropdownItemClickParent = (clickedItem) => {
  if (clickedItem.title === "Download as Pdf") {
    const url = new URL(axiosInstance.defaults.baseURL);
    // url.port = "3010";
    url.pathname = "/api/pdf/X-Invoice";
    url.searchParams.append("clientId", clientId.value);
    url.searchParams.append("businessId", business.value._id);
    url.searchParams.append("invoiceId", invoiceId);
    window.open(url.toString(), "_blank");
  } else if (clickedItem.title === "Pay Now") {
    alert("PayNow Clicked");
  }
}
    
</script>

<template>
  <div v-if="isLoading">
    <a-space class="w-full p-8 flex justify-center mt-[25%]">
      <a-spin size="large" />
    </a-space>
  </div>
<div v-else>
  <Header
      :headerTitle="invoiceDetails.invoiceName"
      :dropdownTitle="dropdownTitle"
      :showDraftButton="true"
      :dropdownItems="dropdownItems"
      :showDropdown="true"
      :showBackButton="true"
      :showUpgradeButton="true"
      :onDropdownItemClick="handleDropdownItemClickParent"
    />
  <div class="bg-gray-200 h-[max-content] w-[100%] flex flex-col justify-center items-center">
    <section
      class="w-[100%] 2xl:w-[50%] md:w-[93%] lg:w-[85%] xl:w-[63%] p-4"
    >
      <form @submit.prevent class="p-4 bg-gray-100 pb-6 ">
        
        <div class="grid grid-cols-2 items-center">
          <div class=" w-full mt-8">
            <div
              class="flex mr-5 items-center justify-center  pl-8 text-xl w-[60px] max-h-12 text-black"
            >
              <span
                class="px-[15px] py-[4px] rounded "
                :class="{
                  'bg-[#10C0CB] text-white text-[12px] ':
                    invoiceDetails.paymentStatus === 'Paid',
                  'bg-[#FFB74D] text-white text-[12px]':
                    invoiceDetails.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white text-[12px]':
                    invoiceDetails.paymentStatus === 'Draft',
                }"
              >
                {{ invoiceDetails.paymentStatus }}
              </span>
            </div>
            <div class="flex flex-col mt-2  pl-4">
              <p class="font-semibold">Description:</p>
              <div class="text-justify">{{ invoiceDetails.description }}</div>
            </div>
          </div>

          <div
            class="w-48 mt-4 lg:ml-[25%] 2xl:ml-[30%] h-auto flex justify-end items-end"
          >
            <img :src="imageUrl" alt="Logo" />
          </div>
        </div>
        <div class="flex mb-8 mt-4 pl-4">
          <div class="flex flex-col mb-2">
            <p class="font-semibold">From:</p>
            <div class="text-left">
              <p class="">
                <span class="">
                  Selected Profile Type:

                  {{ business.profileType }} </span
                ><br />
                <span v-if="business.firstName"
                  >{{ business.firstName }}&nbsp;</span
                >
                <span v-if="business.lastName"
                  >{{ business.lastName }}<br
                /></span>
                <span v-if="business.address1"
                  >{{ business.address1 }}&nbsp;</span
                >
                <span v-if="business.address2">{{ business.address2 }}</span
                ><br />
                <span v-if="business.postalCode"
                  >{{ business.postalCode }}&nbsp;
                </span>
                <span v-if="business.city">{{ business.city }}&nbsp;</span>
                <span v-if="business.state">{{ business.state }}</span
                ><br />
                <span v-if="business.email"
                  >{{ business.email }}<br
                /></span>
              </p>
            </div>
            <br />
            <p class="font-semibold">To:</p>

            <div class="text-left">
              <p class="" v-if="invoiceDetails.receiver">
                <span v-if="invoiceDetails.receiver.firstName"
                  >{{ invoiceDetails.receiver.firstName }}&nbsp;</span
                >
                <span v-if="invoiceDetails.receiver.lastName"
                  >{{ invoiceDetails.receiver.lastName }}<br
                /></span>
                <span v-if="invoiceDetails.receiver.address1"
                  >{{ invoiceDetails.receiver.address1 }}&nbsp;</span
                >
                <span v-if="invoiceDetails.receiver.address2">{{
                  invoiceDetails.receiver.address2
                }}</span
                ><br />
                <span v-if="invoiceDetails.receiver.postalCode"
                  >{{ invoiceDetails.receiver.postalCode }}&nbsp;<br
                /></span>
                <span v-if="invoiceDetails.receiver.city"
                  >{{ invoiceDetails.receiver.city }}&nbsp;</span
                >
                <span v-if="invoiceDetails.receiver.state">{{ invoiceDetails.receiver.state }}</span
                ><br />
                <span v-if="invoiceDetails.receiver.email">{{ invoiceDetails.receiver.email }}</span
                ><br />
              </p>
              <p v-else>Receiver Details Unavailable </p>
            </div>
          </div>
          <div
            class="flex flex-col md:ml-[10%] lg:ml-[30%] xl:ml-[38%] 2xl:ml-[40%] mt-4"
          >
            <div>
              <p class="font-semibold">Invoice No</p>
              <div class="text-left">{{ invoiceDetails.invoiceNumber }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Date</p>
              <div class="text-left">{{ (invoiceDetails.date) }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Invoice Due</p>
              <div class="text-left">{{ invoiceDetails.invoiceDueDate }}</div>
            </div>
            <div class="mb-4 mt-4">
              <p class="font-semibold">Purchase order Number</p>
              <div class="text-left">
                {{ invoiceDetails.purchaseOrderNumber }}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="border mx-6"></div>
        <br />
        <div class="flex lg:flex-row 2xl:flex-row xl:flex-row flex-col px-4">
  <table class="w-full">
    <thead>
      <tr class="bg-gray-100 h-10">
        <th class="text-center font-semibold cursor-pointer " @click="info">Description</th>
        <th class="font-semibold text-center">Quantity</th>
        <th class="font-semibold text-center">Rate</th>
        <th class="font-semibold text-center">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in invoiceDetails.items" :key="index">
        <td style="width: 25%;">
          <textarea disabled cols="25" rows=2  v-model="item.description" class="w-full h-full pl-0 text-justify" style="overflow: hidden;"></textarea>
        </td>
        <td style="width: 25%;">
          <input disabled class="w-full h-full text-center" v-model="item.quantity" />
        </td>
        <td style="width: 25%;">
          <input disabled class="w-full h-full text-center" v-model="item.rate" />
          <!-- <select disabled class="w-full h-full mt-2">
            <option v-for="unit in item.unit" :key="unit" :value="unit">
              {{ unit.name }}
            </option>
          </select> -->
        </td>
        <td style="width: 25%;">
          <input disabled class="w-full h-full text-center" v-model="item.amount" />

        </td>
      </tr>
    </tbody>
  </table>
</div>

        <br />
        <div class="border mx-6"></div>
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
        <div class="flex flex-col max-w-full items-end xl:mr-20 ">
          <div
            class="flex justify-between xl:w-[70%] md:w-[75%] 2xl:w-[70%] items-end"
          >
            <div class="text-black flex">
              <span
                class="px-[4px] py-[10px] font-semibold border-black text-[12px] rounded"
              >
                SubTotal
              </span>
            </div>
            <div class="pb-2 pt-4 mr-8">
              {{ invoiceDetails.subtotal }} {{ invoiceDetails.currency }}
            </div>
            <!-- <div class="text-black">
              <span class=""> Total </span>
            </div> -->

            <!-- :value="getSubtotal()" -->
          </div>

          <div
            class="flex justify-between xl:w-[70%] md:w-[75%] 2xl:w-[70%] items-end"
          >
            <div class="">
              <span
                class="px-[6px] font-semibold py-[10px] border-black text-[12px] rounded"
                :class="{
                  'bg-[#10C0CB] text-white  ':
                    invoiceDetails.paymentStatus === 'Paid',
                  'bg-[#FFB74D] text-white':
                    invoiceDetails.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white':
                    invoiceDetails.paymentStatus === 'Draft',
                }"
              >
                Balance
              </span>
            </div>
            <div class="pt-2 mr-8">
              {{ invoiceDetails.subtotal }} {{ invoiceDetails.currency }}
            </div>
            <!-- lg:w-[53vw] 2xl:w-[53vw]  md:w-32 -->
          </div>
        </div>

        <br />

        <div class="container flex pl-6">
          <div class="flex-left">
            <div class="text-left mt-8">
              <div>
                <div class="flex w-full">
                  <p class="font-semibold">Invoice Notes :</p>
                </div>
                <!-- v-model="invoiceDetails.notes" -->
                <div>{{ invoiceDetails.notes }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="border mx-6 my-8"></div>
        <div class="flex pl-6">
          <div class="text-left font-semibold">Email :</div>
          <div class="text-left mx-2">
            {{ business.email }}
          </div>
        </div>
      </form>
    </section>
  </div>
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

}
.resizable-textarea {
    resize: both;
    overflow: auto;
  }
</style>

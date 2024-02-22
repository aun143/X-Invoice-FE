<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import {updateInvoiceStatus,updateUnpaidInvoiceStatus,deleteInvoice,getSingleInvoice} from "../service/InvoiceService";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
import { useInvoiceStore } from "../stores/index";
import { getSingleClient } from "../service/ClientService";

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
    const status = await updateInvoiceStatus(
      invoiceId,
      updateData
    );
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
    const unpaidStatus = await updateUnpaidInvoiceStatus(
      invoiceId,
      updateData
    );
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

const deleteInvoice = async () => {
  try {
    //console.log("Changing status for invoiceId:", invoiceId);
    const status = await deleteInvoice(invoiceId);
    Swal.fire({
      icon: "success",
      title: " Invoice Deleted  ",
      text: " Invoice  has been Deleted successfully.",
    });
    //console.log("invoice deleted successfully:", status);
  } catch (error) {
    console.error("Error deleting invoice:", error);
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getSingleInvoice(invoiceId);
    const invoiceDetails = response;
    businessId.value = invoiceDetails.sender._id;
    clientId.value = invoiceDetails.receiver;
// Fetch client details by ID
const clientResponse = await getSingleClient(clientId.value);
    clientDetails.value = clientResponse; 
  
    
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
    const url = new URL(window.location.href);
    url.port = "3010";
    url.pathname = "/pdf/X-Invoice";
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
    deleteInvoice(invoiceId);
    router.push("/")
  } else if (clickedItem.title === "Send Invoice") {
    router.push(`/GetInvoice/${invoiceId}/send`);
  } else if (clickedItem.title === "Mark as Unpaid") {
    // alert("Mark as Unpaid");
    changeUnpaidStatus(invoiceId);
    router.push("/");

  }
};
</script>

<template>
  <div v-if="isLoading">
    <a-space class="w-full p-8">
      <a-spin size="large" />
    </a-space>
  </div>
  <div class="get" v-else>
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

    <section class="max-w-[96%]  mt-4 ml-4 ">
      <form @submit.prevent class="p-4 bg-white">
        <div class="flex">
          <div class="flex w-full mt-8">
            <div
              class="flex mr-5 items-center justify-center text-xl w-[60px] max-h-12 text-black"
            >
              <span
                class="px-[15px] py-[4px] rounded"
                :class="{
                  'bg-[#10C0CB] text-white text-[12px] ':
                    invoice.formData.paymentStatus === 'Paid',
                  'bg-orange-300 text-white text-[12px]': invoice.formData.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white text-[12px]': invoice.formData.paymentStatus === 'Draft',
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
          <div class="">
            <div class="mr-32 2xl:mr-[320px] mt-4 max-w-24 2xl:w-48 max-h-auto">
              <img alt="Logo" src="../assets/3x.webp" />
            </div>
          </div>
        </div>
        <div class="flex mb-8 mt-4">
          <div class="flex flex-col  mb-2">
            <p class="font-semibold">From:</p>
            <div class="text-left">
              <!-- <span class="ml-2">{{ invoice.formData.sender._id }}</span> -->
             {{ invoice.formData.sender.firstName }}
              {{ invoice.formData.sender.lastName }}<br>
              {{ invoice.formData.sender.state }}<br>
            {{ invoice.formData.sender.address1 }}<br>
             {{ invoice.formData.sender.address2 }}<br>
            </div>
<br>
            <p class="font-semibold">To:</p>
         
            <div class="text-left">
              {{ clientDetails.firstName}}
              {{ clientDetails.lastName}}<br>
              {{ clientDetails.address1}}<br>
              {{ clientDetails.postalCode}}
              {{ clientDetails.city}}<br>
              {{ clientDetails.state}}<br>
              {{ clientDetails.country}}
            
            
            
            
            </div>
          </div>
          <div class="flex flex-col ml-[45%] mt-4">
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
              <p class="font-semibold" >Purchase order Number</p>
              <div class="text-left">
                {{ invoice.formData.purchaseOrderNumber }}
              </div>
            </div>
          </div>
        </div>
<br><hr><br>
        <div class="flex max-w-[70%] lg:flex-row 2xl:flex-row xl:flex-row lg:flex-row flex-col">
          <div class="w-full md:w-[50%]">
            <div class="text-left w-full font-semibold">Description</div>
            <textarea
              v-for="(item, index) in invoice.formData.items"
              :key="index"
              disabled
              cols="50"
              rows="2"
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
              rows="6"
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
              rows="6"
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
              rows="6"
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
  <div class=" flex flex-col max-w-full items-end">
          <div class="flex justify-around w-[80%] 2xl:w-[100%] items-end">
            <div class="text-black flex flex">
              <span class="px-[4px] py-[10px] font-semibold border-black text-[12px] rounded"> SubTotal </span>
            </div>
            <div class="pb-2 pt-4">
              {{ invoice.formData.subtotal }} {{ invoice.formData.currency }}
            </div>
            <!-- <div class="text-black">
              <span class=""> Total </span>
            </div> -->
           
            <!-- :value="getSubtotal()" -->
          </div>

          <div class="flex justify-around w-[80%] 2xl:w-[100%] items-end">
           <div class="">
              <span
                class="px-[6px] font-semibold py-[10px] border-black text-[12px] rounded"
                :class="{
                  'bg-[#10C0CB] text-white  ':
                    invoice.formData.paymentStatus === 'Paid',
                  'bg-orange-300 text-white': invoice.formData.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white':
                    invoice.formData.paymentStatus === 'Draft',
                }"
              >
                Balance
              </span>
            </div>
            <div class="pt-2">
              {{ invoice.formData.total }} {{ invoice.formData.currency }}
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
        <div class="text-left mt-8 mb-8 font-semibold">
          Email : 
        </div>
        <div class="text-left mt-8 mb-8 ">
           {{  invoice.formData.sender.email }}
        </div>
      </div>
      </form>
    </section>
  </div>
</template>
<style scoped>
.get {
  overflow-x: hidden;
  background-color: rgb(238, 238, 238);
}
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

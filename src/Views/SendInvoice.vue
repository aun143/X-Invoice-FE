<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useInvoiceStore } from "../stores/index";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
import Swal from "sweetalert2";
import {BASE_URL} from "../utils/config";

const route = useRoute();
const router = useRouter();
const invoice = useInvoiceStore();
const invoiceId = ref(route.params._id);
const subject = ref("X-Invoice Email");
const toEmail = ref(""); // Define reactive variable to store email address
const invoiceData = ref(null); // Define reactive variable to store invoice data

const getSingleInvoice = async (invoiceId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_URL}/invoice/getInvoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      invoiceData.value = response.data; // Update reactive variable with invoice data
    } else {
      throw new Error(`Failed to fetch invoice with ID ${invoiceId}`);
    }
  } catch (error) {
    throw new Error(`Error in getSingleInvoice service: ${error.message}`);
  }
};

onMounted(async () => {
  try {
    await getSingleInvoice(invoiceId.value);
    //console.log("Invoice details fetched successfully:", invoiceData.value);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  }
});

function toggleCheckbox() {
  var checkbox = document.getElementById("check");
  checkbox.checked = !checkbox.checked;
}

const handleSendEmailButtonClick = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/email/send`, {
      to: toEmail.value,
      subject: subject.value,
      invoiceId: route.params._id,
    });

    //console.log(response.data.message);
    router.push("/");
    Swal.fire({
      icon: "success",
      title: "Email Sent",
      text: "Email has been sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
</script>

<template>
  <div>
    <Header
      headerTitle="Send Invoice"
      saveDraftButtonText="&nbsp; Send &nbsp;"
      backButtonText="Invoice"
      backRoute="GetInvoice"
      :saveDraftButtonColor="Colors.orange"
      :onSaveDraftButtonClick="handleSendEmailButtonClick"
      :showDropdown="false"
      :showBackButton="false"
    />
    <div class="mb-4 max-w-[800px]">
      <div class="m-4 border-gray-400 border">
        <div class="text-left border pl-4 w-full bg-gray-300 p-1 font-medium">
          Send Invoice
        </div>
        <div class="text-left mt-4 ml-4">
          <p>To</p>
          <a-input v-model:value="toEmail" class="w-full bg-gray-300 text-black" />
        </div>
        <hr class="mt-4" />
        <div class="text-left mt-4 ml-4">
          <p>Subject</p>
          <a-input
            class="w-full bg-gray-300 text-black"
            v-model:value="subject"
            readonly
          />
        </div>
        <hr class="mt-4" />
        <div class="text-left ml-4 mb-4">
          <p>Message</p>
          <textarea
            class="w-full bg-gray-300 text-black"
            cols="30"
            rows="15"
            readonly
          >Invoice Number: {{ invoiceData?.invoiceNumber }}
Invoice Name: {{ invoiceData?.invoiceName }}
Sender: {{ invoiceData?.sender.firstName }}
Purchase Order Number: {{ invoiceData?.purchaseOrderNumber }}
Subtotal: {{ invoiceData?.subtotal }}
Total: {{ invoiceData?.total }}
Currency: {{ invoiceData?.currency }}
Date: {{ invoiceData?.date }}
Payment Status: {{ invoiceData?.paymentStatus }}
Invoice Due Date: {{ invoiceData?.invoiceDueDate }}
          </textarea>
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

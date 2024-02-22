<script setup>
import {  ref ,computed ,onMounted,watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { RouterLink } from "vue-router";
import Button from "../components/Button.vue";
import Client from "./Client.vue";
import { getAllClient } from "../service/ClientService";
import { Colors } from "../utils/color";
import { useInvoiceService } from '../service/MainService';
import Swal  from "sweetalert2";
import { notification } from "ant-design-vue";
import {  Input } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
const invoiceId = route.params._id;
const InvoiceService = useInvoiceService();
const invoice = useInvoiceStore();
const isLoading=ref(false);
const handleSaveDraftButtonClick = async (Id) => {
 
    try {
     if (!validateForm()) return;

      isLoading.value=true;
      const response = await InvoiceService.updateInvoiceData(invoiceId, invoice.formData);
//console.log("response",response);
router.push("/")
      if (response) {
        Swal.fire({
      icon: "success",
      title: " Invoice Updated ",
      text: " Invoice has been Updated successfully.",
    });
      } else {
        // alert('Error updating invoice. Please check the console for details.');
        Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: ("Error updating invoice. Please check the console for details.", error),
      footer: 'Please try again '
    });
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: ("Error During Account:", error),
      footer: 'Please try again '
    });
    }finally{
      isLoading.value=false;
    }
  };
const open =ref(false);
const showModal = () => {
  open.value = true;
};
const validateForm = () => {
  const emptyFields = [];
  if (!invoice.formData.receiver) {
    emptyFields.push("Receiver");
  }
  if (!invoice.formData.sender) {
    emptyFields.push("Sender");
  }
  if (!invoice.formData.invoiceNumber) {
    emptyFields.push("Invoice Number");
  }
  if (!invoice.formData.invoiceName) {
    emptyFields.push("Invoice Name");
  }
  if (!invoice.formData.description) {
    emptyFields.push("Description");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: ${emptyFields.join(", ")}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3, 
  });
};
// const modalActive = ref(false);
// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };
const handleUnitChange = (index, selectedUnit) => {
  invoice.formData.items[index].unit = selectedUnit;
};
const draggedIndex = ref(null);
const handleDragStart = (index) => {
  draggedIndex.value = index;
};

const handleDragOver = (index ) => {
  // event.preventDefault();
  const draggedOverIndex = index;
  if (draggedOverIndex !== draggedIndex.value) {
    const tempItem = invoice.formData.items[draggedOverIndex];
    invoice.formData.items[draggedOverIndex] =
      invoice.formData.items[draggedIndex.value];
    invoice.formData.items[draggedIndex.value] = tempItem;
    draggedIndex.value = draggedOverIndex;
  }
};
const fontSize = "12px";

const handleDragEnd = () => {
  draggedIndex.value = null;
};
const logoInputRef = ref(null);
const logoPreview = ref(null);
const handleFileInputChange = () => {
  displayImage(logoInputRef.value);
  // console.log("3rd")
};

const displayImage = (input) => {
  const file = input.files[0];
// console.log("2nd")
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      logoPreview.value.src = e.target.result;
    };

    reader.readAsDataURL(file);
    invoice.formData.logoPreview=file
    //console.log("file>>>",file)
  }
  
};
const filterStatus = ref("All");

const filteredClients = computed(() => {
  if (filterStatus.value === "All") {
    return clients.value;
  } else {
    return clients.value.filter((client) => client.paymentStatus === filterStatus.value);
  }
});
const calculateAmount = (item) => {
    // Calculate the amount
    const amount = item.quantity * item.rate;
    // Update the item's amount property
    item.amount = amount;
    // Return the calculated amount
    return amount;
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
const clients=ref();
onMounted(async()=>{
  try {
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
    icon: 'error',
    title: 'Oops...',
    text: "Error fetching Clients: " + error.message,
    footer: 'Please try again'
  });
}finally {
    isLoading.value = false; // Set isLoading back to false after fetching data
  }
})

const addMoreItem = () => {
  invoice.addMoreItem();
};

const getSubtotal = () => {
  return invoice.getSubtotal();
};

const getTotal = () => {
  return invoice.getTotal();
};
const calculateUpcomingDueDate = () => {
  const selectedDueDate = invoice.formData.invoiceDueDate;
  if (selectedDueDate) {
    const currentDate = new Date(invoice.formData.date);
    const upcomingDate = new Date(currentDate);
    upcomingDate.setDate(currentDate.getDate() + parseInt(selectedDueDate));
    invoice.formData.invoiceDueDate = upcomingDate;
    //console.log("upcomingDate",upcomingDate);
  } else {
    invoice.formData.invoiceDueDate = null;
  }
};
watch(invoice.formData, (newValue) => {
 invoice.updateFormData(newValue);
});
 </script>
<template>

  <div class="bg-gray-100 ">
     <div class="bg-white">
    <Header
    headerTitle="New Invoice"
    backButtonText=" &nbsp &lt Invoices &nbsp  &nbsp"
    backRoute="Index"
    :dropdownItems="dropdownItems"
    :dropdownTitle="dropdownTitle"
    saveButtonText="&nbsp;&nbsp; Save &nbsp;&nbsp;"
    saveDraftButtonText="&nbsp; Save Changes"
    :saveDraftButtonColor="Colors.orange"
    :onSaveDraftButtonClick="handleSaveDraftButtonClick"
   

  />
</div>
 <form @submit.prevent class="container mt-6 ml-6 bg-white max-w-[1000px]  p-6">
    <div class="container">
      <div class="flex justify-between">
        <div class="flex flex-col space-y-5 w-1/2s sm:flex sm:space-x-4">
          <div class=" ">
            <div class="mt-2 text-2xl ml-2 text-left ">
              <span
              
                class="px-[15px] mr-6  text-[12px] text-white px-3 py-2  rounded mr-4"
                :class="{
                  'bg-[#10C0CB] text-white text-[12px] ':
                    invoice.formData.paymentStatus === 'Paid',
                  'bg-orange-300 text-white text-[12px]': invoice.formData.paymentStatus === 'Unpaid',
                  'bg-[#bababa] text-white text-[12px]': invoice.formData.paymentStatus === 'Draft',
                }"
              >
                {{ invoice.formData.paymentStatus }}
              </span>
              <span class="text-[#ff0000]">*</span>   <a-input
   v-model:value="invoice.formData.invoiceName"
    class="w-[250px] h-8 text-left text-[13px]"
    type="text"
    placeholder="Invoice Name"
  />
            </div>
          </div>
          <a-textarea
          v-model:value="invoice.formData.description"
            placeholder="Enter Description"
            name=""
            id=""
            cols="60"
            rows="2"
          ></a-textarea>
        </div>
        <div class="flex flex-col w-1/2 items-end">
          <label for="logoInput" class="" >
             <div class="logo-placeholder border-none  cursor-pointer rounded w-24 h-24 border-2 grid place-items-center text-slate-500 text-5xl ">
              <img src="../assets/3x.webp"  ref="logoPreview"  class="logo rounded"   alt="Logo" /> </div>
               <!-- <input
                 id="logoInput"
                  type="file"
                  accept="image/*"
                  class=""
                  style="display: none"
                  @change="handleFileInputChange"
                  ref="logoInputRef"   
    /> 
  hover:border-dashed
-->
         </label>
        </div>
      </div>
      <div class="mt-10 flex w-full">
        <div class="">
          <p class="ml-auto  mr-4"> <span class="text-[#ff0000]">*</span>Invoice No.</p>
          <a-input-number
          required
            type="number"
            v-model:value="invoice.formData.invoiceNumber"
            class="ml-2 w-[100px]"
          />
        </div>
        <div class="flex items-end justify-end w-full">
          <div class="">
            <p class="text-left ml-4 ">Language</p>
            <a-select  v-model:value="invoice.formData.language" class="ml-2 w-[150px]">
              <a-select-option
                v-for="language in invoice.languageOptions"
                :key="language.value"
              >
                {{ language.label }}
              </a-select-option>
            </a-select>
          </div>
          <div>
            <p class="text-left ml-3">Currency</p>
            <a-select  v-model:value="invoice.formData.currency" class="ml-2 w-[200px]">
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
 <div class="container flex">
      <div class="flex-left w-[35%] justify-center">
        <div class="mt-4 text-left ">
          <div v-if="isLoading" class="flex justify-center flex-col items-center">
      <a-space class="w-full ">
        <a-spin size="large" />
      </a-space>
    </div>
          <div v-else>
            <div class="flex w-full">
              <p> <span class="text-[#ff0000]">*</span>From</p>
              <p class="justify-end flex w-full text-left">
                <router-link to="/businessProfile">Edit Business Profile</router-link>
              </p>
            </div>
                                  <div class="">
                        <div v-if="invoice.selectedProfileType === 'individual'" class=" border-2 border-gray-100 rounded-2" >
                          <!-- <span class="ml-2">{{ invoice.formData.sender.profileType }}</span><br> -->
                        <span class="ml-2">{{ invoice.formData.sender.firstName }}</span>
                        <span class="ml-2">{{invoice.formData.sender.lastName }}</span><br>
                     <span class="ml-2">{{ invoice.formData.sender.address1 }}</span>
                        <span class="ml-2">{{ invoice.formData.sender.address2 }}</span><br> 
                        <span class="ml-2">{{ invoice.formData.sender.email }}</span><br>
                        <span class="ml-2">{{ invoice.formData.sender.state }}</span><br>
                        <span class="ml-2">{{ invoice.formData.sender.city }}</span><br>
                        </div> 
                        <div v-if="invoice.selectedProfileType === 'organization'" class=" border-2 border-gray-300  rounded-2" >
                        <span class="ml-2"> 
                          {{ invoice.formData.sender.organizationName }}</span><br>
                          <span class="ml-2">{{ invoice.formData.sender.profileType }}</span><br>
                          <span class="ml-2">{{ invoice.formData.sender.firstName }}</span>
                        <span class="ml-2">{{invoice.formData.sender.lastName }}</span><br>
                        <!-- <span class="ml-2">{{ invoice.formData.sender.address1 }}</span>
                        <span class="ml-2">{{ invoice.formData.sender.address2 }}</span><br> -->
                        <!-- <span class="ml-2">{{ invoice.formData.sender.postalCode }}</span> -->
                        <span class="ml-2">{{ invoice.formData.sender.city }}</span><br>
                        <!-- <span class="ml-2">{{ invoice.formData.sender.state }}</span><br> -->
                        <!-- <span class="ml-2">{{ invoice.formData.sender.email }}</span><br> -->
                        <!-- <span class="ml-2">{{ invoice.formData.sender.city }}</span><br> -->
                        </div>



 
           </div>
          </div>
          <div class="flex mt-2">
            <p class="text-right ml-3"> <span class="text-[#ff0000]">*</span>To</p>
            <div class="justify-end flex w-full text-left">
              <!-- <div  @click="toggleModal" class="">New Client</div> -->
              <div type="primary" class="text-[#10C0CB]" @click="showModal">New Client</div>
              <div class="home">
                <!-- <Modal @close="toggleModal" :modalActive="modalActive">
                </Modal> -->
                <a-modal v-model:open="open" @ok="handleOk"  >
                  <Client/> 
    </a-modal>
  </div>
</div>
          </div>
          
          <a-select  v-model:value="invoice.formData.receiver" class="ml-2 w-[100%]"   :loading="isLoading">
              <a-select-option
              v-for="client in filteredClients" :key="client._id" >  {{ client.firstName }}
              </a-select-option>
            </a-select>


        </div>
      </div>
      <div class="flex flex-col items-end mt-4 ml-auto ">
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
            <p class="w-4/5 ml-3 text-start" ml-2 text-start>Invoice Due</p>
            <a-select v-model:value="invoice.formData.invoiceDueDate" class="ml-2 w-[200px]" @change="calculateUpcomingDueDate">
        
              <a-select-option value="07">After 07 days</a-select-option>
              <a-select-option value="15">After 15 days</a-select-option>
              <a-select-option value="30">After 30 days</a-select-option>
              <a-select-option value="45">After 45 days</a-select-option>
              <a-select-option value="60">After 60 days</a-select-option>
            </a-select>
          </div>
        </div>
       
        <div class="flex items-end">
          <div>
            <p class="w-3/3 mb-0 ml-3 text-start">Purchase Order Number</p>
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
      <table class="table-auto w-full">
  <tr class="text-left text-black">
    <th class="align-top"></th>
    <th class="p-2 w-1/2 align-top">Description</th>
    <th class="p-2 align-top ">Quantity</th>
    <th class="p-2 align-top">Rate</th>
    <th class="p-2 w-[150px] text-right pr-5 align-top">Amount</th>
    <th class="p-2 w-[30px] text-right pr-5 align-top">Options</th>
  </tr>

 
    <tr v-for="(item, index) in invoice.formData.items"
          :key="index"
          draggable="true"
          :ButtonColor="Colors.orange"
          @dragstart="handleDragStart(index)"
          @dragover="handleDragOver(index)"
          @drop="handleDrop(index)"
          @dragend="handleDragEnd"
        >
    <td class="align-top">
      <div class="display-none"></div>
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cursor-move" style="width: 20px; height: 20px; margin-right: 10px;">
        <path d="M5 3H3v2h2V3zm14 4h2v6h-2V9H9v10h4v2H7V7h12zM7 3h2v2H7V3zM5 7H3v2h2V7zm-2 4h2v2H3v-2zm2 4H3v2h2v-2zm6-12h2v2h-2V3zm6 0h-2v2h2V3zm-2 14v-2h6v2h-2v2h-2v2h-2v-4zm4 2v2h2v-2h-2z" fill="currentColor" />
      </svg>
    </td>

    <td class="align-top">
      <a-textarea v-model:value="item.description" name="" id="" cols="70" rows="2"></a-textarea>
    </td>
    <td class="align-top">
      <a-input-number v-model:value="item.quantity" class="w-full mx-2" type="number" placeholder="Quantity" />
    </td>
    <td class="align-top">
      <a-input-number v-model:value="item.rate" class="w-full ml-4" type="number" placeholder="Rate" />
      <a-select v-model:value="item.unit" class="ml-2 mt-1 w-[60px]" @change="() => handleUnitChange(index, item.unit)">
        <a-select-option v-for="unit in invoice.unitOptions" :key="unit.value" :value="unit.value">
          {{ unit.value }}

        </a-select-option>
      </a-select>
    </td>
    <td class="align-top">
      <!-- <a-textarea v-model:value="item.amount" readonly class="" cols="10" rows="1" placeholder="Amount" >{{ item.quantity * item.rate }}</a-textarea> -->
      <div readonly class=" ml-12">{{ calculateAmount(item) }}</div>
      <!-- <div readonly class=" ml-12" >{{ item.quantity * item.rate }}</div> -->
    </td>
    <td class="align-top">
      <a-button @click="deleteItem(index)" class="border relative border-gray-300 bg-[#f3f3f4]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
         <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M20 7v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7H2V5h20v2h-2zM6 7v13h12V7H6zm5 2h2v2h-2V9zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zM7 2h10v2H7V2z"/> </g> </svg>       </a-button>
      <!-- <ul v-if="dropdownOpen[index]" class="absolute flex justify-center flex-col bg-white gap-5 p-2 border items-center">
        <li @click="deleteItem(index)" class="cursor-pointer">Delete</li>
        <li @click="saveItem(index)" class="cursor-pointer">Save Item</li>
      </ul> -->
    </td>
  </tr>
</table>

<div class="flex justify-between items-center ">


      <div style="text-align: left;  margin-left: 10px " class="w-[50%]">
        <Button
          :bgColor="Colors.addMore"
          :textColor="Colors.white"
          :fontSize="fontSize"
          buttonText="New Line"
          class=""
          @click="addMoreItem()"
        />
      </div>

    
        <div class="mt-10 flex-y-5 text-right space-y-3 w-full">
          <p>
            <span>Subtotal</span>
            <a-input
              :value="getSubtotal()"
              readonly
              class=" focus:ring-0 focus:ring-offset-0 text-right ml-2 pr-4  border-0 w-[500px]"
              placeholder="Subtotal"
            />
          </p>

          <p>
            <span>Total</span>
            <a-input
              :value="getTotal()"
              readonly
              class="focus:ring-0 focus:ring-offset-0 text-right ml-2 pr-4 border-0 w-[500px]"
              placeholder="Total"
            />
          </p>
   
      </div>
</div>
  </div> 
    <br />
    <div class="container flex">
      <div class="flex-left">
        <div class="mt-10 text-left space-y-3">
          <div>
            <div class="flex w-full">
              <p class="ml-1">Invoice Notes<a href="#">(Default Note)</a></p>
            </div>
            <a-textarea
              class="border-none"
              cols="60"
              rows="2"
              v-model:value="invoice.formData.notes"
            ></a-textarea>
          </div>
          </div>
        </div>
     
   
      </div>
    </form>
  </div>
</template>
<style>
.main{
  font-size: normal;
}



.client{
  appearance: none;
-webkit-appearance: none;
}
</style>


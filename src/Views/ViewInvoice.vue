<script setup>
import {  ref } from "vue";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { RouterLink } from "vue-router";
import Button from "../components/Button.vue";

import { Colors } from "../utils/color";
import { useInvoiceService } from '../service/MainService';
import { clientApi } from '../service/clientService';
import Modal from "../components/Modal.vue";
import { useRoute } from 'vue-router';
// import { useInvoiceService } from '../service/MainService'; 
const route = useRoute();
const invoiceId = route.params.id;
const clietDataOrganization = ref({
  firstName: "",
  lastName: "",
  email: "",
  websiteURL: "",
  address1: "",
  address2: "",
  postalCode: "",
  state: "",
  city: "",
  country: "",
  currency: "",
  phone: "",
  language: "",
  faxNumber: "",
  taxId: "",
  taxId: "",
  notes: "",
  OrganizationName:"",
  items: [{
    customFieldName: ref(""),
    customFieldValue: ref("")
  }]
});
const clietDataindividual = ref({
  organizationName: "",
  firstName:"",
  lastName: "",
  email:"",
  address1:"",
  address2: "",
  phone:"",
  postalCode: "",
  state:"",
  city: "",
  country: "",
  currency: "",
  language: "",
  phone: "",
  webSiteUrl: "",
  faxNumber: "",
  taxId: "",
  notes: "",
  items:[{customFieldName: ref([]),
  customFieldValue: ref([]),}]
});

const handleSaveDraftButtonClick = async () => {
window.confirm("Update Data")
  try {
    const response= await invoiceService.postInvoiceData(invoice.formData);
    //console.log('Invoice submitted successfully:', response);
    alert("Data Submitted")

    // Handle successful submission (e.g., clear form data, display success message)
    
  } catch (error) {
    console.error('Error submitting invoice:', error);
    // Handle error (e.g., display error message)
  }
};

const submitclietDataOrganization = async () => {
  try {
    const response = await clientApi({
      OrganizationName: clietDataOrganization.value.OrganizationName,
      firstName: clietDataOrganization.value.firstName,
      lastName: clietDataOrganization.value.lastName,
      currency: clietDataOrganization.value.currency,
      language: clietDataOrganization.value.language,
      email: clietDataOrganization.value.email,
      phone: clietDataOrganization.value.phone,
      address1: clietDataOrganization.value.address1,
      address2: clietDataOrganization.value.address2,
      websiteURL: clietDataOrganization.value.websiteURL,
      taxId: clietDataOrganization.value.taxId,
      postalCode: clietDataOrganization.value.postalCode,
      state: clietDataOrganization.value.state,
      taxId: clietDataOrganization.value.taxId,
      faxNumber: clietDataOrganization.value.faxNumber,
      city: clietDataOrganization.value.city,
      notes: clietDataOrganization.value.notes,
      country: clietDataOrganization.value.country,
      customFieldName: clietDataOrganization.value.customFieldName,
      customFieldValue: clietDataOrganization.value.customFieldValue,
    });
    //console.log(response);

    // console.log("Submit>>>", submit);

    // Clear form fields after successful submission
    clietDataindividual.value.firstName = "";
    clietDataindividual.value.lastName = "";
    clietDataindividual.value.companyName = "";
    clietDataindividual.value.address1 = "";
    clietDataindividual.value.address2 = "";
    clietDataindividual.value.websiteURL = "";
    clietDataindividual.value.postalCode = "";
    clietDataindividual.value.state = "";
    clietDataindividual.value.taxId = "";
    clietDataindividual.value.city = "";
    clietDataindividual.value.country = "";
  } catch (error) {
    // Handle errors
    console.error("Error during SignUp:", error);
  }
};

const submitclietDataindividual = async () => {
  try {
    const response = await clientApi({
      firstName: clietDataindividual.value.firstName,
      lastName: clietDataindividual.value.lastName,
      email: clietDataindividual.value.email,
      address1: clietDataindividual.value.address1,
      address2: clietDataindividual.value.address2,
      postalCode: clietDataindividual.value.postalCode,
      state: clietDataindividual.value.state,
      taxId: clietDataindividual.value.taxId,
      phone: clietDataindividual.value.phone,
      faxNumber: clietDataindividual.value.faxNumber,
      city: clietDataindividual.value.city,
      currency: clietDataindividual.value.currency,
      notes: clietDataindividual.value.notes,
      country: clietDataindividual.value.country,
      webSiteUrl: clietDataindividual.value.webSiteUrl,
      customFieldName: clietDataindividual.value.customFieldName,
      customFieldValue: clietDataindividual.value.customFieldValue,
    });
    //console.log(response);

    // console.log("Submit>>>", submit);

    // Clear form fields after successful submission
    clietDataindividual.value.firstName = "";
    clietDataindividual.value.lastName = "";
    clietDataindividual.value.companyName = "";
    clietDataindividual.value.address1 = "";
    clietDataindividual.value.address2 = "";
    clietDataindividual.value.websiteURL = "";
    clietDataindividual.value.postalCode = "";
    clietDataindividual.value.state = "";
    clietDataindividual.value.taxId = "";
    clietDataindividual.value.city = "";
    clietDataindividual.value.country = "";
  } catch (error) {
    // Handle errors
    console.error("Error during SignUp:", error);
  }
};

const countryOptions = [
  { label: "USA", value: "en-US" },
  { label: "UK", value: "en-UK" },
  { label: "Spanish", value: "es-ES" },
  { label: "France", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Italian", value: "it-IT" },
  { label: "Chinese (Simplified)", value: "zh-CN" },
  { label: "Japanese", value: "ja-JP" },
  { label: "Russian", value: "ru-RU" },
  { label: "Arabic", value: "ar-AR" },
  { label: "Portuguese", value: "pt-PT" },
  { label: "Dutch", value: "nl-NL" },
  { label: "Korean", value: "ko-KR" },
  { label: "Swedish", value: "sv-SE" },
  { label: "Turkish", value: "tr-TR" },
];
const showMore = ref(false);

const toggleShowMore = () => {
  showMore.value = !showMore.value;
};
const selectedField = ref("individual");
const selectField = (field) => {
  selectedField.value = field;
};

const handleSaveButtonClick = () => {
  if (selectedField.value === "individual") {
  } else {
  }
};

const modalActive = ref(false);

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
const invoiceService = useInvoiceService();
const invoice = useInvoiceStore();
/////
const languageOptions = [
  { label: "English (US)", value: "English (US)" },
  { label: "English (UK)", value: "English (UK)" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Italian", value: "Italian" },
  { label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
  { label: "Japanese", value: "Japanese" },
  { label: "Russian", value: "Russian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Dutch", value: "Dutch" },
  { label: "Korean", value: "Korean" },
  { label: "Swedish", value: "Swedish" },
  { label: "Turkish", value: "Turkish" },
];
const currencyOptions = [
  { label: "United States Dollar (USD)", value: "USD" },
  { label: "Euro (EUR)", value: "EUR" },
  { label: "British Pound Sterling (GBP)", value: "GBP" },
  { label: "Japanese Yen (JPY)", value: "JPY" },
  { label: "Canadian Dollar (CAD)", value: "CAD" },
  { label: "Australian Dollar (AUD)", value: "AUD" },
  { label: "Swiss Franc (CHF)", value: "CHF" },
  { label: "Chinese Yuan (CNY)", value: "CNY" },
  { label: "Russian Ruble (RUB)", value: "RUB" },
  { label: "Saudi Riyal (SAR)", value: "SAR" },
  { label: "Brazilian Real (BRL)", value: "BRL" },
  { label: "Indian Rupee (INR)", value: "INR" },
  { label: "South Korean Won (KRW)", value: "KRW" },
  { label: "Swedish Krona (SEK)", value: "SEK" },
  { label: "Turkish Lira (TRY)", value: "TRY" },
];
const unitOptions = [
  { label: "hours", value: "hrs" },
  { label: "day", value: "d" },
  { label: "month", value: "m" },
  { label: "year", value: "y" },
 
 
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
const fontSize = "16px";
const handleDrop = (index) => {
  // Prevent the default behavior
  event.preventDefault();
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};
const logoInputRef = ref(null);
const logoPreview = ref(null);

const showFileUpload = () => {
  logoInputRef.value.click();
};

const handleFileInputChange = () => {
  displayImage(logoInputRef.value);
};

const displayImage = (input) => {
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      logoPreview.value.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};
const deleteItem = (index) => {
  invoice.formData.items.splice(index, 1);
};


const dropdownOpen = ref(new Array(invoice.formData.items.length).fill(true).map(() => ref(true)));
const handleDropdownClick = (index, val) => {
  // console.log("Value", index, val);
  dropdownOpen.value[index] = val;
};
const saveItem = (index) => {
  //console.log(`Saved item at index ${index}`);
};

const addNewLine = () => {
  alert("Hello");

  if (selectedField.value === "individual") {
    individualData.value.items.push({
      customFieldName: ref(""),
      customFieldValue: ref(""),
    });
  } else if (selectedField.value === "organization") {
    organizationData.value.items.push({
      customFieldName: ref(""),
      customFieldValue: ref(""),
    });
  }
};


function addMoreItem() {
  invoice.formData.items.push({
    description: "",
    quantity: "",
    rate: "",
    amount: "",
  });
}
const handleSaveDraftButtonClick1 = () => {
  
};

function getSubtotal() {
  let subtotal = 0;
  invoice.formData.items.forEach((item) => {
    subtotal += item.amount;
  });
  invoice.formData.subtotal = subtotal;
  return subtotal;
}

function getTotal() {
  const tax = (invoice.formData.subtotal * invoice.formData.tax) / 100;
  invoice.formData.total = invoice.formData.subtotal + tax;
  return invoice.formData.total;
}
const saveButtonColor="#f3f3f4";

</script>
<template>
  <div class="">
    <Header
    headerTitle="Viewing Invoice"
    backButtonText="&lt; &nbsp; Back"
    backRoute="Index"
    saveDraftButtonText=" Save Changes"
    :saveDraftButtonColor="Colors.orange"
    :onSaveDraftButtonClick="handleSaveDraftButtonClick"
    :onSaveButtonClick="handleSaveButtonClick"
    :showDropdown="false"
  />
  <!-- {{ invoice.formData }} -->
 <form @submit.prevent class="container mx-auto /max-w-[300px] p-12">
    <div class="container">
      <div class="flex justify-between">
        <div class="flex flex-col space-y-5 w-1/2s sm:flex sm:space-x-4">
          <div class=" ">
            <div class="mt-2 text-2xl ml-2 text-left mb-">
              <span class="mr-6 bg-[#a1a1a1] text-white p-2">Draft</span>
              <input
                v-model="invoice.formData.invoiceName"
                class="w-[250px] h-12 text-left"
                type="text"
                placeholder="Invoice Name"
              />
            </div>
          </div>
          <textarea
            v-model="invoice.formData.description"
            name=""
            id=""
            cols="60"
            rows="2"
          ></textarea>
        </div>
        <div class="flex flex-col w-1/2 items-end">
          <br /><br />
          <label for="logoInput" class="" @click="showFileUpload()">
    <div class="logo-placeholder border-none cursor-pointer rounded w-48 h-24 border-2 grid place-items-center text-slate-500 text-6xl ">
      <img src="../assets/vue.svg"  ref="logoPreview"  class="logo max-w-full max-h-full rounded-full"   alt="Logo" /> </div>
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
      <div class="mt-10 flex w-full">
        <div class="">
          <p class="ml-auto mr-8">Invoice No.</p>
          <input
            type="text"
            v-model="invoice.formData.invoiceNumber"
            class="ml-2 w-[100px]"
          />
        </div>
        <div class="flex items-end justify-end w-full">
          <div class="">
            <p class="text-left ml-4">Language</p>
            <select v-model="invoice.formData.language" class="ml-2 w-[150px]">
              <option
                v-for="language in languageOptions"
                :key="language.value"
                :value="language.value"
              >
                {{ language.label }}
              </option>
            </select>
          </div>
          <div>
            <p class="text-left ml-4">Currency</p>
            <select v-model="invoice.formData.currency" class="ml-2 w-[200px]">
              <option
                v-for="currency in currencyOptions"
                :key="currency.value"
                :value="currency.value"
              >
                {{ currency.label }}
              </option>
            </select>
          </div>
        </div>
       
      </div>
      <br />
      <hr />
    </div>
    <div class="container flex">
      <div class="flex-left">
        <div class="mt-10 text-left space-y-3">
          <div>
            <div class="flex w-full">
              <p>From</p>
              <p class="justify-end flex w-full text-left">
                <router-link to="/businessProfile">Edit Business Profile</router-link>
              </p>
            </div>
            <textarea
              class="border-none"
              cols="40"
              rows="4"
              v-model="invoice.formData.sender"
            ></textarea>
          </div>
          <div class="flex">
            <p class="text-right">To</p>
            <p class="justify-end flex w-full text-left">
              <div  @click="toggleModal" >New Client</div>
              <div class="home">
    <Modal @close="toggleModal" :modalActive="modalActive">
      <div class="modal-content">
        <div class="flex ">
    <div class="w-full p-8 bg-white ">
      <div class="mb-4 flex ml-4">
        <label for="logoInput" class="" @click="showFileUpload()">
          <div
            class="logo-placeholder border-none cursor-pointer hover:border-solid w-48 h-24 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
          >
            <img
              v-if="selectedField === 'individual'"
              src="../assets/single.png"
              alt="Logo for Individual"
              class="w-20 h-20 mb-4 cursor-pointer"
              @click="selectField('individual')"
            />
            <img
              v-else
              src="../assets/images.png"
              alt="Logo for Organization"
              class="w-20 h-20 mb-4 cursor-pointer"
              @click="selectField('organization')"
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

        <div class="flex-right border w-64 ml-8">
          <div
            class="flex-1 pr-2 cursor-pointer"
            @click="selectField('individual')"
          >
            <p class="mb-1 mt-4">
              Individual
              <span
                v-if="selectedField === 'individual'"
                class="text-orange-500 ml-12"
                >&#10003;</span
              >
            </p>
          </div>
          <hr />
          <div
            class="flex-1 pl-2 cursor-pointer"
            @click="selectField('organization')"
          >
            <p class="mb-1">
              Organization
              <span
                v-if="selectedField === 'organization'"
                class="text-orange-500"
                >&#10003;</span
              >
            </p>
          </div>
        </div>
      </div>     
      <br />
      <div v-if="selectedField === 'individual'">
        <div class="mb-4">
          <hr class="mb-4" />
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="justify-start flex">*First Name</p>
              <input
                v-model="clietDataindividual.firstName"
                type="text"
                placeholder="First Name"
                class="w-full border p-2"
              />
            </div>
            <div>
              <p class="justify-start flex">Last Name</p>
              <input
                v-model="clietDataindividual.lastName"
                type="text"
                placeholder="Last Name"
                class="w-full border p-2"
              />
            </div>
           
          </div>
          <hr class="mb-2 mt-8">
        </div>
        <div>
          <div>
            <p class="text-left ml-4">Currency</p>
            <select v-model="clietDataindividual.currency" class="ml-2 w-full">
              <option
                v-for="currency in currencyOptions"
                :key="currency.value"
                :value="currency.value"
              >
                {{ currency.label }}
              </option>
            </select>
          </div>
          <hr class="mb-2 mt-8">
          <div class="">
            <p class="text-left ml-4">Language</p>
            <select v-model="clietDataindividual.language" class="ml-2 w-full">
              <option
                v-for="language in languageOptions"
                :key="language.value"
                :value="language.value"
              >
                {{ language.label }}
              </option>
            </select>
          </div>
        </div>
          <hr class="mb-2 mt-8">
          <div>
              <p class="justify-start flex">Email Address</p>
              <input
                v-model="clietDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8">
            <div>
              <p class="justify-start flex">Phone Number</p>
              <input
                v-model="clietDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8">
            <div >
                <p class="justify-start flex">Address(Line 1)</p>
                <input
                  v-model="clietDataindividual.address1"
                  type="text"
                  placeholder="Streeet Line 1"
                  class="w-full border p-2"
                />
            
            
                
                <input
                  v-model="clietDataindividual.address2"
                  type="text"
                  placeholder="Street Line 2"
                  class="w-full mt-2 border p-2"
                />
              </div>
        <div class="">
       
                       
                <div class="mt-2 mr-4">
                  <input v-model="clietDataindividual.city" placeholder="City" type="text" class="mr-2 w-[170px]" />
                  <input
                    v-model="clietDataindividual.state"
                    type="text"
                    class=" mr-2 w-[170px]"
                    placeholder="State"
                  />
                  <input
                    v-model="clietDataindividual.postalCode"
                    type="number"
                    class="mr-2 w-[170px]"
                    placeholder="Postal Code"
                  />           
                 
                  
                </div>
                <div class="">
            <p class="text-left ml-4">Country</p>
            <select v-model="clietDataindividual.country" class="ml-2 w-full">
              <option
                v-for="country in countryOptions"
                :key="country.value"
                :value="country.value"
              >
                {{ country.label }}
              </option>
            </select>
         
              
          </div>
        </div>
<hr class="mb-4 mt-4">
<a @click="toggleShowMore">
        {{ showMore ? 'Show Less <<' : 'Show More >>' }}
      </a>
        <hr class="mb-4 mt-4">
        <div v-if="showMore">
            <div>
              <p class="justify-start flex">Fax Number</p>
              <input v-model="clietDataindividual.faxNumber" type="number" class="w-full border p-2" />
            </div>
            <hr clas="mb-4 mt-8" />
            <div>
              <p class="justify-start flex">Website URL</p>
              <input
                v-model="clietDataindividual.websiteURL"
                type="text"
                class="w-full border p-2"
              />
            </div>
            <hr clas="mb-4 " />
            <div>
              <p class="justify-start flex">Notes</p>
              <textarea
                v-model="clietDataindividual.notes"
                rows="4"
                type="text"
                class="w-full border p-2"
              />
           

          <hr clas="mb-4 " />
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="">
              <p class="justify-start ">Custom Field</p>
           
              <input
                v-model="clietDataindividual.items.customFieldName"
                type="text"
                class="w-full border p-2"
                placeholder="Custom Field Name"
              />
            </div>
            <div class="">
              <a @click="addNewLine" class="ml-48">Add Custom Field</a>
              <input
                v-model="clietDataindividual.items.customFieldValue"
                type="text"
                class="w-full border p-2"
                placeholder="Custom Field Value"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center ">
        <div style="text-align: left; margin-left: 10px; margin-top: 10px">
          <Button
            :bgColor="Colors.addMore"
            :textColor="Colors.white"
            :fontSize="fontSize"
            buttonText="Save & Return"
            class=""
            @click="submitclietDataindividual()"
          />
        </div>
        </div>
      </div>

      <div v-else-if="selectedField === 'organization'">
        <div class="mb-4">
          <hr class="mb-4" />
          <div class=" flex flex-col">
            
              <p class="justify-start flex">*Organization  Name</p>
              <input
                v-model="clietDataOrganization.OrganizationName"
                type="text"
                placeholder="First Name"
                class=" border p-2"
              />
            
        
            <div class="flex flex-row w-full">
              <div class="flex-col flex ">
              <p class="justify-start flex">*First Name</p>
              <input
                v-model="clietDataOrganization.firstName"
                type="text"
                placeholder="First Name"
                class="w-full border p-2"
              />
            </div><div class="flex-col flex ml-24">
              <p class="justify-start flex">Last Name</p>
              <input
                v-model="clietDataOrganization.lastName"
                type="text"
                placeholder="Last Name"
                class="w-full border p-2 "
              /></div>
            </div>
           
          </div>
        </div>
        <hr class="mb-4" />
        <div>
          <div>
          <div>
            <p class="text-left ml-4">Currency</p>
            <select v-model="clietDataOrganization.currency" class="ml-2 w-full">
              <option
                v-for="currency in currencyOptions"
                :key="currency.value"
                :value="currency.value"
              >
                {{ currency.label }}
              </option>
            </select>
          </div>
          <hr class="mb-2 mt-8">
          <div class="">
            <p class="text-left ml-4">Language</p>
            <select v-model="clietDataOrganization.language" class="ml-2 w-full">
              <option
                v-for="language in languageOptions"
                :key="language.value"
                :value="language.value"
              >
                {{ language.label }}
              </option>
            </select>
          </div>
        </div>
        <hr class="mb-2 mt-8">
              <p class="justify-start flex">Email Address</p>
              <input
                v-model="clietDataOrganization.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8">
            <div>
              <p class="justify-start flex">Phone Number</p>
              <input
                v-model="clietDataOrganization.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8">
            <div >
                <p class="justify-start flex">Address(Line 1)</p>
                <input
                  v-model="clietDataOrganization.address1"
                  type="text"
                  placeholder="Streeet Line 1"
                  class="w-full border p-2"
                />
            
            
                
                <input
                  v-model="clietDataOrganization.address2"
                  type="text"
                  placeholder="Street Line 2"
                  class="w-full mt-2 border p-2"
                />
              </div>
        <div class="">
       
                       
                <div class="mt-2 mr-4">
                  <input v-model="clietDataOrganization.city" placeholder="City" type="text" class="mr-2 w-[160px]" />
                  <input
                    v-model="clietDataOrganization.state"
                    type="text"
                    class=" mr-2 w-[173px]"
                    placeholder="State"
                  />
                  <input
                    v-model="clietDataOrganization.postalCode"
                    type="number"
                    class="mr-2 w-[175px]"
                    placeholder="Postal Code"
                  />           
                 
                  
                </div>
                <div class="">
            <p class="text-left ml-4">Country</p>
            <select v-model="clietDataOrganization.country" class="ml-2 w-full">
              <option
                v-for="country in countryOptions"
                :key="country.value"
                :value="country.value"
              >
                {{ country.label }}
              </option>
            </select>
         
              
          </div>
        </div>
<hr class="mb-4 mt-4">
        <div><a @click="toggleShowMore">
        {{ showMore ? 'Show Less <<' : 'Show More >>' }}
      </a></div>
        <hr class="mb-4 mt-4">
             
         
          <div v-if="showMore">
     

        <div>
          <p class="justify-start flex">Tax Identification Number</p>
          <input v-model="clietDataOrganization.taxId" type="number" class="w-full border p-2" />
        </div>
        <hr class="mb-4 mt-4">
            <div>
              <p class="justify-start flex">Fax Number</p>
              <input v-model="clietDataOrganization.faxNumber" type="number" class="w-full border p-2" />
            </div>
            <hr class="mb-4 mt-4">
            <div>
              <p class="justify-start flex">Website URL</p>
              <input
                v-model="clietDataOrganization.websiteURL"
                type="text"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-4 mt-4">
            <div>
              <p class="justify-start flex">Notes</p>
              <textarea
                v-model="clietDataOrganization.notes"
                rows="4"
                type="text"
                class="w-full border p-2"
              />
           

          <hr clas="mb-4 " />
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p class="justify-start flex">Custom Field</p>
              
              <input
                v-model="clietDataOrganization.customFieldName"
                type="text"
                class="w-full border p-2"
                placeholder="Custom Field Name"
              />
            </div>
            <div>
              <a @click="addNewLine" class="ml-48">Add Custom Field</a>
              <input
                v-model="clietDataOrganization.customFieldValue"
                type="text"
                class="w-full border p-2 "
                placeholder="Custom Field Value"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center ">
        <div style="text-align: left; margin-left: 10px; margin-top: 10px">
          <Button
            :bgColor="Colors.addMore"
            :textColor="Colors.white"
            :fontSize="fontSize"
            buttonText="Save & Return"
            class=""
            @click="submitclietDataOrganization()"
          />
        </div>
        </div>
      </div>
    </div>
  </div>
      </div>
    </Modal>
  </div>
            </p>
          </div>
          <input
            class="w-96"
            v-model="invoice.formData.receiver"
            name=""
            id=""
            placeholder="Receiver Name"
          />
        </div>
      </div>
      <div class="flex flex-col items-end mt-10 ml-auto">
        <div class="flex items-end mb-2">
          <div>
            <p class="w-4/5 mb-0">Date</p>
            <input
              type="Date"
              v-model="invoice.formData.date"
              class="ml-2 w-[200px]"
            />
          </div>
        </div>
        <div class="flex items-end mb-2">
          <div>
            <p class="w-4/5">Invoice Due</p>
            <select
              v-model="invoice.formData.dueDateOption"
              class="ml-2 w-[200px]"
            >
              <option value="07">After 07 days</option>
              <option value="15">After 15 days</option>
              <option value="30">After 30 days</option>
              <option value="45">After 45 days</option>
              <option value="60">After 60 days</option>
            </select>
            <span
              v-if="invoice.formData.date && invoice.formData.dueDateOption"
            ></span>
          </div>
        </div>
       
        <div class="flex items-end">
          <div>
            <p class="w-3/3 mb-0">Purchase Order Number</p>
            <input
              v-model="invoice.formData.purchaseOrderNumber"
              class="ml-2 w-[200px]"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <hr />
    <div class="mt-20">
      <table class="table-auto w-full">
        <tr class="text-left text-black">
          <th class="p-2 pl-5 w-1/2 align-top">Description</th>
          <th class="p-2 align-top">Quantity</th>
          <th class="p-2 align-top">Rate</th>
          <th class="p-2 w-[150px] text-right pr-5 align-top">Amount</th>
          <th class="p-2 w-[30px] text-right pr-5 align-top">Options</th>
        </tr>

        <tr
          v-for="(item, index) in invoice.formData.items"
          :key="index"
          draggable="true"
          :ButtonColor="saveButtonColor"
          @dragstart="handleDragStart(index)"
          @dragover="handleDragOver(index)"
          @drop="handleDrop(index)"
          @dragend="handleDragEnd"
        >
          <td class=" align-top">
            <textarea
              v-model="item.description"
              name=""
              id=""
              cols="90"
              rows="2"
            ></textarea>
         
               
               
              
           
          </td>
          <td class="align-top ">
            <input
              v-model="item.quantity"
              class="w-full ml-4"
              type="number"
              placeholder="Quantity"
            
            />
          </td>
          <td class="align-top ">
            <input
              v-model="item.rate"
              class="w-full"
              type="number"
              placeholder="Rate"
            />
           
            <select
      v-model="item.unit"
      class="ml-2 w-[60px]"
      @change="() => handleUnitChange(index, item.unit)"
    >
      <option
        v-for="unit in unitOptions"
        :key="unit.value"
        :value="unit.value"
      >
        {{ unit.value }}
      </option>
    </select>
          </td>
          <td class="py-1 pr-5 text-right text-gray-800 align-top">
            {{ (item.amount = item.quantity * item.rate) }}
          </td>
          <td class="py-1 pr-5 text-right text-gray-800 align-top ">

            <button
            @click="handleDropdownClick(index, !dropdownOpen[index])"
              class="border border-gray-300 bg-[#f3f3f4]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-settings"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                ></path>
              </svg>
            </button>
            
            <ul v-if="dropdownOpen[index]" class="flex flex-col absolute  bg-white gap-5 p-2 border items-center"> 
                <li @click="deleteItem(index)" class="cursor-pointer ">Delete</li>
                <li @click="saveItem(index)" class="cursor-pointer">Save Item</li>
            </ul>
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
            <input
              :value="getSubtotal()"
              readonly
              class=" focus:ring-0 focus:ring-offset-0 text-right ml-2 pr-4  border-0 w-[500px]"
              placeholder="Subtotal"
            />
          </p>

          <p>
            <span>Total</span>
            <input
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
    <div>
      
    </div>
    <div class="container flex">
      <div class="flex-left">
        <div class="mt-10 text-left space-y-3">
          <div>
            <div class="flex w-full">
              <p>Invoice Notes<a href="#">(Default Note)</a></p>
            </div>
            <textarea
              class="border-none"
              cols="60"
              rows="2"
              v-model="invoice.formData.notes"
            ></textarea>
          </div>
          </div></div></div>
   
  </form>
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingleClient, updateClient,deleteClient } from "../service/ClientService";
// import Button from "../components/Button.vue";
import { Colors } from "../utils/color";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { notification } from "ant-design-vue";  
import Swal from "sweetalert2";
import {uploadImage} from "../service/UploadImage"
const invoice = useInvoiceStore();
const isLoading = ref(false);
const isLoader = ref(false);
const isLoadingImg = ref(false);
const route = useRoute();
const router = useRouter();
const clientId = route.params.clientId;
const selectedField = ref("individual");
const handleSaveDraftButtonClick = async () => {
  if(isLoadingImg.value){
  openNotificationWithIcon("error", "Please Wait To upload Image First");
  return;
 }
  try {
    let dataToUpdate = null;
    isLoader.value=true;
    // Check the profile type selected
    if (invoice.userClientProfile.clientDataindividual.clientType === "individual") {
      // Validate the individual form
      if (!validateFormInd()) {
        return; // Exit function if validation fails
      }
      dataToUpdate = invoice.userClientProfile.clientDataindividual;
      // Call the action to update individual profile
      invoice.updateIndividualProfile(dataToUpdate);
    } else if (invoice.userClientProfile.clientDataindividual.clientType === "organization") {
      // Validate the organization form
      if (!validateFormInd()) {
        return; // Exit function if validation fails
      }
      dataToUpdate = invoice.userClientProfile.clientDataindividual;
      // Call the action to update organization profile
      invoice.updateOrganizationProfile(dataToUpdate);
    }
    const { success, data, error } = await updateClient(clientId, dataToUpdate);
    if (success) {
      invoice.userClientProfile.clientDataindividual = {};
    router.push("/AllClients");
      Swal.fire({
        icon: "success",
        title: "Client Created",
        text: data || "Client has been Updatied successfully.",
      });
    } else {
      console.error("Error During Client Updation:", error);
      Swal.fire({
        icon: "error",
        title: "Error During Client Updation",
        text: error || "An error occurred while Updating the client.",
      });
      if (error === "Your subscription plan has expired. Please update your plan.") {
        router.push("/subscription");
      } else {
        openNotificationWithIcon("error", error);
      }
    }
  } catch (error) {
    console.error("Error During Client Updation:", error);
    openNotificationWithIcon("error", "An error occurred while Updating the client.");
  } finally {
    isLoader.value = false;
  }
};

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 5, 
  });
};
const validateFormInd = () => {
  const emptyFields = [];

  if (!invoice.userClientProfile.clientDataindividual.firstName) {
    emptyFields.push("FirstName must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataindividual.lastName) {
    emptyFields.push("LastName must be Alphabetic");
  } if (!invoice.userClientProfile.clientDataindividual.phone) {
    emptyFields.push("Phone Number");
  }
  if (!invoice.userClientProfile.clientDataindividual.email) {
    emptyFields.push(" Email must contain '@'");
  }if (!invoice.userClientProfile.clientDataindividual.state) {
    emptyFields.push(" State must be Alphabetic");
  }if (!invoice.userClientProfile.clientDataindividual.city) {
    emptyFields.push(" City must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataindividual.country) {
    emptyFields.push("Country must be Alphabetic");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: ${emptyFields.join(", ")}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const fetchclientDetails = async () => {
  try {
    isLoading.value = true;
    const { success, data, error } = await getSingleClient(clientId);

if (success) {
  const clientDetails = data;

if (selectedField.value === "individual") {
invoice.userClientProfile.clientDataindividual = {
    ...clientDetails,
};
} else if (selectedField.value === "organization") {
invoice.userClientProfile.clientDataOrganization = {
    ...clientDetails,
};
}
} else {
  console.error("Error During Client Get:", error);
  Swal.fire({
    icon: "error",
    title: "Error During Client Get",
    text: error || "An error occurred while gettting the client.",
  });
  if (error === "Your subscription plan has expired. Please update your plan.") {
    router.push("/subscription");
  } else {
    openNotificationWithIcon("error", error);
  }
}
} catch (error) {
console.error("Error During Client Get:", error);
openNotificationWithIcon("error", "An error occurred while Getting the client.");
} finally {
isLoading.value = false;
}
};
const displayImage = (input, imageUrl) => {
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (invoice.userClientProfile.clientDataindividual.clientType === 'individual') {
        invoice.userClientProfile.clientDataindividual.url = imageUrl;
      } else if (invoice.userClientProfile.clientDataindividual.clientType === 'organization') {
        invoice.userClientProfile.clientDataOrganization.url = imageUrl;
      }// Update the URL in the formData
      const imagePreview = document.getElementById('imagePreview');
      imagePreview.src = imageUrl;
    };

    reader.readAsDataURL(file);
    if (invoice.userClientProfile.clientDataindividual.clientType === 'individual') {
        invoice.userClientProfile.clientDataindividual.url = imageUrl;
      } else if (invoice.userClientProfile.clientDataindividual.clientType === 'organization') {
        invoice.userClientProfile.clientDataOrganization.url = imageUrl;
      }
  }
};

onMounted(() => {
  fetchclientDetails();
});
const logoInputRef = ref(null);
const handleFileInputChange = async () => {
  const file = logoInputRef.value.files[0];
  if (file) {
    try {
      isLoadingImg.value = true;
      const imageUrl = await uploadImage(file);
      if (imageUrl) {

        if (selectedField.value === "individual") {
          invoice.userClientProfile.clientDataindividual.url = imageUrl;
        } else if (selectedField.value === "organization") {
          invoice.userClientProfile.clientDataOrganization.url = imageUrl;
        }
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
const showOptions = ref(false);
const filterOptions = (event) => {
  const input = event.target.value.toLowerCase();
  filteredOptions.value = invoice.countryOptions.filter(
    (option) => option.label.toLowerCase().indexOf(input) > -1
  );
};
const filteredOptions = ref(invoice.countryOptions);
const selectOption = (option, event) => {
  event.preventDefault();
  event.stopPropagation();
  if (selectedField.value === "individual") {
    invoice.userClientProfile.clientDataindividual.country = option.label; 
  } else if (selectedField.value === "organization") {
    invoice.userClientProfile.clientDataOrganization.country = option.label;
  }
  hideDropdown(); 
};
const showDropdown = () => {
  showOptions.value = true;
};
const hideDropdown = () => {
  setTimeout(() => {
    showOptions.value = false;
  }, 100); 
};
</script>


<template>

 <div class="bg-gray-200">
    <div class="bg-white">
  <Header
        headerTitle="Client"
        :isLoader="isLoader"
        backButtonText="&nbsp &lt Back &nbsp  &nbsp"
        backRoute="Invoice"
        saveDraftButtonText=" Save Changes"
        :saveDraftButtonColor="Colors.primary"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="false"
        :showBackButton="false"
      />
</div>
<!-- {{invoice.userClientProfile.clientDataindividual.clientType}} -->
  <div class="modal-content max-h-full flex w-[100%] md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[50%] p-4 justify-start">
      <div class="flex">
        <div class="w-full p-8 bg-white">
          <div class="mb-4 flex ml-4">
            <label for="logoInput" class="">
              <div
                class="logo-placeholder hover:border-dashed border-none cursor-pointer   w-20 h-20 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
              >
              <div v-if="isLoadingImg">
                <a-space class="w-full">
                    <a-spin size="large" />
                  </a-space>
              </div>
              
              
              <div v-else>
                <img
                id="imagePreview"
                  v-if="selectedField === 'individual'"
                  :src="invoice.userClientProfile.clientDataindividual.url || 'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'"
                  ref="logoPreview"
                  alt="Logo for Individual"
                  class="w-20 mb-4 h-20 cursor-pointer"
                />
                <img
                id="imagePreview"
                  v-if="selectedField === 'organization'"
                  :src="invoice.userClientProfile.clientDataOrganization.url || 'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'"
                  alt="Logo for Organization"
                  ref="logoPreview"
                  class="w-20 mb-4 h-20 cursor-pointer"
                /></div>
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

            <div class="flex-right w-48 ml-6">
              <table class=" border border-black mt-6">
               
                <tr  v-if="invoice.userClientProfile.clientDataindividual.clientType === 'individual'" >
                  <td>
                    <div
                      class="flex pl-4 my-2 cursor-pointer"
                      >
                      <!-- @click="selectField('individual')" -->
                      <p class="mb-1  mr-12 font-medium text-[14px] mt-2">Individual</p>
                    </div>
                  </td>
                  <td>
                    <span
                     
                    class="text-orange-600 fa-solid fas fa-check mr-2"
></span
                    >
                  </td>
                </tr><tr  v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                  <td>
                    <div
                      class="flex pl-4 my-2 cursor-pointer"
                      >
                      <!-- @click="selectField('organization')" -->
                      <p class="mb-1  mr-12 font-medium text-[14px] mt-2">Organization</p>
                    </div>
                  </td>
                  <td>
                    <span
                     
                    class="text-orange-600 fa-solid fas fa-check mr-2"
></span
                    >
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <br />

          <div v-if="selectedField === 'individual' || invoice.userClientProfile.clientDataindividual.clientType === 'individual'" :key="1">
            <div class="">
              <hr class="mb-4" />
              <div v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                <p class="justify-start flex font-medium text-[14px]"> <span class="text-[#ff0000]">*</span>Organization Name</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.organizationName"
                  type="text"
                  placeholder="Organization Name"
                  class="w-full border p-2"
                />
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p class="justify-start flex font-medium text-[14px]"> <span class="text-[#ff0000]">*</span>First Name</p>
                  <a-input
                    v-model:value="invoice.userClientProfile.clientDataindividual.firstName"
                    type="text"
                    placeholder="First Name"
                    class="w-full border p-2"
                  />
                </div>
                <div>
                  <p class="justify-start flex font-medium text-[14px]"><span class="text-[#ff0000]">*</span>Last Name</p>
                  <a-input
                    v-model:value="invoice.userClientProfile.clientDataindividual.lastName"
                    type="text"
                    placeholder="Last Name"
                    class="w-full border p-2"
                  />
                </div>
              </div>
              <hr class="mb-2 mt-4" />
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p class="text-left ml-2 font-medium text-[14px]">Currency</p>
                <a-select
                  v-model:value="invoice.userClientProfile.clientDataindividual.currency"
                  class="w-full text-left" size="large"
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
              
              <div class="">
                <p class="text-left ml-2 font-medium text-[14px]">Language</p>
                <a-select 
                  v-model:value="invoice.userClientProfile.clientDataindividual.language"
                  class=" w-full text-left" size="large"
                >
                  <a-select-option
                    v-for="language in invoice.languageOptions"
                    :key="language.value"
                    :value="language.value"
                  >
                    {{ language.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <hr class="mb-2 mt-4" />
            <div>
              <p class="justify-start flex font-medium text-[14px]"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-4" />
            <div>
              <p class="justify-start flex font-medium text-[14px]"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.phone"
                type="string"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-4" />
            <div>
              <p class="justify-start flex font-medium text-[14px]"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.address1"
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.address2"
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="flex justify-between items-center mt-3 gap-2">
              <div class="">
                <p class="text-left  font-medium text-[14px]">
                  <span class="text-[#ff0000]">*</span>Country
                </p>
                <div class="relative">
                  <a-input
                    v-model:value="
                      invoice.userClientProfile.clientDataindividual.country
                    "
                    @focus="showDropdown"
                    @blur="hideDropdown"
                    @input="filterOptions"
                    placeholder="Select Country"
                    class="w-full"
                  />

                  <ul
                    v-show="showOptions"
                    class="dropdown absolute border rounded mt-2 overflow-y-auto w-full max-h-44 flex gap-2 flex-col bg-white text-left"
                  >
                    <li
                      v-for="option in filteredOptions"
                      :key="option.value"
                      @click="selectOption(option, $event)"
                      class="ml-2"
                    >
                      {{ option.label }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="">
                <p class="text-left ml-1  font-medium text-[14px]">
                  Postal Code
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.postalCode
                  "
                  type="number"
                  class=""
                  placeholder="Postal Code"
                />
              </div> 
              <div class="">
                <p class="text-left  font-medium text-[14px]"><span class="text-[#ff0000]">*</span>
                  State
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.state
                  "
                  type="text"
                  class=""
                  placeholder="State"
                />
              </div>
              <div class="">
                <p class="text-left ml-1  font-medium text-[14px]">
             City
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.city
                  "
                  placeholder="City"
                  type="text"
                  class=""
                />
              </div>
            
            </div>
            <hr class="my-4" />

            <div>
              <div>
                <p class="justify-start flex font-medium text-[14px]">Fax Number</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex font-medium text-[14px]">Website URL</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.websiteURL"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex font-medium text-[14px]">Notes</p>
                <a-textarea
                  v-model:value="invoice.userClientProfile.clientDataindividual.notes"
                  type="text"
                  class="w-full border p-2"
                />

                <hr class="mt-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="">
                    <p class="justify-start">Custom Field</p>

                    <a-input
                      v-model:value="invoice.userClientProfile.clientDataindividual.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div class="">
                   <a @click="addNewLine" class="ml-32">Add Custom Field</a>
                    <a-input
                      v-model:value="invoice.userClientProfile.clientDataindividual.customFieldValue"
                      type="text"
                      class="w-full border p-2 mt-6"
                      placeholder="Custom Field Value"
                    />
                  </div>
                </div> -->
              </div>
            </div>
            <div class="flex justify-between items-center"></div>
          </div>

         
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped></style>

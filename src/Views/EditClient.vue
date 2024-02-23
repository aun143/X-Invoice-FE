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

const invoice = useInvoiceStore();
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const clientId = route.params.clientId;
const clientDetails = ref("");
const showMore = ref(false);

const selectedField = ref("individual");
const selectField = (field) => {
  selectedField.value = field;
};

const dropdownTitle = "Actions";

const handleSaveDraftButtonClick = async () => {
  try {
    let dataToUpdate = null;

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

    // Update the client data
    const response = await updateClient(clientId, dataToUpdate);
    invoice.userClientProfile.clientDataindividual = {};
    // invoice.userClientProfile.clientDataOrganization = {};
    console.log("response",response)
    router.push("/AllClients");
    Swal.fire({
      icon: "success",
      title: "Client Updated ",
      text: "Client has been Updated successfully.",
    });
  } catch (error) {
    console.error("Error during client update:", error);
  }
};


const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 5, 
  });
};
// const validateFormOrg = () => {
//   const emptyFields = [];

// if (!invoice.userClientProfile.clientDataindividual.firstName) {
//     emptyFields.push("FirstName must be Alphaetic");
//   }
//   if (!invoice.userClientProfile.clientDataindividual.lastName) {
//     emptyFields.push("LastName must be Alphaetic");
//   }
//   if (!invoice.userClientProfile.clientDataindividual.phone) {
//     emptyFields.push("Phone Number");
//   }
//   if (!invoice.userClientProfile.clientDataindividual.email) {
//     emptyFields.push(" Email must contain '@'");
//   }if (!invoice.userClientProfile.clientDataindividual.state) {
//     emptyFields.push(" State must be Alphabetic");
//   }if (!invoice.userClientProfile.clientDataindividual.city) {
//     emptyFields.push(" City must be Alphaetic");
//   }
//   if (!invoice.userClientProfile.clientDataindividual.address1) {
//     emptyFields.push(" Address1 must be AlphNeumeric");
//   }
//   if (!invoice.userClientProfile.clientDataindividual.country) {
//     emptyFields.push("Country must be Alphaetic");
//   }

//   if (emptyFields.length > 0) {
//     const alertMessage = `Please fill in the following required fields: and ${emptyFields.join(", ")}`;
//     openNotificationWithIcon("error", alertMessage);
//     return false;
//   }

//   return true;
// };
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
  if (!invoice.userClientProfile.clientDataindividual.address1) {
    emptyFields.push(" Address1 must be AlphNeumeric");
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
const deletClient = async () => {
  try {
    //console.log("deletind clientId:", clientId);
    const status = await deleteClient(clientId);
    //console.log("delete client successfully:", status);
  } catch (error) {
    console.error("Error delete client:", error);
  }
};
const fetchclientDetails = async () => {
  try {
    isLoading.value = true;
    
    const response = await getSingleClient(clientId);
    const clientDetails = response;
    invoice.userClientProfile.clientDataindividual = {};
    invoice.userClientProfile.clientDataOrganization = {};
    if (selectedField.value === "individual") {
    // Update individual data
    invoice.userClientProfile.clientDataindividual = {
        ...clientDetails,
    };
} else if (selectedField.value === "organization") {
    // Update organization data
    invoice.userClientProfile.clientDataOrganization = {
        ...clientDetails,
    };
}

    //console.log("Client details fetched successfully:", clientDetails);
  } catch (error) {
    console.error("Error fetching client details:", error);
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  fetchclientDetails();
});
/////
const logoInputRef = ref(null);
const logoPreview = ref(null);
const handleFileInputChange = () => {
  displayImage(logoInputRef.value);
  //console.log("1st image");
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

const fontSize = "12px";
</script>


<template>

 <div class="bg-gray-200">
    <div class="bg-white">
  <Header
        headerTitle="Client"
        backButtonText="&nbsp &lt Back &nbsp  &nbsp"
        backRoute="Invoice"
        saveDraftButtonText=" Save Changes"
        :saveDraftButtonColor="Colors.orange"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="false"
        :showBackButton="false"
      />
</div>
<!-- {{invoice.userClientProfile.clientDataindividual.clientType}} -->
  <div class="modal-content max-h-full flex max-w-[800px] p-4 justify-start">
      <div class="flex">
        <div class="w-full p-8 bg-white">
          <div class="mb-4 flex ml-4">
            <label for="logoInput" class="">
              <div
                class="logo-placeholder border-none cursor-pointer   w-20 h-20 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
              >
                <img
                  v-if="selectedField === 'individual'"
                  src="../assets/3x.webp"
                  ref="logoPreview"
                  alt="Logo for Individual"
                  class="w-20 mb-4 h-20 cursor-pointer"
                />
                <img
                  v-if="selectedField === 'organization'"
                  src="../assets/3x.webp"
                  alt="Logo for Organization"
                  ref="logoPreview"
                  class="w-20 mb-4 h-20 cursor-pointer"
                />
              </div>
              <!-- <a-input
                id="logoInput"
                type="file"
                accept="image/*"
                class=""
                style="display: none"
                @change="handleFileInputChange"
                ref="logoInputRef"
              /> -->
            </label>

            <div class="flex-right w-48 ml-6">
              <table class=" border">
               
                <tr  v-if="invoice.userClientProfile.clientDataindividual.clientType === 'individual'">
                  <td>
                    <div
                      class="flex pl-4 my-6 cursor-pointer"
                      >
                      <!-- @click="selectField('individual')" -->
                      <p class="mb-1  mr-12">Individual</p>
                    </div>
                  </td>
                  <td>
                    <span
                     
                      class="text-orange-500 mr-4"
                      >&#10003;</span
                    >
                  </td>
                </tr><tr  v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                  <td>
                    <div
                      class="flex pl-4 my-6 cursor-pointer"
                      >
                      <!-- @click="selectField('organization')" -->
                      <p class="mb-1  mr-12">Organization</p>
                    </div>
                  </td>
                  <td>
                    <span
                     
                      class="text-orange-500 mr-4"
                      >&#10003;</span
                    >
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <br />

          <div v-if="selectedField === 'individual' || invoice.userClientProfile.clientDataindividual.clientType === 'individual'" :key="1">
            <div class="mb-4">
              <hr class="mb-4" />
              <div v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Organization Name</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.organizationName"
                  type="text"
                  placeholder="Organization Name"
                  class="w-full border p-2"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                  <a-input
                    v-model:value="invoice.userClientProfile.clientDataindividual.firstName"
                    type="text"
                    placeholder="First Name"
                    class="w-full border p-2"
                  />
                </div>
                <div>
                  <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                  <a-input
                    v-model:value="invoice.userClientProfile.clientDataindividual.lastName"
                    type="text"
                    placeholder="Last Name"
                    class="w-full border p-2"
                  />
                </div>
              </div>
              <hr class="mb-2 mt-8" />
            </div>
            <div>
              <div>
                <p class="text-left ml-4">Currency</p>
                <a-select
                  v-model:value="invoice.userClientProfile.clientDataindividual.currency"
                  class="ml-2 w-full"
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
              <hr class="mb-2 mt-8" />
              <div class="">
                <p class="text-left ml-4">Language</p>
                <a-select
                  v-model:value="invoice.userClientProfile.clientDataindividual.language"
                  class="ml-2 w-full"
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
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
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
            <div class="">
              <div class="mt-2 ">
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="invoice.userClientProfile.clientDataindividual.country"
                  class="ml-2 w-full"
                >
                  <a-select-option
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.label"
                  >
                    {{ country.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <hr class="mb-4 mt-4" />

            <div>
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-8" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr clas="mb-4 " />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.userClientProfile.clientDataindividual.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                />

                <hr class="mb-4" />
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

          <div v-else-if="selectedField === 'organization' || invoice.userClientProfile.clientDataindividual.clientType === 'organization'" :key="2">
            <div class="mb-4">
              <hr class="mb-4" />
              <div class="flex flex-col">
                <p class="justify-start flex">Organization Name</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.organizationName"
                  type="text"
                  placeholder="First Name"
                  class="border p-2"
                />

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>First Name</p>
                    <a-input
                      v-model:value="invoice.userClientProfile.clientDataindividual.firstName"
                      type="text"
                      placeholder="First Name"
                      class="w-full border p-2"
                    />
                  </div>
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                    <a-input
                      v-model:value="invoice.userClientProfile.clientDataindividual.lastName"
                      type="text"
                      placeholder="Last Name"
                      class="w-full border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr class="mb-4" />
            <div>
              <div>
                <div>
                  <p class="text-left ml-4">Currency</p>
                  <a-select
                    v-model:value="invoice.userClientProfile.clientDataindividual.currency"
                    class="ml-2 w-full"
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
                <hr class="mb-2 mt-8" />
                <div class="">
                  <p class="text-left ml-4">Language</p>
                  <a-select
                    v-model:value="invoice.userClientProfile.clientDataindividual.language"
                    class="ml-2 w-full"
                  >
                    <a-select-option
                      v-for="language in invoice.languageOptions"
                      :key="language.value"
                      :value="language.label"
                    >
                      {{ language.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <hr class="mb-2 mt-8" />
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input
                v-model:value="invoice.userClientProfile.clientDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
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
            <div class="">
              <div class="mt-2 mr-2">
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="invoice.userClientProfile.clientDataindividual.country"
                  class="ml-2 w-full"
                >
                  <a-select-option
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.label"
                  >
                    {{ country.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <hr class="mb-4 mt-4" />

            <div>
              <div>
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.taxId"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="invoice.userClientProfile.clientDataindividual.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.userClientProfile.clientDataindividual.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                />

                <hr class="mb-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p class="justify-start flex">Custom Field</p>

                    <a-input
                      v-model:value="invoice.userClientProfile.clientDataindividual.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div>
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
    </div></div>
</template>

<style scoped></style>

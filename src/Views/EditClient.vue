<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingleClient, updateClient,deleteClient } from "../service/clientService";
import Button from "../components/Button.vue";
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
const toggleShowMore = () => {
  showMore.value = !showMore.value;
};
const selectedField = ref("individual");
const selectField = (field) => {
  selectedField.value = field;
};

const dropdownTitle = "Actions";
const dropdownItems = [{ title: "Save Changes" }, { title: "Delete" }];
const handleDropdownItemClickParent = (clickedItem) => {
  // Handle the dropdown item click event in the parent component
  //console.log("Clicked item in parent component:", clickedItem);
  if (clickedItem.title === "Save Changes") {
    handleSaveDraftButtonClick();
  } else if (clickedItem.title === "Delete") {
    deletClient(clientId);
    router.push("/clients");
  }
};
const handleSaveDraftButtonClick = async () => {
  try {
    let dataToUpdate = null;
    // Check the profile type selected
    if (selectedField.value === "individual") {
      // Validate the individual form
      if (!validateFormInd()) {
        return; // Exit function if validation fails
      }
      dataToUpdate = invoice.clientDataindividual;
    } else if (selectedField.value === "organization") {
      // Validate the organization form
      if (!validateFormOrg()) {
        return; // Exit function if validation fails
      }
      dataToUpdate = invoice.clientDataOrganization;
    }

    const response = await updateClient(clientId, dataToUpdate);
    router.push("/clients");
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
const validateFormOrg = () => {
  const emptyFields = [];

if (!invoice.clientDataOrganization.firstName) {
    emptyFields.push("FirstName");
  }
  if (!invoice.clientDataOrganization.lastName) {
    emptyFields.push("LastName");
  }
  if (!invoice.clientDataOrganization.phone) {
    emptyFields.push("Phone Number");
  }
  if (!invoice.clientDataOrganization.email) {
    emptyFields.push(" Email must contain '@'");
  }if (!invoice.clientDataOrganization.state) {
    emptyFields.push(" State must be Alphabetic");
  }if (!invoice.clientDataOrganization.city) {
    emptyFields.push(" City must be Alphaetic");
  }
  if (!invoice.clientDataOrganization.address1) {
    emptyFields.push(" Address1");
  }
  if (!invoice.clientDataOrganization.country) {
    emptyFields.push("Country");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: and ${emptyFields.join(", ")}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const validateFormInd = () => {
  const emptyFields = [];

  if (!invoice.clientDataindividual.firstName) {
    emptyFields.push("FirstName");
  }
  if (!invoice.clientDataindividual.lastName) {
    emptyFields.push("LastName");
  } if (!invoice.clientDataindividual.phone) {
    emptyFields.push("Phone Number");
  }
  if (!invoice.clientDataindividual.email) {
    emptyFields.push(" Email must contain '@'");
  }if (!invoice.clientDataindividual.state) {
    emptyFields.push(" State must be Alphabetic");
  }if (!invoice.clientDataindividual.city) {
    emptyFields.push(" City must be Alphabetic");
  }
  if (!invoice.clientDataindividual.address1) {
    emptyFields.push(" Address1");
  }
  if (!invoice.clientDataindividual.country) {
    emptyFields.push("Country");
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
    if (selectedField.value === "individual") {
      invoice.clientDataindividual = {
        ...invoice.clientDataindividual,
        ...clientDetails,
      };
      
    } else if (selectedField.value === "organization") {
      invoice.clientDataOrganization = {
        ...invoice.clientDataOrganization,
        ...clientDetails,
      };
    }
    //console.log("clientDetails>>>", clientDetails.firstName);

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
    :dropdownTitle="dropdownTitle"
    :showDraftButton="true"
    :showBackButton="false"
    backButtonText=" &nbsp &lt Back &nbsp  &nbsp "
    :dropdownItems="dropdownItems"
    :saveDraftButtonColor="Colors.orange"
    :showDropdown="true"
    :onDropdownItemClick="handleDropdownItemClickParent"
  />
</div>
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
                <tr class="border">
                  <td>
                    <div
                      class="flex pl-4 cursor-pointer"
                      @click="selectField('individual')"
                    >
                      <p class="mb-1 mt-4">Individual</p>
                    </div>
                  </td>
                  <td>
                    <span
                      v-if="selectedField === 'individual'"
                      class="text-orange-500"
                      >&#10003;</span
                    >
                  </td>
                </tr>
                <tr>
                  <td>
                    <div
                      class="flex pl-4 cursor-pointer"
                      @click="selectField('organization')"
                    >
                      <p class="mb-1 mt-2 mr-12">Organization</p>
                    </div>
                  </td>
                  <td>
                    <span
                      v-if="selectedField === 'organization'"
                      class="text-orange-500"
                      >&#10003;</span
                    >
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <br />

          <div v-if="selectedField === 'individual'" :key="1">
            <div class="mb-4">
              <hr class="mb-4" />
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                  <a-input
                    v-model:value="invoice.clientDataindividual.firstName"
                    type="text"
                    placeholder="First Name"
                    class="w-full border p-2"
                  />
                </div>
                <div>
                  <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                  <a-input
                    v-model:value="invoice.clientDataindividual.lastName"
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
                  v-model:value="invoice.clientDataindividual.currency"
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
                  v-model:value="invoice.clientDataindividual.language"
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
                v-model:value="invoice.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input
                v-model:value="invoice.clientDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <a-input
                v-model:value="invoice.clientDataindividual.address1"
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input
                v-model:value="invoice.clientDataindividual.address2"
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="">
              <div class="mt-2 ">
                <a-input
                  v-model:value="invoice.clientDataindividual.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input
                  v-model:value="invoice.clientDataindividual.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input
                  v-model:value="invoice.clientDataindividual.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="invoice.clientDataindividual.country"
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
                  v-model:value="invoice.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-8" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="invoice.clientDataindividual.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr clas="mb-4 " />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.clientDataindividual.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                />

                <hr class="mb-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="">
                    <p class="justify-start">Custom Field</p>

                    <a-input
                      v-model:value="invoice.clientDataindividual.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div class="">
                   <a @click="addNewLine" class="ml-32">Add Custom Field</a>
                    <a-input
                      v-model:value="invoice.clientDataindividual.customFieldValue"
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

          <div v-else-if="selectedField === 'organization'" :key="2">
            <div class="mb-4">
              <hr class="mb-4" />
              <div class="flex flex-col">
                <p class="justify-start flex">Organization Name</p>
                <a-input
                  v-model:value="invoice.clientDataOrganization.organizationName"
                  type="text"
                  placeholder="First Name"
                  class="border p-2"
                />

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>First Name</p>
                    <a-input
                      v-model:value="invoice.clientDataOrganization.firstName"
                      type="text"
                      placeholder="First Name"
                      class="w-full border p-2"
                    />
                  </div>
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                    <a-input
                      v-model:value="invoice.clientDataOrganization.lastName"
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
                    v-model:value="invoice.clientDataOrganization.currency"
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
                    v-model:value="invoice.clientDataOrganization.language"
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
                v-model:value="invoice.clientDataOrganization.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input
                v-model:value="invoice.clientDataOrganization.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <a-input
                v-model:value="invoice.clientDataOrganization.address1"
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input
                v-model:value="invoice.clientDataOrganization.address2"
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="">
              <div class="mt-2 mr-2">
                <a-input
                  v-model:value="invoice.clientDataOrganization.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input
                  v-model:value="invoice.clientDataOrganization.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input
                  v-model:value="invoice.clientDataOrganization.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="invoice.clientDataOrganization.country"
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
                  v-model:value="invoice.clientDataOrganization.taxId"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="invoice.clientDataOrganization.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="invoice.clientDataOrganization.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.clientDataOrganization.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                />

                <hr class="mb-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p class="justify-start flex">Custom Field</p>

                    <a-input
                      v-model:value="invoice.clientDataOrganization.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div>
                    <a @click="addNewLine" class="ml-32">Add Custom Field</a>
                    <a-input
                      v-model:value="invoice.clientDataOrganization.customFieldValue"
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

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingleClient, updateClient,deleteClient } from "../service/ClientService";
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

const selectedField = ref("individual");
const selectField = (field) => {
  selectedField.value = field;
};

const dropdownTitle = "Actions";
const dropdownItems = [{ title: "Edit Client" }, { title: "Delete Client" }];
const handleDropdownItemClickParent = (clickedItem) => {
  // Handle the dropdown item click event in the parent component
  //console.log("Clicked item in parent component:", clickedItem);
  if (clickedItem.title === "Edit Client") {
    router.push(`/ViewClient/${clientId}/edit`);
  } else if (clickedItem.title === "Delete Client") {
    deletClient(clientId);
    router.push("/AllClients"); 
  }
};



const deletClient = async () => {
  try {
    //console.log("deletind clientId:", clientId);
    const status = await deleteClient(clientId);
    Swal.fire({
      icon: "success",
      title: " Client Deleted ",
      text: " Client has been Deleted Successfully.",
    });
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
          <div class=" flex ">
            <div class="text-[20px] font-semibold"> Single Client View: (Readonly) </div>
            
            <label for="logoInput" class="">
              
              <!-- <div
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
              </div> -->
              <!-- <a-input readonly
                id="logoInput"
                type="file"
                accept="image/*"
                class=""
                style="display: none"
                @change="handleFileInputChange"
                ref="logoInputRef"
              /> -->
            </label>

            <!-- <div class="flex-right w-48 ml-6">
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
            </div> -->
          </div>
          <span class="font-medium text-[15px]"> {{ invoice.userClientProfile.clientDataindividual.clientType }} Profile</span>
          <br />

          <div v-if="selectedField === 'individual'" :key="1">
            <div class="mb-4">
              <hr class="mb-4" />
              <div v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Organization Name</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.organizationName"
                  type="text"
                  placeholder="Organization Name"
                  class="w-full border p-2"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                  <a-input readonly
                    v-model:value="invoice.userClientProfile.clientDataindividual.firstName"
                    type="text"
                    placeholder="First Name"
                    class="w-full border p-2"
                  />
                </div>
                <div>
                  <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                  <a-input readonly
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
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.currency"
                  class="ml-2 w-full"
                >
                  <!-- <a-select-option disabled
                    v-for="currency in invoice.currencyOptions"
                    :key="currency.value"
                    :value="currency.value"
                  >
                    {{ currency.label }}
                  </a-select-option> -->
                </a-input>
              </div>
              <hr class="mb-2 mt-8" />
              <div class="">
                <p class="text-left ml-4">Language</p>
                <a-input readonly 
                  v-model:value="invoice.userClientProfile.clientDataindividual.language"
                  class="ml-2 w-full"
                >
                  
                </a-input>
              </div>
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.address1"
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.address2"
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="">
              <div class="mt-2 ">
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.country"
                  class="ml-2 w-full"
                >
                  <!-- <a-select-option  disabled
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.label"
                  >
                    {{ country.label }} 
                  </a-select-option>-->
                </a-input>
              </div>
            </div>
            <hr class="mb-4 mt-4" />

            <div>
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-8" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr clas="mb-4 " />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea readonly 
                  v-model:value="invoice.userClientProfile.clientDataindividual.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                  style="resize: none;" 
                />

                <hr class="mb-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="">
                    <p class="justify-start">Custom Field</p>

                    <a-input readonly
                      v-model:value="invoice.clientDataindividual.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div class="">
                   <a @click="addNewLine" class="ml-32">Add Custom Field</a>
                    <a-input readonly
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
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.organizationName"
                  type="text"
                  placeholder="First Name"
                  class="border p-2"
                />

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>First Name</p>
                    <a-input readonly
                      v-model:value="invoice.userClientProfile.clientDataOrganization.firstName"
                      type="text"
                      placeholder="First Name"
                      class="w-full border p-2"
                    />
                  </div>
                  <div>
                    <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                    <a-input readonly
                      v-model:value="invoice.userClientProfile.clientDataOrganization.lastName"
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
                  <a-select readonly 
                    v-model:value="invoice.userClientProfile.clientDataOrganization.currency"
                    class="ml-2 w-full"
                  >
                    <a-select-option readonly
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
                  <a-input readonly
                    v-model:value="invoice.userClientProfile.clientDataOrganization.language"
                    class="ml-2 w-full"
                  >
                    <!-- <a-select-option readonly
                      v-for="language in invoice.languageOptions"
                      :key="language.value"
                      :value="language.label"
                    >
                      {{ language.label }}
                    </a-select-option> -->
                  </a-input>
                </div>
              </div>
              <hr class="mb-2 mt-8" />
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="mb-2 mt-8" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.address1"
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.address2"
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="">
              <div class="mt-2 mr-2">
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.city"
                  placeholder="City"
                  type="text"
                  class="mr-2 w-[30%]"
                />
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.state"
                  type="text"
                  class="mr-2 w-[30%]"
                  placeholder="State"
                />
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.postalCode"
                  type="number"
                  class="mr-2 w-[30%]"
                  placeholder="Postal Code"
                />
              </div>
              <div class="">
                <p class="text-left ml-4"><span class="text-[#ff0000]">*</span>Country</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.country"
                  class="ml-2 w-full"
                >
                  <a-select-option readonly
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.label"
                  >
                    {{ country.label }}
                  </a-select-option>
                </a-input>
              </div>
            </div>
            <hr class="mb-4 mt-4" />

            <div>
              <div>
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.taxId"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr class="mb-4 mt-4" />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.userClientProfile.clientDataOrganization.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                  style="resize: none;" 
                />

                <hr class="mb-4" />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p class="justify-start flex">Custom Field</p>

                    <a-input readonly
                      v-model:value="invoice.clientDataOrganization.customFieldName"
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div>
                    <a @click="addNewLine" class="ml-32">Add Custom Field</a>
                    <a-input readonly
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



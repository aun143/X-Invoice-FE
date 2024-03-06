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
const logoPreview = ref(null);


const fontSize = "12px";
</script>

<template>
<div v-if="isLoading" class="flex justify-center items-center">
  <a-space class="w-full flex h-96 justify-center items-center">
    <a-spin size="large" />
  </a-space>
</div>

<div v-else  class="bg-gray-200">
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
  <div class="modal-content max-h-full flex max-w-[800px] px-4 pt-4 justify-start">
      <div class="flex">
        <div class="w-full p-8 lg:w-[70%] 2xl:w-[100%] xl:w-[80%] bg-white">
          <div class=" flex ">
            <div class="text-[20px] font-semibold"> Single Client View: (Readonly) </div>
            
            <label for="logoInput" class="">
              
             <div
                class="logo-placeholder border-[1px] ml-[100%] justify-end items-end flex w-32 h-auto place-items-end text-slate-500 text-6xl font-bold"
              >
              <img
                    :src="invoice.userClientProfile.clientDataindividual.url ? invoice.userClientProfile.clientDataindividual.url : 'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'"
                    ref="logoPreview"
                    alt="Logo for Individual"
                    class="w48 h-auto cursor-pointer"
                />
                
              </div> 
            
            </label>

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
              <hr class="my-4" />
            </div>
            <div>
              <div>
                <p class="text-left ml-4">Currency</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.currency"
                  class="ml-2 w-full"
                >
                  
                </a-input>
              </div>
              <hr class="my-4" />
              <div class="">
                <p class="text-left ml-4">Language</p>
                <a-input readonly 
                  v-model:value="invoice.userClientProfile.clientDataindividual.language"
                  class="ml-2 w-full"
                >
                  
                </a-input>
              </div>
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataindividual.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
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
            <div class="flex justify-between items-center mt-3">
              <div class="">
    <p class="text-left"> <span class="text-[#ff0000]">*</span>Country</p>
    <a-select
      v-model:value="invoice.userClientProfile.clientDataindividual.country"
      class="mr-2 "
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
  <div class="mt-2 flex">
    <a-input 
      v-model:value="invoice.userClientProfile.clientDataindividual.postalCode"
      type="number"
      class="mr-2 mt-3"
      placeholder="Postal Code"
    />
    <a-input
      v-model:value="invoice.userClientProfile.clientDataindividual.state"
      type="text"
      class="mr-2 mt-3 "
      placeholder="State"
    />


  <a-input
      v-model:value="invoice.userClientProfile.clientDataindividual.city"
      placeholder="City"
      type="text"
      class="mr-2 mt-3"
    />

  </div>

</div>

            <hr class="my-4" />

            <div>
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataindividual.websiteURL"
                  type="text"
                  class="w-full border p-2 mb-4"
                />
              </div>
              <hr clas=" " />
              <div>
                <p class="justify-start flex mt-4">Notes</p>
                <a-textarea readonly 
                  v-model:value="invoice.userClientProfile.clientDataindividual.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2 mb-4"
                  style="resize: none;" 
                />

                <hr class="mb-4" />
                
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
                <hr class="my-4" />
                <div class="">
                  <p class="text-left ml-4">Language</p>
                  <a-input readonly
                    v-model:value="invoice.userClientProfile.clientDataOrganization.language"
                    class="ml-2 w-full"
                  >
                    
                  </a-input>
                </div>
              </div>
              <hr class="my-4" />
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.email"
                type="email"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <a-input readonly
                v-model:value="invoice.userClientProfile.clientDataOrganization.phone"
                type="number"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
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
            <div class="flex justify-between items-center mt-3">
              <div class="">
    <p class="text-left"> <span class="text-[#ff0000]">*</span>Country</p>
    <a-select
      v-model:value="invoice.userClientProfile.clientDataOrganization.country"
      class="mr-2 "
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
  <div class="mt-2 flex">
    <a-input 
      v-model:value="invoice.userClientProfile.clientDataOrganization.postalCode"
      type="number"
      class="mr-2 mt-3"
      placeholder="Postal Code"
    />
    <a-input
      v-model:value="invoice.userClientProfile.clientDataOrganization.state"
      type="text"
      class="mr-2 mt-3 "
      placeholder="State"
    />


  <a-input
      v-model:value="invoice.userClientProfile.clientDataOrganization.city"
      placeholder="City"
      type="text"
      class="mr-2 mt-3"
    />

  </div>

</div>

                     <hr class="my-4" />

            <div>
              <div>
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.taxId"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.faxNumber"
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.websiteURL"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="invoice.userClientProfile.clientDataOrganization.notes"
                  rows="4"
                  type="text"
                  class="w-full border p-2"
                  style="resize: none;" 
                />

                <hr class="my-4" />
              </div>
            </div>
            <div class="flex justify-between items-center"></div>
          </div>
        </div>
      </div>
    </div></div>
</template>



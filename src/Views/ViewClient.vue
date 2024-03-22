<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingleClient,deleteClient } from "../service/ClientService";
import Button from "../components/Button.vue";
import { Colors } from "../utils/color";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { notification } from "ant-design-vue";
import Swal from "sweetalert2";
import { getAllInvoice } from "../service/IndexService";


const invoice = useInvoiceStore();
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const clientId = route.params.clientId;
const clientDetails = ref("");
const invoices  = ref("");
const showMore = ref(false);

const selectedField = ref("individual");
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


const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 3,
  });
};
const deletClient = async () => {
  try {
    // Check if client data is associated with any invoices
    const invoicesWithClient = invoices.value.filter(invoice => {
      return invoice.receiver === clientId;
    });

    if (invoicesWithClient.length > 0) {
      // Client data is associated with invoices
      const invoiceNumbers = invoicesWithClient.map(invoice => invoice.invoiceNumber).join(', ');
      const errorMessage = `Cannot delete Client as it is associated with the following invoice(s):${invoiceNumbers}`;
      Swal.fire({
        icon: "error",
        title: "Client Deletion Error",
        text: errorMessage
      });
    } else {
      // No invoices associated with the client, proceed with deletion
      const status = await deleteClient(clientId);
      Swal.fire({
        icon: "success",
        title: "Client Deleted",
        text: "Client has been deleted successfully."
      });
      // Redirect or handle as needed after successful deletion
      router.push("/AllClients");
    }
  } catch (error) {
    console.error("Error deleting client:", error);
    // Handle error if needed
  }
};

const AllInvoice = async () => {
  try {
    isLoading.value = true;

    const { success, data, error } = await getAllInvoice();

    if (!success) {
      throw new Error(error || 'Failed to get invoices.');
    }

    const invoicesWithReceiverNames = await Promise.all(data.map(async (invoice) => {
      try {
        const { success, data, error } = await getSingleClient(invoice.receiver);
        
        if (success) {
          const receiverDetails = data;
          const receiverName = receiverDetails.firstName + " " + receiverDetails.lastName;
          return { ...invoice, receiverName };
        } else {
          console.log("Error fetching client details:", error);
          // If there's an error fetching client details, return the invoice without the receiver name
          return { ...invoice, receiverName: "Receiver Details Unavailable" };
        }
      } catch (error) {
        console.log("Error fetching client details:", error);
        // If there's an error fetching client details, return the invoice without the receiver name
        return { ...invoice, receiverName: "Receiver Details Unavailable" };
      }
    }));

    invoices.value = invoicesWithReceiverNames;

    // Handle success as needed
    // console.log("Success During Invoice get:", success);
  } catch (error) {
    console.error("Error During Invoice Get:", error);
    // Handle error if needed
    // openNotificationWithIcon("error", "An error occurred while getting the Invoice.");
  } finally {
    isLoading.value = false;
  }
};
const fetchclientDetails = async () => {
  try {
    isLoading.value = true;
        //console.log("Client details fetched successfully:", clientDetails);
    const { success, data, error } = await getSingleClient(clientId);

if (success) {
  const clientDetails = data;

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


onMounted(() => {
  fetchclientDetails();
  AllInvoice();
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
  <div class="modal-content max-h-full flex max-w-[100%] px-4 pt-4 justify-start">
      <div class="flex">
        <div class="w-full p-8  bg-white">
          <div class="flex"><div class="logo-placeholder mb-4 border-none cursor-pointer  border-2 grid ">
            <img
                    :src="invoice.userClientProfile.clientDataindividual.url ? invoice.userClientProfile.clientDataindividual.url : 'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'"
                    ref="logoPreview"
                    alt="Logo for Individual"
                    class="w-20 mb-4 h-20 cursor-pointer"
                />
          </div>
         <div class="flex ">
          <div class="flex flex-col mb-6 justify-center items-center text-2xl ml-6"> <strong>Single Client View: (Readonly) </strong>
          <div class="">{{ invoice.userClientProfile.clientDataindividual.clientType }} Profile</div>
        </div>
        </div>
</div>
          <div v-if="selectedField === 'individual'" :key="1">
            <div class="mb-4">
              <hr class="mb-4" />
              <div v-if="invoice.userClientProfile.clientDataindividual.clientType === 'organization'">
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Organization Name</p>
              <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.organizationName }}</span></div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                  <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.firstName }}</span></div>
                </div>
                <div>
                  <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Last Name</p>
                  <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.lastName }}</span></div>
                </div>
              </div>
              <hr class="my-4" />
            </div>
            <div>
              <div>
                <p class="text-left ml-2">Currency</p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.currency }}</span></div>

              </div>
              <hr class="my-4" />
              <div class="">
                <p class="text-left ml-2">Language</p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.language }}</span></div>

              </div>
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Email Address</p>
              <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.email }}</span></div>

            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Phone Number</p>
              <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.phone }}</span></div>
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex"><span class="text-[#ff0000]">*</span>Address(Line 1)</p>
              <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.address1 }}</span></div>
              <div class="border rounded-lg text-left py-2 mt-2"><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.address2 }}</span></div>

            </div>
            <div class=" justify-between items-center grid grid-cols-2 mt-1 gap-2">
              <div class="">
                <p class="text-left">
                  <span class="text-[#ff0000]">*</span>Country
                </p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.country }}</span></div>
              </div>
              <div class="">
                <p class="text-left">
                  Postal Code
                </p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.postalCode }}</span></div>

              </div> 
              <div class="">
                <p class="text-left">
                  State
                </p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.state }}</span></div>

              </div>
              <div class="">
                <p class="text-left">
             City
                </p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.city }}</span></div>

              </div>
            
            </div>

            <hr class="mt-4" />

            <div class="mt-2">
              <div>
                <p class="justify-start flex">Fax Number</p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2">{{ invoice.userClientProfile.clientDataindividual.faxNumber }}</span></div>

              </div>
              <hr class="mt-4" />
              <div class="my-4">
                <p class="justify-start flex">Website URL</p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2 ">{{ invoice.userClientProfile.clientDataindividual.websiteURL }}</span></div>

              </div>
              <hr clas=" " />
              <div class="my-4">
                <p class="justify-start flex mt-4">Notes</p>
                <div class="border rounded-lg text-left py-2 "><span class="ml-2 ">{{ invoice.userClientProfile.clientDataindividual.notes }}</span></div>

                
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
                  <a-select readonly  style="text-align: left;" size="large"
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
    <a-select  readonly size="large"
      v-model:value="invoice.userClientProfile.clientDataOrganization.country"
      class="mr-2 text-left "
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
    <a-input readonly
      v-model:value="invoice.userClientProfile.clientDataOrganization.postalCode"
      type="number"
      class="mr-2 mt-3"
      placeholder="Postal Code"
    />
    <a-input readonly
      v-model:value="invoice.userClientProfile.clientDataOrganization.state"
      type="text"
      class="mr-2 mt-3 "
      placeholder="State"
    />


  <a-input readonly
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
                <a-textarea readonly
                  v-model:value="invoice.userClientProfile.clientDataOrganization.notes"
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
<style>
select {
  border: none !important;
  background: none;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
}</style>


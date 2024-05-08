<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingleClient, deleteClient } from "../service/ClientService";
import Button from "../components/Button.vue";
import { Colors } from "../utils/color";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { notification } from "ant-design-vue";
import { getAllInvoice } from "../service/IndexService";

const invoice = useInvoiceStore();
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const clientId = route.params.clientId;
const clientDetails = ref("");
const invoices = ref("");
const showMore = ref(false);

const selectedField = ref("individual");
const dropdownTitle = "Actions";
const dropdownItems = [{ title: "Edit Client" }, { title: "Delete Client" }];
const handleDropdownItemClickParent = (clickedItem) => {
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
    const invoicesWithClient = invoices.value.filter((invoice) => {
      return invoice.receiver === clientId;
    });

    if (invoicesWithClient.length > 0) {
      // Client data is associated with invoices
      const invoiceNumbers = invoicesWithClient
        .map((invoice) => invoice.invoiceNumber)
        .join(", ");
      const errorMessage = `Cannot delete Client as it is associated with the following invoice(s):${invoiceNumbers}`;
      openNotificationWithIcon(
        "error",
        errorMessage || "Error During Client Deletion"
      );
    } else {
      // No invoices associated with the client, proceed with deletion
      const status = await deleteClient(clientId);
      openNotificationWithIcon("success", "Client Deleted Sucessfully");

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
      throw new Error(error || "Failed to get invoices.");
    }

    const invoicesWithReceiverNames = await Promise.all(
      data.map(async (invoice) => {
        try {
          const { success, data, error } = await getSingleClient(
            invoice.receiver
          );

          if (success) {
            const receiverDetails = data;
            const receiverName =
              receiverDetails.firstName + " " + receiverDetails.lastName;
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
      })
    );

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
      clientDetails.value = data;

      // if (selectedField.value === "individual") {
      //   // Update individual data
      //   invoice.userClientProfile.clientDataindividual = {
      //     ...clientDetails,
      //   };
      // } else if (selectedField.value === "organization") {
      //   // Update organization data
      //   invoice.userClientProfile.clientDataOrganization = {
      //     ...clientDetails,
      //   };
      // }
    } else {
      console.error("Error During Client Get:", error);
      openNotificationWithIcon(
        "error",
        error || "Error During fetching Client"
      );

      if (
        error === "Your subscription plan has expired. Please update your plan."
      ) {
        router.push("/subscription");
      } else {
        openNotificationWithIcon("error", error);
      }
    }
  } catch (error) {
    console.error("Error During Client Get:", error);
    openNotificationWithIcon(
      "error",
      "An error occurred while Getting the client."
    );
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchclientDetails();
  AllInvoice();
});
const logoPreview = ref(null);
</script>
<template>
  <div v-if="isLoading" class="flex justify-center items-center">
    <a-space class="w-full flex h-96 justify-center items-center">
      <a-spin size="large" />
    </a-space>
  </div>

  <div v-else class="bg-gray-300">
    <div class="bg-white">
      <Header
        headerTitle="Client"
        :dropdownTitle="dropdownTitle"
        :showDraftButton="true"
        :showBackButton="false"
        backButtonText=" &nbsp &lt Back &nbsp &nbsp "
        :dropdownItems="dropdownItems"
        :saveDraftButtonColor="Colors.orange"
        :showDropdown="true"
        :onDropdownItemClick="handleDropdownItemClickParent"
      />
    </div>
    <div class="bg-gray-200 h-[max-content]">
      <div
        class="h-[max-content] w-[100%] md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[50%] p-4 justify-start"
      >
        <div class="flex">
          <div class="w-full p-8 bg-gray-100">
            <div class="flex">
              <div
                class="logo-placeholder mb-4 border-none cursor-pointer border-2 grid"
              >
                <img
                  :src="
                    clientDetails.url || 'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'
                  "
                  ref="logoPreview"
                  alt="Logo for Individual"
                  class="w-20 mb-4 h-20 cursor-pointer"
                />
              </div>
              <div class="flex">
                <div
                  class="flex flex-col mb-6 justify-center items-center text-2xl ml-6"
                >
                  <strong>Single Client View: (Readonly) </strong>
                  <div class="">
                    {{
                      clientDetails.clientType
                    }}
                    Profile
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <hr class="mb-4" />
                <div
                  v-if="
                    clientDetails
                      .clientType === 'organization'
                  "
                >
                  <p class="justify-start flex font-medium text-[14px]">
                    <span class="text-[#ff0000]">*</span>Organization Name
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails
                        .organizationName
                    }}</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p class="justify-start flex font-medium text-[14px]">
                      <span class="text-[#ff0000]">*</span>First Name
                    </p>
                    <div class="border rounded-lg text-left py-2">
                      <span class="ml-2">{{
                        clientDetails.firstName
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="justify-start flex font-medium text-[14px]">
                      <span class="text-[#ff0000]">*</span>Last Name
                    </p>
                    <div class="border rounded-lg text-left py-2">
                      <span class="ml-2">{{
                        clientDetails.lastName
                      }}</span>
                    </div>
                  </div>
                </div>
                <hr class="my-4" />
              </div>
              <div>
                <div>
                  <p class="text-left ml-2 font-medium text-[14px]">Currency</p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.currency
                    }}</span>
                  </div>
                </div>
                <hr class="my-4" />
                <div class="">
                  <p class="text-left ml-2 font-medium text-[14px]">Language</p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.language
                    }}</span>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex font-medium text-[14px]">
                  <span class="text-[#ff0000]">*</span>Email Address
                </p>
                <div class="border rounded-lg text-left py-2">
                  <span class="ml-2">{{
                    clientDetails.email
                  }}</span>
                </div>
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex font-medium text-[14px]">
                  <span class="text-[#ff0000]">*</span>Phone Number
                </p>
                <div class="border rounded-lg text-left py-2">
                  <span class="ml-2">{{
                    clientDetails.phone
                  }}</span>
                </div>
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex font-medium text-[14px]">
                  <span class="text-[#ff0000]">*</span>Address(Line 1)
                </p>
                <div class="border rounded-lg text-left py-2">
                  <span class="ml-2">{{
                    clientDetails.address1
                  }}</span>
                </div>
                <div class="border rounded-lg text-left py-2 mt-2">
                  <span class="ml-2">{{
                    clientDetails.address2
                  }}</span>
                </div>
              </div>
              <div
                class="justify-between items-center grid grid-cols-2 mt-1 gap-2"
              >
                <div class="">
                  <p class="text-left font-medium text-[14px]">
                    <span class="text-[#ff0000]">*</span>Country
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.country
                    }}</span>
                  </div>
                </div>
                <div class="">
                  <p class="text-left ml-2 font-medium text-[14px]">
                    Postal Code
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.postalCode
                    }}</span>
                  </div>
                </div>
                <div class="">
                  <p class="text-left font-medium text-[14px]">
                    <span class="text-[#ff0000]">*</span> State
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.state
                    }}</span>
                  </div>
                </div>
                <div class="">
                  <p class="text-left ml-2 font-medium text-[14px]">City</p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.city
                    }}</span>
                  </div>
                </div>
              </div>

              <hr class="mt-4" />
              <div
                  v-if="
                    clientDetails
                      .clientType === 'organization'
                  "
                >
                <p
                    class="justify-start ml-2 flex font-medium text-[14px] mt-4"
                  >
                  Tax Identification Number
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.taxId
                    }}</span>
                  </div>
                </div>

              <div class="mt-2">
                <div>
                  <p class="justify-start flex font-medium text-[14px] ml-2">
                    Fax Number
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.faxNumber
                    }}</span>
                  </div>
                </div>
                <hr class="mt-4" />
                <div class="my-4">
                  <p class="justify-start ml-2 flex font-medium text-[14px]">
                    Website URL
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails.websiteURL
                    }}</span>
                  </div>
                </div>
                <hr clas=" " />
                <div
                  v-if="
                    clientDetails
                      .clientType === 'organization'
                  "
                >
                <p
                    class="justify-start ml-2 flex font-medium text-[14px] mt-4"
                  >
                    Notes
                  </p>
                  <div class="border rounded-lg text-left py-2">
                    <span class="ml-2">{{
                      clientDetails
                        .notes
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
}
</style>

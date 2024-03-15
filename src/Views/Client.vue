<script setup>
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { clientApi } from "../service/ClientService";
// import Button from "../components/Button.vue";
import { Colors } from "../utils/color";
import Header from "../components/Header.vue";
import { useInvoiceStore } from "../stores/index";
import { notification } from "ant-design-vue";
import {BASE_URL} from "../utils/config";
import {uploadImage} from "../service/UploadImage"

const router = useRouter();
const isLoading = ref(false);
const isLoadingImg = ref(false);
const submitclientDataOrganization = async () => {
  if (isLoadingImg.value) {
    openNotificationWithIcon("error", "Please Wait To upload Image First");
    return;
  }

  try {
    isLoading.value = true;
    // if (!validateFormOrg()) return;
    const clientData = {
      ...invoice.userClientProfile.clientDataOrganization,
      clientType: "organization",
    };
    const { success, data, error } = await clientApi(clientData);

    if (success) {
      router.push("/AllClients");
      Swal.fire({
        icon: "success",
        title: "Client Created",
        text: data.message || "Client has been Created successfully.",
      });
    } else {
      console.error("Error During Client organization:", error);
      Swal.fire({
        icon: "error",
        title: "Error During Client creation",
        text: error || "An error occurred while creating the client.",
      });
      if (error === "Your subscription plan has expired. Please update your plan.") {
        router.push("/subscription");
      } else {
        openNotificationWithIcon("error", error);
      }
    }
  } catch (error) {
    console.error("Error During Client organization:", error);
    openNotificationWithIcon("error", "An error occurred while creating the client.");
  } finally {
    isLoading.value = false;
  }
};
const submitclietDataindividual = async () => {
  if (isLoadingImg.value) {
    openNotificationWithIcon("error", "Please Wait To upload Image First");
    return;
  }

  try {
    isLoading.value = true;
    // if (!validateFormInd()) return;
    const clientData = {
      ...invoice.userClientProfile.clientDataindividual,
      clientType: "individual",
    };
    const { success, data, error } = await clientApi(clientData);

    if (success) {
      router.push("/AllClients");
      Swal.fire({
        icon: "success",
        title: "Client Created",
        text: data.message || "Client has been Created successfully.",
      });
    } else {
      console.error("Error During Client organization:", error);
      Swal.fire({
        icon: "error",
        title: "Error During Client creation",
        text: error || "An error occurred while creating the client.",
      });
      if (error === "Your subscription plan has expired. Please update your plan.") {
        router.push("/subscription");
      } else {
        openNotificationWithIcon("error", error);
      }
    }
  } catch (error) {
    console.error("Error During Client organization:", error);
    openNotificationWithIcon("error", "An error occurred while creating the client.");
  } finally {
    isLoading.value = false;
  }
};

// const submitclietDataindividual = async () => {
//   if(isLoadingImg.value){
//   openNotificationWithIcon("error", "Please Wait To upload Image First");
//   return;
//  }
//   try {
//     isLoading.value=true
//     if (!validateFormInd()) return;
//     const clientData = {
//       ...invoice.userClientProfile.clientDataindividual,
//       clientType: "individual",
//     };
//     const response = await clientApi(clientData);
//     if (response) {
//       router.push("/AllClients");
//       Swal.fire({
//       icon: "success",
//       title: "Client Created ",
//       text: "Client has been Created successfully.",
//     });
//     }

//     else{
//       console.log("resp" , response);
//       Swal.fire({
//       icon: "error",
//       title: "Error During ",
//       text: response.message,
//     });
//     }


//   } catch (error) {
//     console.log("error",error)
//     let errorMessage = "An error occurred while creating the client.";
//     if (error.response && error.response.data && error.response.data.message) {
//       errorMessage = error.response.data.message;
//     }
//     if (errorMessage === "Your subscription plan has expired. Please update your plan.") {
//       // Specific handling for subscription expiration error
//       // For example, redirect to subscription page
//       router.push("/subscription");
//     } else {
//       openNotificationWithIcon("error", errorMessage);
//       console.error("Error During Client organization:", error);
//     }
//   }finally{
//     isLoading.value=false;
//   }
// };
const invoice = useInvoiceStore();
const validateFormOrg = () => {
  const emptyFields = [];

  if (!invoice.userClientProfile.clientDataOrganization.firstName) {
    emptyFields.push("FirstName must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataOrganization.lastName) {
    emptyFields.push("LastName must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataOrganization.phone) {
    emptyFields.push("Phone Number");
  }
  if (!invoice.userClientProfile.clientDataOrganization.email) {
    emptyFields.push(" Email must contain '@'");
  } else if (
    !invoice.userClientProfile.clientDataOrganization.email.includes("@") ||
    !/.+\@.+\..+/.test(invoice.userClientProfile.clientDataOrganization.email)
  ) {
    emptyFields.push("Email must be valid and contain '@'.");
  }
  if (!invoice.userClientProfile.clientDataOrganization.city) {
    emptyFields.push(" City must be Alphaetic");
  }
  // if (!invoice.userClientProfile.clientDataOrganization.address1) {
  //   emptyFields.push(" Address1 must be AlphaNeumeric");
  // }
  if (!invoice.userClientProfile.clientDataOrganization.country) {
    emptyFields.push("Country must be Alphabetic");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: and ${emptyFields.join(
      ", "
    )}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const validateFormInd = () => {
  const emptyFields = [];

  if (!invoice.userClientProfile.clientDataindividual.firstName) {
    emptyFields.push("FirstName  must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataindividual.lastName) {
    emptyFields.push("LastName  must be Alphabetic");
  }
  if (!invoice.userClientProfile.clientDataindividual.phone) {
    emptyFields.push("Phone Number");
  }
  if (!invoice.userClientProfile.clientDataindividual.email) {
    emptyFields.push(" Email must contain '@'");
  } else if (
    !invoice.userClientProfile.clientDataindividual.email.includes("@") ||
    !/.+\@.+\..+/.test(invoice.userClientProfile.clientDataindividual.email)
  ) {
    emptyFields.push("Email must be valid and contain '@'.");
  }
  if (!invoice.userClientProfile.clientDataindividual.city) {
    emptyFields.push(" City must be Alphabetic");
  }
  // if (!invoice.userClientProfile.clientDataindividual.address1) {
  //   emptyFields.push(" Address1  must be AlphaNeumeric");
  // }
  if (!invoice.userClientProfile.clientDataindividual.country) {
    emptyFields.push("Country  must be Alphabetic");
  }

  if (emptyFields.length > 0) {
    const alertMessage = `Please fill in the following required fields: ${emptyFields.join(
      ", "
    )}`;
    openNotificationWithIcon("error", alertMessage);
    return false;
  }

  return true;
};
const selectedField = ref("individual");
const selectField = (field) => {
  selectedField.value = field;
};
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Error",
    description: message,
    duration: 5,
  });
};
const handleSaveDraftButtonClick = () => {
  if (selectedField.value === "individual") {
    submitclietDataindividual();
  } else if (selectedField.value === "organization") {
    submitclientDataOrganization();
  } else {
    console.log("Error>>>", error);
  }
};

/////
const logoInputRef = ref(null);
const logoPreview = ref(null);
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

const displayImage = (input, imageUrl) => {
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (selectedField.value === "individual") {
        invoice.userClientProfile.clientDataindividual.url = imageUrl;
      } else if (selectedField.value === "organization") {
        invoice.userClientProfile.clientDataOrganization.url = imageUrl;
      } // Update the URL in the formData
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = imageUrl;
    };

    reader.readAsDataURL(file);
    if (selectedField.value === "individual") {
      invoice.userClientProfile.clientDataindividual.url = file;
    } else if (selectedField.value === "organization") {
      invoice.userClientProfile.clientDataOrganization.url = file;
    }
  }
};
onMounted(() => {
  invoice.resetState();
});
</script>
<template>
  <div class="bg-gray-200 mt-2">
    <div class="bg-white">
      <Header
        headerTitle="Client Profile"
        backButtonText="&nbsp &lt Back &nbsp  &nbsp "
        backRoute="Invoice"
        saveDraftButtonText="Create "
        :saveDraftButtonColor="Colors.orange"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="false"
        :showBackButton="false"
      />
    </div>
    <div class="modal-content max-h-full flex max-w-[800px] p-4 justify-start">
      <div class="flex">
        <div class="w-full p-8 bg-white">
          <div class="mb-4 flex ml-4">
            <label for="logoInput" class="">
              <div
                class="logo-placeholder border-none cursor-pointer hover:border-solid w-20 h-20 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
              >
                <div v-if="isLoadingImg">
                  <a-space class="w-full">
                    <a-spin size="large" />
                  </a-space>
                </div>
                <div v-else>
                  <img
                    v-if="selectedField === 'individual'"
                    id="imagePreview"
                    :src="
                      invoice.userClientProfile.clientDataindividual.url ||
                      'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'
                    "
                    ref="logoPreview"
                    alt="Logo for Individual"
                    class="w-20 mb-4 h-20 cursor-pointer"
                  />
                  <img
                    v-if="selectedField === 'organization'"
                    id="imagePreview"
                    :src="
                      invoice.userClientProfile.clientDataOrganization.url ||
                      'https://res.cloudinary.com/dfbsbullu/image/upload/v1709745593/iribv5nqn6iovph3buhe.png'
                    "
                    alt="Logo for Organization"
                    ref="logoPreview"
                    class="w-20 mb-4 h-20 cursor-pointer"
                  />
                </div>
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
              <table class="border">
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
                      <p class="mb-1 mt-3 mr-12">Organization</p>
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
                  <p class="justify-start flex">
                    <span class="text-[#ff0000]">*</span>First Name
                  </p>
                  <a-input
                    v-model:value="
                      invoice.userClientProfile.clientDataindividual.firstName
                    "
                    type="text"
                    placeholder="First Name"
                    class="w-full border p-2"
                  />
                </div>
                <div>
                  <p class="justify-start flex">
                    <span class="text-[#ff0000]">*</span>Last Name
                  </p>
                  <a-input
                    v-model:value="
                      invoice.userClientProfile.clientDataindividual.lastName
                    "
                    type="text"
                    placeholder="Last Name"
                    class="w-full border p-2"
                  />
                </div>
              </div>
              <hr class="my-4" />
            </div>
            <div class="flex">
              <div class="w-1/2 pr-2">
                <p class="text-left ml-2">Currency</p>
                <a-select 
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.currency
                  " size="large"
                  class=" w-full text-left"
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
              
              <div class="w-1/2 pl-2">
                <p class="text-left ml-2">Language</p>
                <a-select 
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.language
                  " size="large"
                  class=" w-full text-left"
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
            <hr class="my-4" />
            <div>
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span>Email Address
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataindividual.email
                "
                type="text"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span>Phone Number
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataindividual.phone
                "
                type="text"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span>Address(Line 1)
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataindividual.address1
                "
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataindividual.address2
                "
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="flex justify-between items-center mt-3 gap-2">
              <div class="">
                <p class="text-left">
                  <span class="text-[#ff0000]">*</span>Country
                </p>
                <a-select
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.country
                  " size="medium"
                  class=""
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
              <div class="">
                <p class="text-left ml-2">
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
                <p class="text-left ml-2">
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
                <p class="text-left ml-2">
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
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.faxNumber
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataindividual.websiteURL
                  "
                  type="text"
                  class="w-full border p-2 mb-4"
                />
              </div>
            </div>
            <div class="flex justify-between items-center"></div>
          </div>

          <div v-else-if="selectedField === 'organization'" :key="2">
            <div class="mb-4">
              <hr class="mb-4" />
              <div class="flex flex-col">
                <p class="justify-start flex">*Organization Name</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization
                      .organizationName
                  "
                  type="text"
                  placeholder="First Name"
                  class="border p-2"
                />

                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p class="justify-start flex">
                      <span class="text-[#ff0000]">*</span>First Name
                    </p>
                    <a-input
                      v-model:value="
                        invoice.userClientProfile.clientDataOrganization
                          .firstName
                      "
                      type="text"
                      placeholder="First Name"
                      class="w-full border p-2"
                    />
                  </div>
                  <div>
                    <p class="justify-start flex">
                      <span class="text-[#ff0000]">*</span>Last Name
                    </p>
                    <a-input
                      v-model:value="
                        invoice.userClientProfile.clientDataOrganization
                          .lastName
                      "
                      type="text"
                      placeholder="Last Name"
                      class="w-full border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr class="mb-4" />
            <div >
              <div class="flex">
                <div class="w-1/2 pr-2">
                  <p class="text-left ml-2">Currency</p>
                  <a-select
                    v-model:value="
                      invoice.userClientProfile.clientDataOrganization.currency
                    " size="large"
                    class=" w-full text-left"
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
           
                <div class="w-1/2 pl-2 ">
                  <p class="text-left ml-2">Language</p>
                  <a-select
                    v-model:value="
                      invoice.userClientProfile.clientDataOrganization.language
                    " size="large"
                    class=" w-full text-left"
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
              <hr class="my-4" />
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span> Email Address
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataOrganization.email
                "
                type="text"
                placeholder="Email"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span>Phone Number
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataOrganization.phone
                "
                type="text"
                placeholder="Phone Number"
                class="w-full border p-2"
              />
            </div>
            <hr class="my-4" />
            <div>
              <p class="justify-start flex">
                <span class="text-[#ff0000]">*</span>Address(Line 1)
              </p>
              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataOrganization.address1
                "
                type="text"
                placeholder="Streeet Line 1"
                class="w-full border p-2"
              />

              <a-input
                v-model:value="
                  invoice.userClientProfile.clientDataOrganization.address2
                "
                type="text"
                placeholder="Street Line 2"
                class="w-full mt-2 border p-2"
              />
            </div>
            <div class="flex justify-between items-center mt-3 gap-2">
              <div class="">
                <p class="text-left">
                  <span class="text-[#ff0000]">*</span>Country
                </p>
                <a-select
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.country
                  " size="medium"
                  class=""
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
              <div class="">
                <p class="text-left ml-2">
                  Postal Code
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.postalCode
                  "
                  type="number"
                  class=""
                  placeholder="Postal Code"
                />
              </div> 
              <div class="">
                <p class="text-left ml-2">
                  State
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.state
                  "
                  type="text"
                  class=""
                  placeholder="State"
                />
              </div>
              <div class="">
                <p class="text-left ml-2">
             City
                </p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.city
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
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.taxId
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.faxNumber
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.websiteURL
                  "
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <hr class="my-4" />
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="
                    invoice.userClientProfile.clientDataOrganization.notes
                  "
                  type="text"
                  class="w-full border p-2"
                />
                <!-- <div class="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p class="justify-start flex">Custom Field</p>

                    <a-input
                      v-model:value="
                        invoice.userClientProfile.clientDataOrganization.customFieldName
                      "
                      type="text"
                      class="w-full border p-2"
                      placeholder="Custom Field Name"
                    />
                  </div>
                  <div>
                    <a-input
                      v-model:value="
                        invoice.userClientProfile.clientDataOrganization.customFieldValue
                      "
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

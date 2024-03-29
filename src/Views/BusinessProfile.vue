<script setup>
import { ref, onMounted } from "vue";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
// import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useInvoiceStore } from "../stores/index";
import {
  PatchBusinessProfilerIndiviualApi,
  PatchBusinessProfilerOrganizationApi,
} from "../service/BusinessProfileService";
import { getUserDetailsApi } from "../service/LoginService";
// import Modal from "../components/Modal.vue";

const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const invoice = useInvoiceStore();

const firstNameError = ref('');
const lastNameError = ref('');
const emailError = ref('');
const address1Error = ref('');
const address2Error = ref('');
const cityError = ref('');

const validateForm = (profileType) => {
  // Reset errors
  firstNameError.value = '';
  lastNameError.value = '';
  emailError.value = '';
  address1Error.value = '';
  address2Error.value = '';
  cityError.value = '';

  const profileData = profileType === 'individual' ? invoice.userProfileData.individualProfile : invoice.userProfileData.organizationProfile;

  // Validate First Name
  if (!/^[a-z A-Z]+$/.test(profileData.firstName)) {
    firstNameError.value = "First name must contain only letters from A-Z and a-z";
  }
  if (!/^[a-z A-Z]+$/.test(profileData.lastName)) {
    lastNameError.value = "Last name must contain only letters from A-Z and a-z";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    emailError.value = "Email must be Valid and contain '@' ";
  }
  if (!/^[a-z A-Z 0-9]+$/.test(profileData.address1)) {
    address1Error.value = "Address1 must contain only Alphanumeric characters";
  } 
  if (!/^[a-z A-Z 0-9]+$/.test(profileData.address2)) {
    address2Error.value = "Address2 must contain only Alphanumeric characters";
  } 
  if (!/^[a-z A-Z ]+$/.test(profileData.city)) {
    cityError.value = "City must contain only Alphabetic A-Z characters";
  }

  // Check if any errors
  if (firstNameError.value || lastNameError.value || emailError.value || address1Error.value || address2Error.value || cityError.value) {
    return false;
  }

  return true;
};

const submitbusinessProfileDataOrganization = async (id) => {
  try {
    const response = await PatchBusinessProfilerOrganizationApi(
      invoice.userProfileData.organizationProfile._id,
      invoice.userProfileData.organizationProfile
      );
      router.push("/");
      //console.log(response);
    invoice.updateUserProfileAndBusinessProfile(response.data);
    Swal.fire({
      icon: "success",
      title: "Business Profile Updated ",
      text: "Business Profile has been Updated successfully.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error During Data Submit:", error),
      footer: "Please try again ",
    });
    console.error("Error During Data Submit:", error);
  }
};

const submitbusinessProfileDataindividual = async (Id) => {
  
  try {
    const response = await PatchBusinessProfilerIndiviualApi(
      invoice.userProfileData.individualProfile._id,
      invoice.userProfileData.individualProfile
      );
      router.push("/");
    //console.log(response);
    invoice.updateUserProfileAndBusinessProfile(response.data);
    Swal.fire({
      icon: "success",
      title: "Business Profile Updated ",
      text: "Business Profile has been Updated successfully.",
    });
  } catch (error) {
    console.error("Error during data submit organization:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error During Data Submit:", error),
      footer: "Please try again ",
    });
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;

    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const UserResponse = await getUserDetailsApi(UserId);
      invoice.updateUser(UserResponse);

      const { userProfileData } = invoice;
      
      if (userProfileData.selectedProfileType === "individual") {
        invoice.updateUserProfileIndividual(userProfileData.individualProfile);
      } else if (userProfileData.selectedProfileType === "organization") {
        invoice.updateUserProfileOrganization(userProfileData.organizationProfile);
      }
    } else {
      router.push("/login");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error During Account Update:", error),
      footer: "Please try again ",
    });
    console.error("Error During Account Update:", error);
  } finally {
    isLoading.value = false;
  }
});

const profileType = ref(invoice.selectedProfileType);
const switchProfileType = (type) => {
  invoice.selectProfileType(type);
  profileType.value = type;
  //console.log(`Selected profile type: ${type}`);
};

const handleSaveDraftButtonClick = () => {
  if (profileType.value === "individual") {
    if (validateForm('individual')) {
      submitbusinessProfileDataindividual();
    }
  } else if (profileType.value === "organization") {
    if (validateForm('organization')) {
      submitbusinessProfileDataOrganization();
    }
  }
};

const logo = () => {
  router.push("/UploadImg");
};
const logoInputRef = ref(null);
const logoPreview = ref(null);
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
</script>

<template>
  <div class="bg-gray-200">
    <div class="bg-white">
      <Header
        headerTitle="Business Profile"
        backButtonText="&nbsp &lt Back &nbsp  &nbsp"
        backRoute="Invoice"
        saveDraftButtonText=" Save Changes"
        :saveDraftButtonColor="Colors.orange"
        :onSaveDraftButtonClick="handleSaveDraftButtonClick"
        :showDropdown="false"
        :showBackButton="false"
      />
    </div>
    <div v-if="isLoading" class="flex justify-center flex-col items-center">
      <a-space class="w-full p-96 ml-96">
        <a-spin size="large" />
      </a-space>
    </div>

    <div v-else class="flex container p-4 w-[70%] justify-start">
      <div class="w-full p-8 bg-white">
        <div class="flex ml-4">
          <label for="logoInput" class="">
            <div
              class="logo-placeholder border-none cursor-pointer  w-20 h-20 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
            >
              <img
                v-if="profileType === 'individual'"
                src="../assets/3x.webp"
                ref="logoPreview"
                alt="Logo for Individual"
                class="w-20 mb-4 h-20 cursor-pointer"
              />
              <img
                v-if="profileType === 'organization'"
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
            <table class="border">
              <tr class="border">
                <td>
                  <div
                    class="flex pl-4 cursor-pointer"
                    @click="switchProfileType('individual')"
                  >
                    <p class="mb-1 mt-4">Individual</p>
                  </div>
                </td>
                <div></div>
                <td>
                  <span
                    v-if="profileType === 'individual'"
                    class="text-orange-500"
                    >&#10003;</span
                  >
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    class="flex pl-4 cursor-pointer"
                    @click="switchProfileType('organization')"
                  >
                    <p class="mb-1 mt-2 mr-12">Organization</p>
                    <!-- <span v-if="selectedField === 'organization'" class="text-orange-500">&#10003;</span> -->
                  </div>
                </td>
                <td>
                  <span
                    v-if="profileType === 'organization'"
                    class="text-orange-500"
                    >&#10003;</span
                  >
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- <div class="flex">
          Looking to Change your account Logo and Branding?
          <a @click="logo" class="cursor-pointer"> Account Customization</a>
        </div> -->
        <hr class="mb-4 mt-4" />
        <br />
        <!-- <transition name="fade" mode="out-in"> -->
        <div v-if="profileType === 'individual'" :key="1">
          <div class="mb-4">
            <div class="bg-[lightgray] pt-2 pb-2">
              <label class="flex font-bold mb-2 ml-4 mt-4"
                >Personal Information
              </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.firstName
                  "
                  type="text"
                  placeholder="First Name"
                  class="w-full p-2"
                />
                <p v-if="firstNameError" class="text-red-500">{{ firstNameError }}</p>

              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Last Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.lastName
                  "
                  type="text"
                  placeholder="Last Name"
                  class="w-full p-2"
                />
                <p v-if="lastNameError" class="text-red-500">{{ lastNameError }}</p>

              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Email Address</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.email
                  "
                  type="email"
                  placeholder="Email"
                  class="w-full p-2"
                />
                <p v-if="emailError" class="text-red-500">{{ emailError }}</p>

              </div>
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.websiteURL
                  "
                  type="text"
                  placeholder="Website URL"
                  class="w-full p-2"
                />
              </div>
            </div>
          </div>

          <div class="mb-12 mt-10 flex flex-col">
            <div class="bg-[lightgray] pt-2 pb-2">
              <label class="flex font-bold mb-2 ml-4 mt-4">Address</label>
            </div>
            <br /><br />
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <div class="flex">
                  <div class="w-1/2 pr-4">
                    <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Address(Line 1)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.individualProfile.address1
                      "
                      type="text"
                      placeholder="Address"
                      class="w-full border p-2"
                    />
                <p v-if="address1Error" class="text-red-500">{{ address1Error }}</p>

                  </div>
                  <div class="w-1/2">
                    <p class="justify-start flex">Address (Line 2)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.individualProfile.address2
                      "
                      type="text"
                      placeholder="Address 2"
                      class="w-full border p-2"
                      />
                <p v-if="address2Error" class="text-red-500">{{ address2Error }}</p>
              </div>
                </div>
              </div>
              <div>
                <p class="justify-start flex">Postal Code</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.postalCode
                  "
                  type="number"
                  class="w-full border p-2"
                />
                
              </div>
              <div>
                <p class="justify-start flex">State</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.state
                  "
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>City</p>
                <a-input
                  v-model:value="invoice.userProfileData.individualProfile.city"
                  type="text"
                  class="w-full border p-2"
                  />
                  <p v-if="cityError" class="text-red-500">{{ cityError }}</p>
              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="
                    invoice.userProfileData.individualProfile.country
                  "
                  class="w-full border p-2"
                >
                  <a-select-option
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.value"
                  >
                    {{ country.value }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>

          <div class="mb-">
            <div class="bg-[lightgray] pt-2 pb-2">
              <label class="flex font-bold mb-2 ml-4 mt-4"
                >Additional Information
              </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="justify-start flex">Phone Number</p>

                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.phone
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.faxNumber
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.taxId
                  "
                  type="number"
                  class="w-full border p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="
                    invoice.userProfileData.individualProfile.notes
                  "
                  rows="2"
                  type="text"
                  class="w-full p-2"
                />
              </div>
            </div>

            <hr clas="mb-4 mt-4" />
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p class="justify-start flex">Custom Field</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.customFieldName
                  "
                  type="text"
                  class="w-full p-2"
                  placeholder="Custom Field Name"
                />
              </div>
              <div>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.customFieldValue
                  "
                  type="text"
                  class="w-full p-2 mt-5"
                  placeholder="Custom Field Value"
                />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div
                style="text-align: left; margin-left: 10px; margin-top: 10px"
              ></div>
            </div>
          </div>
        </div>

        <div v-else-if="profileType === 'organization'" :key="2">
          <div class="mb-4">
            <div class="bg-[lightgray] pt-2 pb-2">
              <label class="flex font-bold mb-2 ml-4 mt-4"
                >Personal Information
              </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="justify-start flex">Organization Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.organizationName
                  "
                  type="text"
                  placeholder="Organization Name"
                  class="w-full p-2"
                />
              </div>

              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>First Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.firstName
                  "
                  type="text"
                  placeholder="First Name"
                  class="w-full p-2"
                  />
                <p v-if="firstNameError" class="text-red-500">{{ firstNameError }}</p>
              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Last Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.lastName
                  "
                  type="text"
                  placeholder="Last Name"
                  class="w-full p-2"
                />
                <p v-if="lastNameError" class="text-red-500">{{ lastNameError }}</p>

              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Email Address</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.email
                  "
                  type="text"
                  placeholder="Email"
                  class="w-full p-2"
                />
                <p v-if="emailError" class="text-red-500">{{ emailError }}</p>

              </div>
              <div>
                <p class="justify-start flex">Website URL</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.websiteURL
                  "
                  type="text"
                  placeholder="Website URL"
                  class="w-full p-2"
                />
              </div>
            </div>
          </div>

          <div class="mb-12 mt-10 flex flex-col">
            <div class="bg-[lightgray] pt-1 pb-1">
              <label class="flex font-bold mb-6 ml-4 mt-4">Address</label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <div class="flex">
                  <div class="w-1/2 pr-4">
                    <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Address(Line 1)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.organizationProfile.address1
                      "
                      type="text"
                      placeholder="Address"
                      class="w-full p-2"
                    />
                    <p v-if="address1Error" class="text-red-500">{{ address1Error }}</p>
                  </div>
                  <div class="w-1/2">
                    <p class="justify-start flex">Address (Line 2)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.organizationProfile.address2
                      "
                      type="text"
                      placeholder="Address 2"
                      class="w-full p-2"
                    />
                    <p v-if="address2Error" class="text-red-500">{{ address2Error }}</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="justify-start flex">Postal Code</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.postalCode
                  "
                  type="number"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">State</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.state
                  "
                  type="text"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>City</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.city
                  "
                  type="text"
                  class="w-full p-2"
                />
                <p v-if="cityError" class="text-red-500">{{ cityError }}</p>
              </div>
              <div>
                <p class="justify-start flex"> <span class="text-[#ff0000]">*</span>Country</p>
                <a-select
                  v-model:value="
                    invoice.userProfileData.organizationProfile.country
                  "
                  class="w-full p-2"
                >
                  <a-select-option
                    v-for="country in invoice.countryOptions"
                    :key="country.value"
                    :value="country.value"
                  >
                    {{ country.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>

          <div class="mb-">
            <div class="bg-[lightgray] pt-2 pb-2">
              <label class="flex font-bold mb-2 ml-4 mt-4"
                >Additional Information
              </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="justify-start flex">Phone Number</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.phone
                  "
                  type="number"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Fax Number</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.faxNumber
                  "
                  type="number"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Tax Identification Number</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.taxId
                  "
                  type="number"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Notes</p>
                <a-textarea
                  v-model:value="
                    invoice.userProfileData.organizationProfile.notes
                  "
                  rows="2"
                  type="text"
                  class="w-full p-2"
                />
              </div>
            </div>
            <hr clas="mb-4 " />
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p class="justify-start flex">Custom Field</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.customFieldName
                  "
                  type="text"
                  class="w-full p-2"
                  placeholder="Custom Field Name"
                />
              </div>
              <div>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.customFieldValue
                  "
                  type="text"
                  class="w-full p-2 mt-5"
                  placeholder="Custom Field Value"
                />
              </div>
            </div>
          </div>
          <!-- <div style="text-align: left; margin-left: 10px; margin-top: 10px">
            <Button
              :bgColor="Colors.addMore"
              :textColor="Colors.white"
              :fontSize="fontSize"
              buttonText="save Changes"
              class=""
              @click="addNewLine()"
            />
          </div> -->
        </div>
        <!-- </transition> -->
        <!-- <button class="bg-orange-500 text-white py-2 px-4 rounded">Submit</button> -->
      </div>
    </div>
  </div>
</template>
<style>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
} */
</style>

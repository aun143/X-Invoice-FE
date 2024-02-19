<script setup>
import { ref, onMounted } from "vue";
import Header from "../components/Header.vue";
import { Colors } from "../utils/color";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useInvoiceStore } from "../stores/index";
import {
  PatchBusinessProfilerIndiviualApi,
  PatchBusinessProfilerOrganizationApi,
} from "../service/BusinessProfileService";
import { getUserDetailsApi } from "../service/LoginService";
import Modal from "../components/Modal.vue";
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const invoice = useInvoiceStore();
// const UserResponse = useInvoiceStore();
// const individualId =  UserResponse.userProfileData.individualProfile;
// const organizationId =  UserResponse.userProfileData.organizationProfile;
// console.log("organizationId>>>",organizationId);
// console.log("individualId>>>",individualId);

// console.log("userResponse 9:45",UserResponse)

// console.log("userProfileData",userProfileData);

const submitbusinessProfileDataOrganization = async (id) => {
  try {
    router.push("/");
    // alert("Submit Changed Data?")
    const response = await PatchBusinessProfilerOrganizationApi(
      invoice.userProfileData.organizationProfile._id,
      invoice.userProfileData.organizationProfile
    );
    console.log(response);
    invoice.updateUserProfileAndBusinessProfile(response.data);
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
    router.push("/");
    // alert("Data Submit?");
    const response = await PatchBusinessProfilerIndiviualApi(
      invoice.userProfileData.individualProfile._id,
      invoice.userProfileData.individualProfile
    );
    console.log(response);
    invoice.updateUserProfileAndBusinessProfile(response.data);
  } catch (error) {
    console.error("Error during data submit organization:", error);
    // Provide feedback to the user or handle the error appropriately
  }
};

const individualId = invoice.userProfileData.individualProfile;
const organizationId = invoice.userProfileData.organizationProfile;
console.log("organizationId>>>", organizationId);
console.log("individualId>>>", individualId);
onMounted(async () => {
  try {
    isLoading.value = true;

    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const UserResponse = await getUserDetailsApi(UserId);
      invoice.updateUser(UserResponse);

      console.log("organizationProfile<><><", UserResponse.organizationProfile);
      console.log(
        "organizationProfile<><><firstName:",
        UserResponse.organizationProfile.firstName
      );
      console.log(
        "organizationProfile<><><Id:",
        UserResponse.organizationProfile._id
      );

      console.log("userId >>>", UserId);
      console.log("UserResponse >>>", UserResponse);
      const { userProfileData } = invoice;
      if (userProfileData.selectedProfileType === "individual") {
        invoice.updateUserProfileIndividual(userProfileData);
      } else if (userProfileData.selectedProfileType === "organization") {
        invoice.updateUserProfileOrganization(userProfileData);
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
  const selectedType = invoice.selectedProfileType;
  console.log(`Selected profile type: ${selectedType}`);
};

const handleSaveDraftButtonClick = () => {
  if (profileType.value === "individual") {
    submitbusinessProfileDataindividual();
  } else if (profileType.value === "organization") {
    submitbusinessProfileDataOrganization();
  } else {
    console.log("Error>>>", error);
  }
};

const logo = () => {
  router.push("/UploadImg");
};
const logoInputRef = ref(null);
const logoPreview = ref(null);
const handleFileInputChange = () => {
  displayImage(logoInputRef.value);
  console.log("1st image");
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
        backButtonText=" Back"
        backRoute="Main"
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
              class="logo-placeholder border-none cursor-pointer hover:border-solid w-20 h-20 border-2 grid place-items-center text-slate-500 text-6xl font-bold"
            >
              <img
                v-if="profileType === 'individual'"
                src="../assets/singleperson.jpg"
                ref="logoPreview"
                alt="Logo for Individual"
                class="w-20 mb-4 h-20 cursor-pointer"
              />
              <img
                v-if="profileType === 'organization'"
                src="../assets/multipleperson.png"
                alt="Logo for Organization"
                ref="logoPreview"
                class="w-20 mb-4 h-20 cursor-pointer"
              />
            </div>
            <a-input
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
        <div class="flex">
          Looking to Change your account Logo and Branding?
          <a @click="logo" class="cursor-pointer"> Account Customization</a>
        </div>
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
                <p class="justify-start flex">*First Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.firstName
                  "
                  type="text"
                  placeholder="First Name"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Last Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.lastName
                  "
                  type="text"
                  placeholder="Last Name"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Email Address</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.individualProfile.email
                  "
                  type="email"
                  placeholder="Email"
                  class="w-full p-2"
                />
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
                    <p class="justify-start flex">Address(Line 1)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.individualProfile.address1
                      "
                      type="text"
                      placeholder="Address"
                      class="w-full border p-2"
                    />
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
                <p class="justify-start flex">City</p>
                <a-input
                  v-model:value="invoice.userProfileData.individualProfile.city"
                  type="text"
                  class="w-full border p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Country</p>
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
                <p class="justify-start flex">First Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.firstName
                  "
                  type="text"
                  placeholder="First Name"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Last Name</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.lastName
                  "
                  type="text"
                  placeholder="Last Name"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Email Address</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.email
                  "
                  type="text"
                  placeholder="Email"
                  class="w-full p-2"
                />
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
                    <p class="justify-start flex">Address(Line 1)</p>
                    <a-input
                      v-model:value="
                        invoice.userProfileData.organizationProfile.address1
                      "
                      type="text"
                      placeholder="Address"
                      class="w-full p-2"
                    />
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
                <p class="justify-start flex">City</p>
                <a-input
                  v-model:value="
                    invoice.userProfileData.organizationProfile.city
                  "
                  type="text"
                  class="w-full p-2"
                />
              </div>
              <div>
                <p class="justify-start flex">Country</p>
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

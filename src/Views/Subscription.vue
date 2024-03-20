<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getUserDetailsApi } from "../service/LoginService";
import Swal from "sweetalert2";
import { useInvoiceStore } from "../stores/index";
import { updateSignUpData } from "../service/SignUpService";
const invoice = useInvoiceStore();
const isLoading = ref(false);
const router = useRouter();

async function updateFree() {
  const result = await Swal.fire({
    title: "Free Plan",
    text: "Are you sure you want to Choose Free Plan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Choose Free Plan",
  });
  if (result.isConfirmed) {
    try {
      //console.log("Stored id:", invoice.signupData.data._id);
      const userid = localStorage.getItem("UserId");
      const body = { userId: userid, planeName: "Free" };
      const response = await updateSignUpData(body);
      invoice.updateUserData(response.data);
      Swal.fire({
        icon: "success",
        title: " Plan Updated",
        text: " Plan has been Updated Successfully.",
      }).then(() => {
        // Fetch updated user data after plan update
        getUserDetailsAndRedirect();
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: ("Error During Plan Change:", error),
        footer: "Please try again ",
      });
    }
  }
}
async function updateBasic() {
  const result = await Swal.fire({
    title: "Basic Plan",
    text: "Are you sure you want to Choose Basic Plan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Choose Basic Plan",
  });
  if (result.isConfirmed) {
    try {
      //console.log("Stored id:", invoice.signupData.data._id);
      const userid = localStorage.getItem("UserId");
      const body = { userId: userid, planeName: "Basic" };
      const response = await updateSignUpData(body);
      invoice.updateUserData(response.data);
      Swal.fire({
        icon: "success",
        title: " Plan Updated",
        text: " Plan has been Updated Successfully.",
      }).then(() => {
        // Fetch updated user data after plan update
        getUserDetailsAndRedirect();
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: ("Error During Plan Change:", error),
        footer: "Please try again ",
      });
    }
  }
}

async function updateStandard() {
  const result = await Swal.fire({
    title: "Standard Plan",
    text: "Are you sure you want to Choose Standard Plan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Choose Standard Plan",
  });
  if (result.isConfirmed) {
    try {
      //console.log("Stored id:", invoice.signupData.data._id);
      const userid = localStorage.getItem("UserId");

      const body = { userId: userid, planeName: "Standard" };
      const response = await updateSignUpData(body);
      invoice.updateUserData(response.data);
      Swal.fire({
        icon: "success",
        title: " Plan Updated",
        text: " Plan has been Updated Successfully.",
      }).then(() => {
        // Fetch updated user data after plan update
        getUserDetailsAndRedirect();
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: ("Error During Plan Change:", error),
        footer: "Please try again ",
      });
    }
  }
}
async function updatePremium() {
  const result = await Swal.fire({
    title: "Premium Plan",
    text: "Are you sure you want to Choose Premium Plan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Choose Premium Plan",
  });
  if (result.isConfirmed) {
    try {
      //console.log("Stored id:", invoice.signupData.data._id);
      const userid = localStorage.getItem("UserId");

      const body = { userId: userid, planeName: "Premium" };
      const response = await updateSignUpData(body);
      invoice.updateUserData(response.data);
      Swal.fire({
        icon: "success",
        title: " Plan Updated",
        text: " Plan has been Updated Successfully.",
      }).then(() => {
        // Fetch updated user data after plan update
        getUserDetailsAndRedirect();
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: ("Error During Plan Change:", error),
        footer: "Please try again ",
      });
    }
  }
}
async function getUserDetailsAndRedirect() {
  try {
    const userId = localStorage.getItem("UserId");
    const userProfileData = await getUserDetailsApi(userId);

    // Update the user profile data with the fetched data
    invoice.userProfileData.userRole = userProfileData;

    // After updating user data, navigate to the root route ("/")
    router.push("/");
  } catch (error) {
    console.error("Error Fetching User Details:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error Fetching User Details. Please try again.",
    });
  }
}
// Define functions to handle plan selection
function handleSelectPlan(planName) {
  if (planName === "Basic") {
    updateBasic();
  } else if (planName === "Standard") {
    updateStandard();
  } else if (planName === "Premium") {
    updatePremium();
  } else if (planName === "Free") {
    updateFree();
  }
}

function handleSelectUpgrade(planName) {
  if (planName === "Basic") {
    updateBasic();
  } else if (planName === "Standard") {
    updateStandard();
  } else if (planName === "Premium") {
    updatePremium();
  } else if (planName === "Free") {
    updateFree();
  }
}

function handleSelectDowngrade(planName) {
  if (planName === "Basic") {
    updateBasic();
  } else if (planName === "Standard") {
    updateStandard();
  } else if (planName === "Premium") {
    updatePremium();
  } else if (planName === "Free") {
    updateFree();
  }
}
const userRole = ref();
onMounted(async () => {
  try {
    isLoading.value = true;

    const UserId = localStorage.getItem("UserId");

    if (UserId) {
      const userProfileData = await getUserDetailsApi(UserId);
      userRole.value = userProfileData.userRole;
    } else {
      router.push("/login");
    }
    // showPopup();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ("Error During Getting Account:", error),
      footer: "Please try again ",
    });
    console.error("Error During getting Business Profile:", error);
  } finally {
    isLoading.value = false;
  }
});
// async function showPopup() {
//   if (
//     userRole.value === "user" ||
//     userRole.value === undefined ||
//     userRole.value === ""
//   ) {
//     console.log("userRole.value", userRole.value);
//     await Swal.fire({
//       title: "Free Mode",
//       text: "Can Create up to 3 Clients & 3 Invoices",
//       icon: "info",
//       confirmButtonText: "OK",
//     });
//   }
// }
const plans = [
  {
    name: "Free",
    description:
      "Ideal for individuals that need a custom solution with custom tools.",
    price: "0",
    timeSpan: "/month",
    gradientClass: "bg-gradient-to-tr from-[#10C0CB] to-[#4AA7AD]",
    included: [
      "Create 3 Clients",
      "Create 3 Invoices",
      "Generate 3 Pdf ",
      "Send 3 Emails",
    ],
  },
  {
    name: "Basic",
    description:
      "Ideal for individuals that need a custom solution with custom tools.",
    price: "30",
    timeSpan: "/month",
    gradientClass: "bg-gradient-to-tr from-[#10C0CB] to-[#4AA7AD]",
    included: [
      "Create 30 Clients",
      "Create 30 Invoices",
      "Generate 30 Pdf ",
      "Send 30 Emails",
    ],
  },
  {
    name: "Standard",
    description:
      "Ideal for individuals that need a custom solution with custom tools.",
    price: "100",
    timeSpan: "/month",

    gradientClass: "bg-gradient-to-tr from-blue-500 to-blue-300",
    included: [
      "Create 100 Clients",
      "Create 100 Invoices",
      "Generate 100 Pdf ",
      "Send 100 Emails",
    ],
  },
  {
    name: "Premium",
    description:
      "Ideal for individuals that need a custom solution with custom tools.",
    price: "500",
    timeSpan: "/month",

    gradientClass: "bg-gradient-to-tr from-[#10C0CB] to-indigo-300",
    included: [
      "Create Unlimited Clients",
      "Create Unlimited Invoices",
      "Generate Unlimited Pdf ",
      "Send Unlimited Emails",
    ],
  },
];

function setPlansBasedOnRole(userRole) {
  plans.forEach((plan) => {
    plan.active = false;
    plan.upgrade = false;
    plan.downgrade = false;
  });

  if (userRole === "Admin") {
    plans.find((plan) => plan.name === "Basic").active = true;
    plans.find((plan) => plan.name === "Free").downgrade = true;
    plans.find((plan) => plan.name === "Standard").upgrade = true;
    plans.find((plan) => plan.name === "Premium").upgrade = true;
  } else if (userRole === "superAdmin") {
    plans.find((plan) => plan.name === "Standard").active = true;
    plans.find((plan) => plan.name === "Free").downgrade = true;
    plans.find((plan) => plan.name === "Basic").downgrade = true;
    plans.find((plan) => plan.name === "Premium").upgrade = true;
  } else if (userRole === "iSuperAdmin") {
    plans.find((plan) => plan.name === "Premium").active = true;
    plans.find((plan) => plan.name === "Free").downgrade = true;
    plans.find((plan) => plan.name === "Basic").downgrade = true;
    plans.find((plan) => plan.name === "Standard").downgrade = true;
  } else if (userRole === "User") {
    plans.find((plan) => plan.name === "Free").active = true;
    plans.find((plan) => plan.name === "Premium").upgrade = true;
    plans.find((plan) => plan.name === "Basic").upgrade = true;
    plans.find((plan) => plan.name === "Standard").upgrade = true;
  }
}

// setPlansBasedOnRole(userRole.value);
watch(userRole, (newValue) => {
  setPlansBasedOnRole(newValue);
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center">
    <!-- Loader -->
  </div>
  <section
    v-else
    class="flex flex-col justify-center antialiased bg-gray-100 text-gray-600 min-h-[96vh]"
  >
    <div class="h-full">
      <!-- Pricing -->
      <div class="max-w-5xl mx-auto" x-data="{ annual: true }">
        <h2 class="text-3xl text-gray-800 font-bold text-center mb-4">
          Subscription Plans
        </h2>
        <!-- Pricing tabs -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Pricing Tab -->
          <div
            v-for="(plan, index) in plans"
            :key="index"
            :class="`relative col-span-full md:col-span-6 lg:col-span-3  bg-white shadow-md rounded-sm border border-gray-200 ${
              plan.active ? 'border-[#10C0CB]' : ''
            }`"
          >
            <!-- Plan Header -->
            <div
              class="absolute top-0 left-0 right-0 h-0.5"
              :class="{ 'bg-[#10C0CB]': plan.active }"
              aria-hidden="true"
            ></div>
            <div class="px-5 pt-5 pb-6 border-b border-gray-200">
              <header class="flex items-center mb-2">
                <!-- Plan Icon -->
                <div
                  :class="`w-6 h-6 rounded-full flex-shrink-0 ${plan.gradientClass} mr-3`"
                >
                  <svg
                    class="w-6 h-6 fill-current text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z"
                    />
                  </svg>
                  <!-- Plan Icon SVG -->
                </div>
                <!-- Plan Name -->
                <h3 class="text-lg text-gray-800 font-semibold">
                  {{ plan.name }}
                </h3>
              </header>
              <!-- Plan Description -->
              <div class="text-sm mb-2">{{ plan.description }}</div>
              <!-- Price -->
              <div class="text-gray-800 font-bold mb-4">
                <span class="text-2xl">$</span
                ><span class="text-3xl">{{ plan.price }}</span
                ><span class="text-gray-500 font-medium text-sm">{{
                  plan.timeSpan
                }}</span>
              </div>
              <!-- CTA Buttons -->
              <button
                v-if="plan.active"
                :class="{ 'cursor-not-allowed': !plan.active }"
                class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border rounded leading-5 shadow-sm transition duration-150 ease-in-out border-1 cursor-not-allowed focus:outline-none focus-visible:ring-2 text-black w-full"
              >
                Current
              </button>
              <button
                v-else-if="plan.upgrade"
                class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-[#10C0CB] focus:outline-none focus-visible:ring-2 hover:bg-[#4AA7AD] text-white w-full"
                @click="handleSelectUpgrade(plan.name)"
              >
                Upgrade
              </button>
              <button
                v-else-if="plan.downgrade"
                class="font-medium text-sm hover:bg-[#10C0CB] hover:text-white inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 hover- w-full"
                @click="handleSelectDowngrade(plan.name)"
              >
                Downgrade
              </button>
              <button
                v-else
                class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full"
                @click="handleSelectPlan(plan.name)"
              >
                Select Plan
              </button>
            </div>
            <!-- Plan Details -->
            <div class="px-5 pt-4 pb-5">
              <div class="text-xs text-gray-800 font-semibold uppercase mb-2">
                What's included?
              </div>
              <div class="text-xs text-gray-800 font-semibold uppercase mb-4">
                User Can
              </div>
              <!-- List of Included Items -->
              <ul>
                <li
                  v-for="(item, i) in plan.included"
                  :key="i"
                  class="flex items-center py-1"
                >
                  <svg
                    class="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z"
                    />
                  </svg>
                  <div class="text-sm">{{ item }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/*  #toggle:checked + label > span:first-child {
    @apply left-[22px];
  } */
</style>

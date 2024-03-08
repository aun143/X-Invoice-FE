<template>
    <section class="flex flex-col justify-center antialiased bg-gray-100 text-gray-600 min-h-screen p-4">
      <div class="h-full">
        <!-- Pricing -->
        <div class="max-w-5xl mx-auto" x-data="{ annual: true }">
          <h2 class="text-3xl text-gray-800 font-bold text-center mb-4">Subscription Plans</h2>
          <!-- Toggle switch -->
          <!-- <div class="flex justify-center">
            <div class="flex items-center space-x-3 mb-8">
              <div class="text-sm text-gray-500 font-medium min-w-[120px] text-right">Monthly</div>
              <div class="relative select-none w-[44px]">
                <input type="checkbox" id="toggle" class="peer sr-only" x-model="annual" @change="toggleBillingCycle" />
                <label class="block overflow-hidden cursor-pointer h-6 rounded-full bg-gray-400 peer-checked:bg-[#10C0CB]" for="toggle">
                  <span class="absolute block rounded-full w-5 h-5 top-0.5 left-0.5 right-1/2 bg-white shadow-sm transition-all duration-150 ease-out" aria-hidden="true"></span>
                  <span class="sr-only">Pay annually</span>
                </label>
              </div>
              <div class="text-sm text-gray-500 font-medium min-w-[120px]">Annually <span class="text-green-500">(-20%)</span></div>
            </div>
          </div> -->
          <!-- Pricing tabs -->
          <div class="grid grid-cols-12 gap-6">
            <!-- Pricing Tab -->
            <div v-for="(plan, index) in plans" :key="index" :class="`relative col-span-full md:col-span-4 bg-white shadow-md rounded-sm border border-gray-200 ${plan.active ? 'border-[#10C0CB]' : ''}`">
              <div class="absolute top-0 left-0 right-0 h-0.5" :class="{ 'bg-[#10C0CB]': plan.active }" aria-hidden="true"></div>
              <div class="px-5 pt-5 pb-6 border-b border-gray-200">
                <header class="flex items-center mb-2">
                  <div :class="`w-6 h-6 rounded-full flex-shrink-0 ${plan.gradientClass} mr-3`">
                    <svg class="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                    </svg>
                  </div>
                  <h3 class="text-lg text-gray-800 font-semibold">{{ plan.name }}</h3>
                </header>
                <div class="text-sm mb-2">{{ plan.description }}</div>
                <!-- Price -->
                <div class="text-gray-800 font-bold mb-4">
                  <span class="text-2xl">$</span><span class="text-3xl">{{ plan.price }}</span><span class="text-gray-500 font-medium text-sm">/mo</span>
                </div>
                <!-- CTA -->
                <button v-if="plan.active" :class="{ 'cursor-not-allowed': !plan.active }" class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border  rounded leading-5 shadow-sm transition duration-150 ease-in-out border-1 cursor-not-allowed focus:outline-none focus-visible:ring-2 text-black w-full">Current</button>
                <button v-else-if="plan.upgrade" class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-[#10C0CB] focus:outline-none focus-visible:ring-2 hover:bg-[#4AA7AD] text-white w-full" @click="upgrade(plan)">Upgrade</button>
                <button v-else-if="plan.downgrade" class="font-medium text-sm hover:bg-[#10C0CB] hover:text-white inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 hover- w-full" @click="downgrade(plan)">Downgrade</button>
                <button v-else class="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full">Select Plan</button>
              </div>
              <div class="px-5 pt-4 pb-5">
                <div class="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>
                <!-- List -->
                <ul>
                  <li v-for="(item, i) in plan.included" :key="i" class="flex items-center py-1">
                    <svg class="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
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
  
  <script setup>
  import { ref } from 'vue';
  
  const annual = ref(true);
  
  const plans = [
    {
      name: 'Basic',
      description: 'Ideal for individuals that need a custom solution with custom tools.',
      price: '0',
      active: false,
      upgrade: false,
      downgrade: true,
      gradientClass: 'bg-gradient-to-tr from-[#10C0CB] to-[#4AA7AD]',
      included: [
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation',
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation'
      ]
    },
    // {
    //   name: 'Basic',
    //   description: 'Ideal for individuals that need a custom solution with custom tools.',
    //   price: '18',
    //   active: false,
    //   upgrade: true,
    //   downgrade: true,
    //   gradientClass: 'bg-gradient-to-tr from-green-500 to-green-300',
    //   included: [
    //     'Lorem ipsum dolor sit amet',
    //     'Quis nostrud exercitation',
    //     'Lorem ipsum dolor sit amet',
    //     'Quis nostrud exercitation',
    //     'Lorem ipsum dolor sit amet'
    //   ]
    // },
    {
      name: 'Standard',
      description: 'Ideal for individuals that need a custom solution with custom tools.',
      price: '34',
      active: true,
      upgrade: false,
      downgrade: false,
      gradientClass: 'bg-gradient-to-tr from-blue-500 to-blue-300',
      included: [
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation',
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation',
        'Lorem ipsum dolor sit amet'
      ]
    },
    {
      name: 'Premium',
      description: 'Ideal for individuals that need a custom solution with custom tools.',
      price: '74',
      active: false,
      upgrade: true,
      downgrade: true,
      gradientClass: 'bg-gradient-to-tr from-[#10C0CB] to-indigo-300',
      included: [
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation',
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation',
        'Lorem ipsum dolor sit amet',
        'Quis nostrud exercitation'
      ]
    }
  ];
  
//   function toggleBillingCycle() {
//     plans.forEach(plan => {
//       plan.active = !plan.active;
//     });
//   }
  
  function upgrade(selectedPlan) {
    plans.forEach(plan => {
      plan.active = false;
      plan.upgrade = false;
      plan.downgrade = true;
    });
    selectedPlan.active = true;
    selectedPlan.upgrade = false;
    selectedPlan.downgrade = false;
  }
  
  function downgrade(selectedPlan) {
    plans.forEach(plan => {
      plan.active = false;
      plan.upgrade = true;
      plan.downgrade = false;
    });
    selectedPlan.active = true;
    selectedPlan.upgrade = false;
    selectedPlan.downgrade = false;
  }  

  
  
  </script>
  
  <style>
  /*  #toggle:checked + label > span:first-child {
    @apply left-[22px];
  } */
  </style>
  
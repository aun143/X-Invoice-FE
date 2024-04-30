<template>
  <div class="">
    <div class="">
      <h2
        class="text-lg font-semibold flex items-center justify-center text-center"
      >
        Enter Card Details
      </h2>
      <div class="flex flex-col">
        <div>
          <p class="font-medium text-lg">Card Details</p>
          <a-input
            type="number"
            v-model:value="cardNumber"
            placeholder="Card Number"
            class=""
          />
        </div>
        <div class="grid grid-cols-3 gap-4 my-4">
          <div>
            <p class="font-medium text-lg">Card Number</p>
            <a-input
              type="number"
              v-model:value="cvcDetail"
              placeholder="CVC Number"
            />
          </div>
          <div>
            <p class="font-medium text-lg">CVC Number</p>
            <a-input
              type="number"
              v-model:value="paymenmt"
              placeholder="Amount"
            />
          </div>
          <div class="">
            <p class="font-medium text-lg">Expiry Date</p>
            <a-input
              type="date"
              v-model:value="expirationDate"
              placeholder="Expiration Date"
              class=""
            />
          </div>
        </div>
      </div>
      <div class="flex items-end justify-center text-end">
        <a-button @click="submitCardDetails" class="text-white bg-green-600 w-32 h-9"
          >Submit</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const cardNumber = ref("");
const expirationDate = ref("");
const cvcDetail = ref("");
const paymenmt = ref("");
const submitCardDetails = () => {
  const cardDetails = {
    cardNumber: cardNumber.value,
    expirationDate: expirationDate.value,
  };
  localStorage.setItem("cardDetails", JSON.stringify(cardDetails));
};
</script>

<style scoped></style>



<!-- <template>
  <div>
    <stripe-element-payment
      ref="paymentRef"
      :pk="pk"
      :elements-options="elementsOptions"
      :confirm-params="confirmParams"
    />
    <button @click="pay">Pay Now</button>
  </div>
</template>

<script>
import { StripeElementPayment } from '@vue-stripe/vue-stripe';
export default {
  components: {
    StripeElementPayment,
  },
  data () {
    return {
      pk: 'your-publishable-key',
      elementsOptions: {
        appearance: {}, // appearance options
      },
      confirmParams: {
        return_url: 'http://localhost:8080/success', // success url
      },
    };
  },
  mounted () {
    this.generatePaymentIntent();
  },
  methods: {
    async generatePaymentIntent () {
      const paymentIntent = await apiCallToGeneratePaymentIntent(); // this is just a dummy, create your own API call
      this.elementsOptions.clientSecret = paymentIntent.client_secret;
    },
    pay () {
      this.$refs.paymentRef.submit();
    },
  },
};
</script> -->
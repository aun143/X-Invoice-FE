import { ref } from "vue";
import { useInvoiceStore } from "./index";

export const userProfileType = ref("individual");

export const updateUserProfileType = (type) => {
  userProfileType.value = type;

  useInvoiceStore().selectProfileType(type);
};

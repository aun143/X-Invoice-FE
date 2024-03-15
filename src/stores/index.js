import { defineStore } from "pinia";
export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    selectedProfileType: "individual",
    formData: {
      description: "",
      language: "English (US)",
      currency: "PKR",
      purchaseOrderNumber: "",
      invoiceNumber: "",
      invoiceName: "INV",
      date:"",
      invoiceDueDate: "",
      file: "",
      url:"",
      invoiceDue: "",
      sender:"",
      receiver:"",
      items: [
        {
          description: "",
          quantity: "",
          rate: "",
          unit: "d",
          amount: "",
        },
      ],
      notes: "",
      subtotal: 0,
      total: 0,
    },

    userProfileData: {
      individualProfile: {
        firstName: "",
        lastName: "",
        email: "",
        address1: "",
        address2: "",
        phone: "",
        postalCode: "",
        state: "",
        city: "",
        country: "Pakistan",
        currency: "PKR",
        language: "English (US)",
        phone: "",
        websiteURL: "",
        faxNumber: "",
        taxId: "",
        notes: "",
        customFieldName: "",
        customFieldValue: "",
      },
      organizationProfile: {
        firstName: "",
        lastName: "",
        organizationName: "",
        email: "",
        address1: "",
        address2: "",
        phone: "",
        postalCode: "",
        state: "",
        city: "",
        country: "Pakistan",
        currency: "PKR",
        language: "English (US)",
        phone: "",
        websiteURL: "",
        faxNumber: "",
        taxId: "",
        notes: "",
        customFieldName: "",
        customFieldValue: "",
      },
    },
    signupData: {
      username: "",
      email: "",
      password: "",
    },
userClientProfile :{
    clientDataOrganization: {
      firstName: "",
      lastName: "",
      email: "",
      websiteURL: "",
      address1: "",
      address2: "",
      postalCode: "",
      state: "",
      city: "",
      country: "Pakistan",
      currency: "PKR",
      phone: "",
      language: "English (US)",
      faxNumber: "",
      taxId: "",
      notes: "",
      organizationName: "",
      customFieldName: "",
      customFieldValue: "",
    },
    clientDataindividual: {
      firstName: "",
      // clientType: "",
      lastName: "",
      email: "",
      websiteURL: "",
      address1: "",
      address2: "",
      postalCode: "",
      state: "",
      city: "",
      country: "Pakistan",
      currency: "PKR",
      phone: "",
      language: "English (US)",
      faxNumber: "",
      taxId: "",
      notes: "",
      customFieldName: "",
      customFieldValue: "",
    },
  },
    currencyOptions: [
      { label: "United States Dollar (USD)", value: "USD" },
      { label: "Pakistani Ruppee", value: "PKR" },
      { label: "Euro (EUR)", value: "EUR" },
      { label: "British Pound Sterling (GBP)", value: "GBP" },
      { label: "Japanese Yen (JPY)", value: "JPY" },
      { label: "Canadian Dollar (CAD)", value: "CAD" },
      { label: "Australian Dollar (AUD)", value: "AUD" },
      { label: "Swiss Franc (CHF)", value: "CHF" },
      { label: "Chinese Yuan (CNY)", value: "CNY" },
      { label: "Russian Ruble (RUB)", value: "RUB" },
      { label: "Saudi Riyal (SAR)", value: "SAR" },
      { label: "Brazilian Real (BRL)", value: "BRL" },
      { label: "Indian Rupee (INR)", value: "INR" },
      { label: "South Korean Won (KRW)", value: "KRW" },
      { label: "Swedish Krona (SEK)", value: "SEK" },
      { label: "Turkish Lira (TRY)", value: "TRY" },
    ],
    languageOptions: [
      { label: "English (US)", value: "English (US)" },
      { label: "English (UK)", value: "English (UK)" },
      { label: "Urdu", value: "Urdu" },
      { label: "French", value: "French" },
      { label: "German", value: "German" },
      { label: "Italian", value: "Italian" },
      { label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
      { label: "Japanese", value: "Japanese" },
      { label: "Russian", value: "Russian" },
      { label: "Arabic", value: "Arabic" },
      { label: "Portuguese", value: "Portuguese" },
      { label: "Dutch", value: "Dutch" },
      { label: "Korean", value: "Korean" },
      { label: "Swedish", value: "Swedish" },
      { label: "Turkish", value: "Turkish" },
    ],
    countryOptions: [
      { label: "Pakistan", value: "Pakistan" },
      { label: "USA", value: "USA" },
      { label: "UK", value: "UK" },
      { label: "Spanish", value: "Spanish" },
      { label: "France", value: "France" },
      { label: "German", value: "German" },
      { label: "Italian", value: "Italian" },
      { label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
      { label: "Japanese", value: "rgJapanesegdsf" },
      { label: "Russian", value: "Russian" },
      { label: "Arabic", value: "Arabic" },
      { label: "Portuguese", value: "Portuguese" },
      { label: "Dutch", value: "Dutch" },
      { label: "Korean", value: "Korean" },
      { label: "Swedish", value: "Swedish" },
      { label: "Turkish", value: "Turkish" },
    ],
    unitOptions: [
      { label: "hours", value: "hrs" },
      { label: "day", value: "d" },
      { label: "month", value: "m" },
      { label: "year", value: "y" },
    ],
    

    // async fetchBusinessProfileDataBasedOnProfileType() {
    //   const profileType = this.selectedProfileType;

    //   try {
    //     let result;
    //     if (profileType === "individual") {
    //       result = await getBusinessProfileIndividualApi();
    //       // Update business profile data
    //       this.userProfile = {
    //         ...this.businessProfileDataindividual,
    //         ...result,
    //       };
    //       // Update userProfileData excluding selectedProfileType
    //       this.userProfileData = {
    //         ...this.userProfileData,
    //         ...result,
    //         selectedProfileType: this.userProfileData.selectedProfileType,
    //       };
    //     } else if (profileType === "organization") {
    //       result = await GetBusinessProfileOrganizationApi();
    //       // Update business profile data
    //       this.businessProfileDataOrganization = {
    //         ...this.businessProfileDataOrganization,
    //         ...result,
    //       };
    //       // Update userProfileData excluding selectedProfileType
    //       this.userProfileData = {
    //         ...this.userProfileData,
    //         ...result,
    //         selectedProfileType: this.userProfileData.selectedProfileType,
    //       };
    //     } else {
    //       // Handle other profile types if needed
    //     }

    //     console.log("Business Profile Data:", result);
    //   } catch (error) {
    //     console.error("Error fetching business profile data:", error.message);
    //   }
    // },
  }),
  // getters: {
  //   clonedFormData() {
  //     // Return a deep clone of the formData object
  //     return JSON.parse(JSON.stringify(this.formData));
  //   },
  // },
  actions: {
    // updateFormData(newFormData) {
    //   // Update the formData object
    //   Object.keys(newFormData).forEach(key => {
    //     if (this.formData.hasOwnProperty(key)) {
    //       this.formData[key] = newFormData[key];
    //     }
    //   });
    // },
    selectProfileType(profileType) {
      this.selectedProfileType = profileType;

      // Store selected profile type in local storage
      localStorage.setItem("selectedProfileType", profileType);

      if (profileType === "individual") {
        // Update userProfileData with businessProfileDataindividual
        this.userProfileData = {
          ...this.userProfileData,
          ...this.businessProfileDataindividual,
        };
      } else if (profileType === "organization") {
        // Update userProfileData with businessProfileDataOrganization
        this.userProfileData = {
          ...this.userProfileData,
          ...this.businessProfileDataOrganization,
        };
      }
    },

    updateFormData(newData) {
      this.formData = { ...this.formData, ...newData };
    },
    updateOrganizationProfile(clientData) {
      this.userClientProfile.clientType = "organization";
      clientData.clientType = "organization";
      this.userClientProfile.clientDataOrganization = clientData;
    },
    
    updateIndividualProfile(clientData) {
      this.userClientProfile.clientType = "individual";
      clientData.clientType = "individual";
      this.userClientProfile.clientDataindividual = clientData;
    },
    
    // updateClientProfileIndividual(userData) {
    //   this.clientDataIndividual = {
    //     ...this.clientDataIndividual,
    //     ...userData,
    //   };
    //   this.clientDataIndividual.clientType = this.clientType;
    // },
    // updateClientProfileorganization(userData) {
    //   this.clientDataOrganization = {
    //     ...this.clientDataOrganization,
    //     ...userData,
    //   };
    //   this.clientDataOrganization.clientType = this.clientType;
    //   this.signupData = { ...this.signupData, ...userData };
    // },
    updateUser(userData) {
      this.userProfileData = { ...this.userProfileData, ...userData };
    },
    updateUserData(userData) {
      this.signupData = { ...this.signupData, ...userData };
    },
    updateUserProfileIndividual(userData) {
      this.userProfileData.individualProfile = {
        ...this.userProfileData.individualProfile,
        ...userData,
      };
    },
    updateUserProfileOrganization(userData) {
      this.userProfileData.organizationProfile = {
        ...this.userProfileData.organizationProfile,
        ...userData,
      };
    },
    updateUserProfileAndBusinessProfile(userData, isInitial = false) {
      const profileType = this.selectedProfileType || "individual";

      if (profileType === "individual") {
        this.userProfileData.individualProfile = {
          ...this.userProfileData.individualProfile,
          ...userData,
        };
      } else if (profileType === "organization") {
        this.userProfileData.organizationProfile = {
          ...this.userProfileData.organizationProfile,
          ...userData,
        };
      }

      if (!isInitial) {
        this.userProfileData = {
          ...this.userProfileData,
          ...userData,
          selectedProfileType: profileType,
        };
      }
    }, resetFormData() {
      this.$state.formData = {
      
          description: "",
          language: "English (US)",
          currency: "PKR",
          purchaseOrderNumber: "",
          invoiceNumber: "",
          invoiceName: "INV",
          date: new Date(),
          invoiceDueDate: "",
          file: "",
          url: "",
          invoiceDue: "",
          sender: this.$state.formData.sender,
          receiver:"",
          items: [
            {
              description: "",
              quantity: 0,
              rate: 0,
              unit: "d",
              amount: 0,
            },
          ],
          notes: "",
          subtotal: 0,
          total: 0,
      }
    },
    resetaccount(){
      this.$state.userProfileData={}
    },
    resetState() {
      this.$state.userClientProfile = {
     clientDataOrganization :{
        firstName: "",
        clientType: "",
        lastName: "",
        email: "",
        websiteURL: "",
        address1: "",
        address2: "",
        postalCode: "",
        state: "",
        city: "",
        country: "Pakistan",
        currency: "PKR",
        phone: "",
        language: "English (US)",
        faxNumber: "",
        taxId: "",
        notes: "",
        organizationName: "",
        customFieldName: "",
        customFieldValue: "",
      },
      clientDataindividual : {
        firstName: "",
        clientType: "",
        lastName: "",
        email: "",
        websiteURL: "",
        address1: "",
        address2: "",
        postalCode: "",
        state: "",
        city: "",
        country: "Pakistan",
        currency: "PKR",
        phone: "",
        language: "English (US)",
        faxNumber: "",
        taxId: "",
        notes: "",
        customFieldName: "",
        customFieldValue: "",
      },
    }
  }, setDate(newValue) {
      // Set the date to the new value
      this.formData.date = newValue;
    },
  
    // onSelectProfileTypeChange(newProfileType) {
    //  console.log(`Selected profile type changed to: ${newProfileType}`);
    // },
    addMoreItem() {
      this.formData.items.push({
        description: "",
        quantity: "",
        rate: "",
        unit: "y",
        amount: "",
      });
    },
  
    getSubtotal() {
      let subtotal = 0;
      this.formData.items.forEach((item) => {
    subtotal += item.quantity * item.rate;
      });
      this.updateFormData({ subtotal });
      return subtotal;
    },

    getTotal() {
      // const tax = (this.formData.subtotal * this.formData.tax) / 100;
      const total = this.formData.subtotal;
      this.updateFormData({ total });
      return total;
    },
    selectProfileType(profileType) {
      this.selectedProfileType = profileType;
    },

    // created() {

    //   this.$watch((state) => state.selectedProfileType, this.onSelectProfileTypeChange);
    // },
  },
});
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  console.log("date", `${month}/${day}/${year}`);
  return `${month}/${day}/${year}`;
}

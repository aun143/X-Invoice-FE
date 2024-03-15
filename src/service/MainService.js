import { defineStore } from "pinia";
import {BASE_URL} from "../utils/config";

export const useInvoiceService = defineStore("InvoiceService", {
  state: () => ({}),

  actions: {
    async postInvoiceData(data) {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `${BASE_URL}/invoice/createInvoice`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error response
          console.error("Error Data:", errorData);
          throw new Error(
            `Failed to post data to the API. ${response.status}: ${
              errorData.message || "Unknown error"
            }`
          );
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error posting data to the API:", error);
        throw error;
      }
    },
    // async postInvoiceData(data) {
    //   try {
    //     const response = await fetch(
    //       `${BASE_URL}/invoice/createInvoice`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify(data),
    //       }
    //     );
    
    //     const responseData = await response.json();
    
    //     if (!response.ok) {
    //       throw new Error(responseData.message || 'Failed to create client.');
    //     }
    
    //     return { success: true, data: responseData };
    //   } catch (error) {
    //     return { success: false, error: error.message || 'An error occurred while creating the client.' };
    //   }
    // },

    async updateInvoiceData(Id, updatedData) {
      try {
        // const token = localStorage.getItem("accessToken");

        // console.log("accessTokeniS tHIS><><", accessToken);
        // console.log("Id is This", Id);
        const response = await fetch(
          `${BASE_URL}/invoice/updateInvoice/${Id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error Data:", errorData);
          throw new Error(
            `Failed to update invoice. ${response.status}: ${
              errorData.message || "Unknown error"
            }`
          );
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error updating invoice:", error);
        throw error;
      }
    },
  },
});

// BusinessProfileService.js

export const UpdateBusinessProfileApi = async (id, updatedData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/business/updatebusinessProfile/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Business Profile");
  }

  return response.json();
};



export const getBusinessProfileApi = async (id) => {
  const response = await fetch(
    `${BASE_URL}/business/getbusinessProfile/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Business Profile");
  }

  return response.json();
};

export const getClientApiData = async (id) => {
  const response = await fetch(
    `${BASE_URL}/client/getAllClient${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Client Profile");
  }

  return response.json();
};
const API_URL = `${BASE_URL}http://3.1.100.174:3010/upload/file`;

async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/file`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Image upload failed");
    }

    const imageData = await response.json();
    return imageData;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export { uploadImage };

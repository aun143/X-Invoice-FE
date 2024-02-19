import { defineStore } from "pinia";

export const useInvoiceService = defineStore("invoiceService", {
  state: () => ({}),

  actions: {
    async postInvoiceData(data) {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "http://localhost:3010/invoices/createInvoice",
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

    async updateInvoiceData(Id, updatedData) {
      try {
        // const token = localStorage.getItem("accessToken");

        // console.log("accessTokeniS tHIS><><", accessToken);
        // console.log("Id is This", Id);
        const response = await fetch(
          `http://localhost:3010/invoices/updateInvoice/${Id}`,
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
    `http://localhost:3010/individual/updatebusinessProfile/${id}`,
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

// export const UpdateBusinessProfileApi = async (id, updatedData) => {
//   const token = localStorage.getItem("accessToken");

//   const response = await fetch(
//     `http://localhost:3010/individual/updatebusinessProfile/${id}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,

//       },
//       body: JSON.stringify(updatedData),
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to update Business Profile");
//   }

//   return response.json();
// };

export const getBusinessProfileApi = async (id) => {
  const response = await fetch(
    `http://localhost:3010/individual/getbusinessProfile/${id}`,
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
    `http://localhost:3010/client/getAllClient${id}`,
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
const API_URL = "http://localhost:3010/upload/file";

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
// export const uploadImage = async (imageFile, additionalData) => {
//   try {
//     // Create a form data object
//     const formData = new FormData();
//     formData.append("image", imageFile); // Assuming 'image' is the key for the image file

//     // Append additional data if needed
//     for (const key in additionalData) {
//       if (additionalData.hasOwnProperty(key)) {
//         formData.append(key, additionalData[key]);
//       }
//     }

//     // Make a POST request to your server
//     const response = await axios.post(
//       "http://localhost:3010/upload/file",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           // Include any additional headers, e.g., authorization token
//         },
//       }
//     );

//     // Handle the response
//     console.log("Image uploaded successfully:", response.data);
//     return response.data; // You can return any relevant information from the response
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error; // Propagate the error for further handling
//   }
// };

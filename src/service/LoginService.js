import {BASE_URL} from "../utils/config";

export const loginUserApi = async (data) => {
  try{
  const response = await fetch(`${BASE_URL}/user/loginUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to create client.');
  }

  return { success: true, data: responseData };
} catch (error) {
  return { success: false, error: error.message || 'An error occurred while creating the client.' };
}
};

export const getUserDetailsApi = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    // console.log("accessToken:IS THIS bHAI>>> " + accessToken);
    const response = await fetch(`${BASE_URL}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log("accessToken:>>> ", accessToken);

    if (!response.ok) {
      throw new Error("Failed to get user details");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getUserDetailsApi:", error.message);
    throw error;
  }
};


// Assuming you have a function to retrieve the access token from local storage

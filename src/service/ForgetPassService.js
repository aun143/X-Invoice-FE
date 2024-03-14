import {BASE_URL} from "../utils/config";
export const ForgetUserApi = async (data) => {
  try{
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/user/userforgotpassword`, {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,


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

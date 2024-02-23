import {BASE_URL} from "../utils/config";
export const ForgetUserApi = async (data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/user/userforgotpassword`, {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,


    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to Forget Password');
  }

  return response.json();
};

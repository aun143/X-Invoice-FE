export const ForgetUserApi = async (data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch('http://localhost:3010/login/userforgotpassword', {

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

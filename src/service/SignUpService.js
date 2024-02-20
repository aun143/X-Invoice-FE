export const signUpUserApi = async (data) => {
  const response = await fetch('http://localhost:3010/login/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to SignUp');
  }

  return response.json();
};

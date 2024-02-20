export const loginUserApi = async (data) => {
  const response = await fetch("http://localhost:3010/login/loginUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to Login");
  }

  return response.json();
};

export const getUserDetailsApi = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    // console.log("accessToken:IS THIS bHAI>>> " + accessToken);
    const response = await fetch(`http://localhost:3010/login/me`, {
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

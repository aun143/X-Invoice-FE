import { BASE_URL } from "../utils/config";

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload/file`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      console.error("Failed to upload file");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

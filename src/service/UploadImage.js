import axiosInstance from './axios';
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`/upload/file`, formData);

    if (response) {
      return response.url;
    } else {
      console.error("Failed to upload file");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

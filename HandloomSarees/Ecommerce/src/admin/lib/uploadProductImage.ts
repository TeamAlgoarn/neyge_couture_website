import adminApi from "./adminApi";

type UploadResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    path: string;
    filename: string;
  };
};

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await adminApi.post<UploadResponse>(
    "/uploads/product-image",
    formData
  );

  return res.data.data.url;
}
export const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 10;
export const PRODUCT_MIN_DIMENSIONS = { width: 800, height: 800 } as const;
export const COLLECTION_MIN_DIMENSIONS = { width: 800, height: 600 } as const;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

type MinimumDimensions = {
  width: number;
  height: number;
};

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`${file.name} is not a valid image.`));
    };
    image.src = objectUrl;
  });
}

export async function validateImageFile(
  file: File,
  minimum: MinimumDimensions,
): Promise<void> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error(`${file.name}: only JPG, JPEG, PNG, and WEBP files are accepted.`);
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`${file.name}: image size must not exceed 5 MB.`);
  }

  const dimensions = await getImageDimensions(file);
  if (dimensions.width < minimum.width || dimensions.height < minimum.height) {
    throw new Error(
      `${file.name}: image must be at least ${minimum.width} × ${minimum.height}px.`,
    );
  }

  if (dimensions.width * dimensions.height > 40_000_000) {
    throw new Error(`${file.name}: image dimensions must not exceed 40 megapixels.`);
  }
}

export function getImageErrorMessage(error: unknown): string {
  const apiError = error as {
    response?: { data?: { detail?: string; message?: string } };
  };
  return (
    apiError.response?.data?.detail ||
    apiError.response?.data?.message ||
    (error instanceof Error ? error.message : "Image upload failed.")
  );
}

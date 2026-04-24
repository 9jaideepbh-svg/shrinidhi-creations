const MAX_FILE_SIZE_MB = 10;

export const uploadToCloudinary = async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products_upload");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddcxdhu3k/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.secure_url) {
        throw new Error(data.error?.message ?? "Cloudinary returned no URL.");
    }
    return data.secure_url;
};
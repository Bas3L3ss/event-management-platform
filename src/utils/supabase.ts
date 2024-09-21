import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

const uploadFile = async (file: File, folder: string) => {
  const timestamp = Date.now();
  const newName = `${folder}/${timestamp}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, file, {
      cacheControl: "3600",
    });

  if (error || !data) throw new Error("File upload failed");

  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};

export const uploadImages = async (images: File[]) => {
  const imageUrls: string[] = [];

  for (const image of images) {
    const imageUrl = await uploadFile(image, "images"); // Save in 'images' folder in the bucket
    imageUrls.push(imageUrl);
  }

  return imageUrls; // Return the array of image URLs
};

export const uploadVideo = async (video: File) => {
  return await uploadFile(video, "videos"); // Save in 'videos' folder in the bucket
};

export const deleteVideo = async (filePath: string) => {
  const file = "videos/" + filePath.split("/").pop();
  console.log(file);

  if (!file) throw new Error("Invalid URL");

  const { data, error } = await supabase.storage.from(bucket).remove([file]);

  if (error) {
    console.error("Error deleting files:", error.message);
    throw new Error("File deletion failed");
  }

  return data; // This will return information about the deleted files
};

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);
    setUploading(false);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  return { uploadImage, uploading };
}

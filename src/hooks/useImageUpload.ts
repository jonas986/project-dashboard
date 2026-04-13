"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const QUALITY = 0.82;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than max dimensions
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        "image/webp",
        QUALITY,
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);

    try {
      const compressed = await compressImage(file);
      const fileName = `${crypto.randomUUID()}.webp`;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(fileName, compressed, {
          contentType: "image/webp",
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploadImage, uploading };
}

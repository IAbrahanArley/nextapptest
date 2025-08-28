"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadStoreImage } from "@/hooks/mutations/use-upload-store-image";

interface ImageUploadProps {
  storeId: string;
  type: "logo" | "banner";
  currentImageUrl?: string | null;
  title: string;
  description: string;
  aspectRatio?: string;
}

export function ImageUpload({
  storeId,
  type,
  currentImageUrl,
  title,
  description,
  aspectRatio = "1:1",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = useUploadStoreImage(storeId);

  const handleUpload = async () => {
    if (!imageUrl.trim()) return;

    setIsUploading(true);
    try {
      await uploadImage.mutateAsync({ type, imageUrl: imageUrl.trim() });
      setImageUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      await uploadImage.mutateAsync({ type, imageUrl: "" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor={`${type}-url`}>URL da Imagem</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id={`${type}-url`}
                placeholder="https://exemplo.com/imagem.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isUploading}
              />
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!imageUrl.trim() || isUploading}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>

        {currentImageUrl && (
          <div className="space-y-2">
            <Label>Imagem Atual</Label>
            <div className="relative inline-block">
              <img
                src={currentImageUrl}
                alt={title}
                className={`rounded-lg border ${
                  type === "logo"
                    ? "w-24 h-24 object-cover"
                    : "w-full h-32 object-cover"
                }`}
                style={{ aspectRatio }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Proporção recomendada: {aspectRatio}</p>
          <p>• Formatos suportados: JPG, PNG, WebP</p>
          <p>• Tamanho máximo: 5MB</p>
        </div>
      </CardContent>
    </Card>
  );
}









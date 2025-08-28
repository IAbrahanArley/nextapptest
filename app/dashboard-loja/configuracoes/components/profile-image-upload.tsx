import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
}

export function ProfileImageUpload({
  currentImageUrl,
  onImageUpload,
}: ProfileImageUploadProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    currentImageUrl || ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter menos de 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      await onImageUpload(selectedImage);
      setSelectedImage(null);
      toast({
        title: "Sucesso",
        description: "Imagem de perfil atualizada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(currentImageUrl || "");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Imagem de Perfil
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Preview da imagem */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview da imagem"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        {/* Controles de upload */}
        <div className="flex-1 space-y-3">
          <div>
            <Label
              htmlFor="profile-image"
              className="cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Selecionar Imagem
              </div>
            </Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              JPG, PNG ou WebP. Máximo 5MB.
            </p>
          </div>

          {selectedImage && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
              >
                {isUploading ? "Enviando..." : "Fazer Upload"}
              </Button>
              <Button
                type="button"
                onClick={handleRemoveImage}
                variant="outline"
                size="sm"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

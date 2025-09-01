import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadStoreImage } from "@/actions/store-config";
import { storeConfigQueryKey } from "@/hooks/queries/use-store-config";
import { useToast } from "@/hooks/use-toast";

export const uploadStoreImageMutationKey = (storeId: string) => [
  "upload-store-image",
  storeId,
];

export function useUploadStoreImage(storeId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: uploadStoreImageMutationKey(storeId),
    mutationFn: ({
      type,
      imageUrl,
    }: {
      type: "logo" | "banner";
      imageUrl: string;
    }) => uploadStoreImage(storeId, type, imageUrl),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        queryClient.invalidateQueries({
          queryKey: storeConfigQueryKey(storeId),
        });
      } else {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    },
  });
}












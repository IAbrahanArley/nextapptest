import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { NFCeScanner } from "@/components/nfce-scanner";

interface NFCeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (sefazUrl: string) => void;
}

export function NFCeModal({ isOpen, onClose, onScan }: NFCeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Camera className="h-5 w-5" />
            Scanner de Nota Fiscal
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <NFCeScanner onScan={onScan} onClose={onClose} storeId="auto" />
        </div>
      </DialogContent>
    </Dialog>
  );
}






import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "./ui/alert-dialog";
  
  interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    deviceName: string;
    onConfirm: () => void;
  }
  
  export function DeleteConfirmDialog({
    isOpen,
    onClose,
    deviceName,
    onConfirm,
  }: DeleteConfirmDialogProps) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Remove this device?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to remove <span className="font-semibold">{deviceName}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl h-11 text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="rounded-xl h-11 bg-red-500 hover:bg-red-600 text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
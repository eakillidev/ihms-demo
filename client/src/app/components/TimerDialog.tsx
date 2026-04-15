import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Clock } from "lucide-react";

interface TimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  onSetTimer: (minutes: number) => void;
}

export function TimerDialog({ isOpen, onClose, deviceName, onSetTimer }: TimerDialogProps) {
  const timerOptions = [
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
  ];

  const handleSetTimer = (minutes: number) => {
    onSetTimer(minutes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Clock className="w-6 h-6 text-indigo-600" />
            Set Timer for {deviceName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          {timerOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleSetTimer(option.value)}
              className="w-full h-14 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 justify-start text-base font-medium"
              variant="outline"
            >
              <Clock className="w-5 h-5 mr-3" />
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
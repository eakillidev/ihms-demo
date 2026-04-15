import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AppleTimerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  onSetTimer: (totalSeconds: number) => void;
}

export function AppleTimerPicker({ isOpen, onClose, deviceName, onSetTimer }: AppleTimerPickerProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      onSetTimer(totalSeconds);
      onClose();
    }
  };

  const renderPicker = (
    value: number,
    setValue: (v: number) => void,
    max: number,
    label: string,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    const items = Array.from({ length: max + 1 }, (_, i) => i);

    return (
      <div className="flex-1 relative">
        <div
          ref={ref}
          className="h-[280px] overflow-y-scroll scrollbar-hide"
          style={{ scrollSnapType: "y mandatory" }}
          onScroll={(e) => {
            const scrollTop = e.currentTarget.scrollTop;
            const itemHeight = 56;
            const index = Math.round(scrollTop / itemHeight);
            setValue(Math.min(max, Math.max(0, index)));
          }}
        >
          <div style={{ height: "112px" }} />
          {items.map((item) => {
            const distance = Math.abs(item - value);
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : distance === 2 ? 0.2 : 0.1;

            return (
              <div
                key={item}
                className="h-[56px] flex items-center justify-center transition-opacity duration-150"
                style={{
                  scrollSnapAlign: "center",
                  opacity: opacity
                }}
              >
                <span className={`${item === value ? "text-2xl font-semibold" : "text-xl font-normal"} text-gray-900`}>
                  {item} {item === value && <span className="text-gray-700">{label}</span>}
                </span>
              </div>
            );
          })}
          <div style={{ height: "112px" }} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        hoursRef.current?.scrollTo({ top: hours * 56, behavior: "auto" });
        minutesRef.current?.scrollTo({ top: minutes * 56, behavior: "auto" });
        secondsRef.current?.scrollTo({ top: seconds * 56, behavior: "auto" });
      }, 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden"
            >
              <div className="p-6 text-center border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Set Timer</h3>
                <p className="text-sm text-gray-500 mt-1">{deviceName}</p>
              </div>

              <div className="relative py-8 px-6">
                <div className="flex gap-2">
                  {renderPicker(hours, setHours, 23, "hours", hoursRef)}
                  {renderPicker(minutes, setMinutes, 59, "min", minutesRef)}
                  {renderPicker(seconds, setSeconds, 59, "sec", secondsRef)}
                </div>

                <div className="absolute top-1/2 left-6 right-6 h-[56px] -translate-y-1/2 bg-gray-100/60 rounded-2xl pointer-events-none border border-gray-200/60" />

                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              </div>

              <div className="p-6 flex justify-between items-center gap-4">
                <button
                  onClick={onClose}
                  className="w-32 h-32 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all font-medium text-lg flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  className="w-32 h-32 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all font-medium text-lg shadow-xl shadow-emerald-200 flex items-center justify-center"
                >
                  Start
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
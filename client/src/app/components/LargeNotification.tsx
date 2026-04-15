import { motion, AnimatePresence } from "motion/react";
import { X, Zap, AlertTriangle, Info, Gamepad2, Tv, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationData {
  id: string;
  type: "warning" | "error" | "info" | "success" | "gaming" | "timer";
  title: string;
  description: string;
}

let notificationQueue: NotificationData[] = [];
let listeners: Array<(notifications: NotificationData[]) => void> = [];

export const showLargeNotification = (
  type: NotificationData["type"],
  title: string,
  description: string
) => {
  const notification: NotificationData = {
    id: Date.now().toString(),
    type,
    title,
    description,
  };
  notificationQueue = [...notificationQueue, notification];
  listeners.forEach((listener) => listener(notificationQueue));

  setTimeout(() => {
    notificationQueue = notificationQueue.filter((n) => n.id !== notification.id);
    listeners.forEach((listener) => listener(notificationQueue));
  }, 5000);
};

export function LargeNotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    listeners.push(setNotifications);
    return () => {
      listeners = listeners.filter((l) => l !== setNotifications);
    };
  }, []);

  const removeNotification = (id: string) => {
    notificationQueue = notificationQueue.filter((n) => n.id !== id);
    setNotifications(notificationQueue);
  };

  const getNotificationStyles = (type: NotificationData["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-gradient-to-r from-orange-50 to-yellow-50",
          border: "border-orange-300",
          icon: AlertTriangle,
          iconColor: "text-orange-600",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-orange-50",
          border: "border-red-300",
          icon: Zap,
          iconColor: "text-red-600",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
          border: "border-blue-300",
          icon: Info,
          iconColor: "text-blue-600",
        };
      case "success":
        return {
          bg: "bg-gradient-to-r from-emerald-50 to-green-50",
          border: "border-emerald-300",
          icon: Tv,
          iconColor: "text-emerald-600",
        };
      case "gaming":
        return {
          bg: "bg-gradient-to-r from-purple-50 to-pink-50",
          border: "border-purple-300",
          icon: Gamepad2,
          iconColor: "text-purple-600",
        };
      case "timer":
        return {
          bg: "bg-gradient-to-r from-indigo-50 to-purple-50",
          border: "border-indigo-300",
          icon: Clock,
          iconColor: "text-indigo-600",
        };
    }
  };

  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          const Icon = styles.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 400, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${styles.bg} ${styles.border} border-2 rounded-2xl shadow-2xl p-6 min-w-[400px] max-w-[500px] pointer-events-auto`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${styles.bg} ${styles.iconColor}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
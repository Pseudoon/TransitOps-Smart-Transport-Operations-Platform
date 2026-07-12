"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle, Truck, Wrench, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_ALERTS = [
  {
    id: 1,
    title: "License Expiring Soon",
    description: "Rajesh Kumar's license expires in 5 days.",
    time: "10 mins ago",
    icon: AlertTriangle,
    type: "warning",
    read: false,
  },
  {
    id: 2,
    title: "Maintenance Due",
    description: "Vehicle T-1041 has reached 10,000km since last service.",
    time: "2 hours ago",
    icon: Wrench,
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "Trip Completed",
    description: "Trip #TRP-8092 arrived at Pune Hub successfully.",
    time: "5 hours ago",
    icon: CheckCircle2,
    type: "success",
    read: true,
  },
  {
    id: 4,
    title: "Speeding Alert",
    description: "Vehicle T-1020 exceeded 80km/h on Highway 4.",
    time: "1 day ago",
    icon: Truck,
    type: "error",
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative grid size-8 place-items-center rounded-lg border border-border bg-card/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent animate-pulse shadow-glow" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
              <h3 className="font-display font-semibold flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-muted-foreground transition hover:text-primary"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  You're all caught up!
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 cursor-default",
                      !alert.read && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border",
                        alert.type === "warning" && "border-warning/30 bg-warning/10 text-warning",
                        alert.type === "info" && "border-info/30 bg-info/10 text-info",
                        alert.type === "success" && "border-success/30 bg-success/10 text-success",
                        alert.type === "error" && "border-destructive/30 bg-destructive/10 text-destructive"
                      )}
                    >
                      <alert.icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium leading-none mb-1",
                          !alert.read ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {alert.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {alert.description}
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {alert.time}
                      </p>
                    </div>
                    {!alert.read && (
                      <div className="shrink-0 pt-1">
                        <span className="block size-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t border-border p-2 bg-muted/30">
              <button className="w-full rounded-md py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface BackupContextType {
  isBackupEnabled: boolean;
  toggleBackup: () => void;
  triggerManualBackup: () => void;
}

// Create Context
const BackupContext = createContext<BackupContextType | undefined>(undefined);

// Provider Component
export const BackupProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBackupEnabled, setIsBackupEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("isBackupEnabled") === "true";
    setIsBackupEnabled(storedValue);
    // console.log("📡 Backup status loaded from localStorage:", storedValue);
  }, []);

  useEffect(() => {
    if (isBackupEnabled !== null) {
      localStorage.setItem("isBackupEnabled", isBackupEnabled.toString());
      // console.log("📡 Backup status saved to localStorage:", isBackupEnabled);
    }
  }, [isBackupEnabled]);

  useEffect(() => {
    let backupInterval: NodeJS.Timeout | null = null;
    let dailyScheduleTimeout: NodeJS.Timeout | null = null;

    if (isBackupEnabled) {
      // Auto-backup every minute (default)
    //   backupInterval = setInterval(() => {
    //     console.log("🔄 Auto backup triggered globally...");
    //     triggerManualBackup();
    //   }, 60000);

      // Schedule backup at 5 PM Manila Time
      const scheduleManilaBackup = () => {
        const now = new Date();
        const manilaTime = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).formatToParts(now);

        const hours = Number(manilaTime.find((p) => p.type === "hour")?.value);
        const minutes = Number(manilaTime.find((p) => p.type === "minute")?.value);

        if (hours === 17 && minutes === 0) {
          console.log("⏰ Scheduled backup triggered at 5 PM Manila time...");
          triggerManualBackup();
        }

        // Schedule the next check in 1 minute
        dailyScheduleTimeout = setTimeout(scheduleManilaBackup, 60000);
      };

      scheduleManilaBackup();
    }

    return () => {
      if (backupInterval) {
        clearInterval(backupInterval);
        console.log("⏹️ Auto backup stopped.");
      }
      if (dailyScheduleTimeout) {
        clearTimeout(dailyScheduleTimeout);
        console.log("⏹️ Manila scheduled backup stopped.");
      }
    };
  }, [isBackupEnabled]);

  const triggerManualBackup = async () => {
    try {
      console.log("🔄 Starting manual backup...");
      const response = await fetch("/api/backup");
      if (!response.ok) throw new Error("Backup failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `CRIS_BACKUP_DATA-${new Date().toISOString().replace(/[:.]/g, "-")}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log("✅ Backup completed!");
    } catch (error) {
      console.error("❌ Error creating backup:", error);
    }
  };

  const toggleBackup = () => {
    if (isBackupEnabled !== null) {
      setIsBackupEnabled((prev) => !prev);
    }
  };

  return (
    <BackupContext.Provider value={{ isBackupEnabled: isBackupEnabled ?? false, toggleBackup, triggerManualBackup }}>
      {children}
    </BackupContext.Provider>
  );
};

// Hook for using backup context
export const useBackup = () => {
  const context = useContext(BackupContext);
  if (!context) {
    throw new Error("useBackup must be used within a BackupProvider");
  }
  return context;
};

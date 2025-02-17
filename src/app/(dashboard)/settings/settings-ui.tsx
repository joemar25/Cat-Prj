"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Download, Palette, Save, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBackup } from "@/lib/context/BackupContext";
import { LanguageSelector } from "@/components/custom/language/language-selector";
import { ThemeChange } from "@/components/theme/theme-change";
import { t } from "i18next";
import { useState } from "react";


export function SettingsUI() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState(false);
  const { isBackupEnabled, toggleBackup, triggerManualBackup } = useBackup();

  // Prevent hydration error by not rendering content until state is loaded
  if (isBackupEnabled === null) {
    return <p className="text-center text-sm text-muted-foreground">Loading backup settings...</p>;
  }

  return (
    <div className="container flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interface Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Palette className="h-6 w-6 text-chart-1" />
            <CardTitle className="text-lg font-semibold">{t("interfaceTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium">{t("themeTitle")}</h3>
                <CardDescription className="text-sm">{t("themeDescription")}</CardDescription>
              </div>
              <ThemeChange />
            </div>
            <div className="w-full flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium">{t("languageTitle")}</h3>
                <CardDescription className="text-sm">{t("languageDescription")}</CardDescription>
              </div>
              <LanguageSelector />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Bell className="h-6 w-6 text-chart-1" />
            <CardTitle className="text-lg font-semibold">{t("notificationTitle", "Notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-toggle" className="text-base font-medium">
                {isNotificationsEnabled ? t("notificationsEnabled") : t("notificationsDisabled")}
              </Label>
              <Switch
                id="notification-toggle"
                checked={isNotificationsEnabled}
                onCheckedChange={setIsNotificationsEnabled}
                className="scale-110"
              />
            </div>
            {isNotificationsEnabled && (
              <CardDescription className="text-sm text-muted-foreground">
                {t("notificationsDescription", "You will receive important updates and alerts.")}
              </CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Lock className="h-6 w-6 text-chart-1" /> 
            <CardTitle className="text-lg font-semibold">{t("privacyTitle", "Privacy Settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy-mode" className="text-base font-medium">
                {isPrivacyModeEnabled ? t("privacyModeEnabled") : t("privacyModeDisabled")}
              </Label>
              <Switch
                id="privacy-mode"
                checked={isPrivacyModeEnabled}
                onCheckedChange={setIsPrivacyModeEnabled}
                className="scale-110"
              />
            </div>
            {isPrivacyModeEnabled && (
              <CardDescription className="mt-3 text-sm text-muted-foreground">
                {t("privacyModeDescription", "Your data sharing and tracking settings are minimized.")}
              </CardDescription>
            )}
          </CardContent>
        </Card>
        {/* Backup Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center">
            <Download className="h-6 w-6 text-chart-1" />
            <CardTitle className="text-lg font-semibold">Backup Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="backup-mode" className="text-base font-medium">
                  {isBackupEnabled ? "Automatic backup enabled" : "Automatic backup disabled"}
                </Label>
                <Switch
                  id="backup-mode"
                  checked={isBackupEnabled}
                  onCheckedChange={toggleBackup}
                  className="scale-110"
                />
              </div>
              {isBackupEnabled && (
                <CardDescription className="text-sm text-muted-foreground">
                  Auto-backup is enabled. Backups will be created every minute.
                </CardDescription>
              )}
            </div>
            <div>
              <CardDescription className="text-sm mb-3">
                You can manually trigger a backup if needed.
              </CardDescription>
              <Button
                onClick={triggerManualBackup}
                className="w-full flex items-center gap-2 py-2 hover:bg-chart-1/90 transition"
              >
                <Save className="h-5 w-5" />
                Manual Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

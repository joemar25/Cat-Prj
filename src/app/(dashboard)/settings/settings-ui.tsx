"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ThemeChange } from "@/components/theme/theme-change"
import { Palette, Download, Save, Bell, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/custom/language/language-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsUI() {
  const { t } = useTranslation()
  const [isBackupEnabled, setIsBackupEnabled] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState(false)

  const handleManualBackup = async () => {
    try {
      const response = await fetch('/api/backup')
      if (!response.ok) throw new Error('Backup failed')
  
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
  
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
  
      console.log(t("backup.manual.completed"))
    } catch (error) {
      console.error("❌ Error creating backup:", error)
    }
  }
  
  
  

  return (
    <div className="container flex flex-col gap-6">
      <Alert>
        <Icons.infoCircledIcon className="h-4 w-4" />
        <AlertTitle>{t("settingsNoticeTitle", "Note:")}</AlertTitle>
        <AlertDescription>
          {t("settingsNoticeDescription", "These settings are for UI/UX demonstration purposes and are not final.")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interface Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Palette className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold">{t("interfaceTitle")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-2">{t("themeTitle")}</h3>
              <CardDescription className="text-sm mb-3">{t("themeDescription")}</CardDescription>
              <ThemeChange />
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">{t("languageTitle")}</h3>
              <CardDescription className="text-sm mb-3">{t("languageDescription")}</CardDescription>
              <LanguageSelector />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Bell className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold">{t("notificationTitle", "Notifications")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-toggle" className="text-base font-medium">
                {isNotificationsEnabled ? t("notificationsEnabled", "Notifications Enabled") : t("notificationsDisabled", "Notifications Disabled")}
              </Label>
              <Switch
                id="notification-toggle"
                checked={isNotificationsEnabled}
                onCheckedChange={setIsNotificationsEnabled}
                className="scale-110"
              />
            </div>

            {isNotificationsEnabled && (
              <CardDescription className="mt-3 text-sm text-muted-foreground">
                {t("notificationsDescription", "You will receive important updates and alerts.")}
              </CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="flex items-center gap-3 pb-4">
            <Lock className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold">{t("privacyTitle", "Privacy Settings")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy-mode" className="text-base font-medium">
                {isPrivacyModeEnabled ? t("privacyModeEnabled", "Privacy Mode On") : t("privacyModeDisabled", "Privacy Mode Off")}
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
          <CardHeader className="flex items-center gap-3 pb-4">
            <Download className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold">{t("backupTitle")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="backup-mode" className="text-base font-medium">
                  {isBackupEnabled ? t("backupEnabled") : t("backupDisabled")}
                </Label>
                <Switch
                  id="backup-mode"
                  checked={isBackupEnabled}
                  onCheckedChange={setIsBackupEnabled}
                  className="scale-110"
                />
              </div>

              {isBackupEnabled && (
                <CardDescription className="mt-3 text-sm text-muted-foreground">
                  {t("backupAutoMessage")}
                </CardDescription>
              )}
            </div>

            <div>
              <CardDescription className="text-sm mb-3">{t("backupManualDescription")}</CardDescription>
              <Button
                onClick={handleManualBackup}
                className="w-full flex items-center gap-2 py-2 hover:bg-primary/90 transition"
              >
                <Save className="h-5 w-5" />
                {t("backupManualButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

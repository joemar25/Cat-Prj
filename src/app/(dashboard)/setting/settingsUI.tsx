"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Palette, Download, Save } from "lucide-react"
import { ThemeChange } from "@/components/theme/theme-change"
import { LanguageSelector } from "@/components/custom/language/language-selector"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export function SettingsUI() {
  const { t } = useTranslation()
  const [isBackupEnabled, setIsBackupEnabled] = useState(false)

  const handleManualBackup = () => {
    console.log(t("backup.manual.initiated")) // Logs "Manual backup initiated" in the selected language
  }

  return (
    <div className="container py-8">
      <div className="">
        <CardHeader className="pb-8">
          <CardTitle className="text-base font-bold">{t("settingsTitle")}</CardTitle>
          <CardDescription className="text-base">{t("settingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <Palette className="h-7 w-7" />
                {t("interfaceTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div>
                <h3 className="text-base font-medium mb-3">{t("themeTitle")}</h3>
                <CardDescription className="mb-4 text-base">{t("themeDescription")}</CardDescription>
                <ThemeChange />
              </div>
              <div>
                <h3 className="text-base font-medium mb-3">{t("languageTitle")}</h3>
                <CardDescription className="mb-4 text-base">{t("languageDescription")}</CardDescription>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <Download className="h-7 w-7" />
                {t("backupTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div>
                <CardDescription className="mb-6 text-base">{t("backupDescription")}</CardDescription>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="backup-mode"
                    checked={isBackupEnabled}
                    onCheckedChange={setIsBackupEnabled}
                    className="scale-125"
                  />
                  <Label htmlFor="backup-mode" className="text-base">
                    {isBackupEnabled ? t("backupEnabled") : t("backupDisabled")}
                  </Label>
                </div>
                {isBackupEnabled && (
                  <CardDescription className="mt-4 text-base text-muted-foreground">
                    {t("backupAutoMessage")}
                  </CardDescription>
                )}
              </div>
              <div>
                <CardDescription className="mb-4 text-base">{t("backupManualDescription")}</CardDescription>
                <Button onClick={handleManualBackup} className="w-full max-w-56">
                  <Save className="mr-2 h-5 w-5" />
                  {t("backupManualButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </div>
    </div>
  )
}

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-context";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-gray-700" /> Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="text-gray-500 text-sm">
            More settings coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

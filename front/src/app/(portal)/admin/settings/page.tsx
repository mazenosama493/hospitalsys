"use client";

import { useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSystemSettings } from "@/features/admin/mock/data";
import type { SystemSetting } from "@/types";

type SettingsMap = Record<string, string | number | boolean>;

function buildDefaults(settings: SystemSetting[]): SettingsMap {
  const map: SettingsMap = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  return map;
}

const CATEGORIES = ["general", "security", "notifications", "integrations"] as const;
type SettingCategory = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<SettingCategory, string> = {
  general:       "General",
  security:      "Security",
  notifications: "Notifications",
  integrations:  "Integrations",
};

export default function SettingsPage() {
  const [values, setValues] = useState<SettingsMap>(buildDefaults(mockSystemSettings));
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  const set = (key: string, val: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSavedKeys((prev) => prev.filter((k) => k !== key));
  };

  const saveCategory = (category: SettingCategory) => {
    const keys = mockSystemSettings
      .filter((s) => s.category === category)
      .map((s) => s.key);
    setSavedKeys((prev) => [...new Set([...prev, ...keys])]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure system-wide hospital settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{CATEGORY_LABELS[cat]}</TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          const categorySettings = mockSystemSettings.filter((s) => s.category === cat);
          const hasUnsaved = categorySettings.some((s) => !savedKeys.includes(s.key));
          return (
            <TabsContent key={cat} value={cat} className="space-y-6 mt-4">
              <div className="max-w-2xl space-y-5">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      {setting.requiresRestart && (
                        <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-700 gap-1">
                          <RefreshCw className="h-2.5 w-2.5" /> Restart
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>

                    {setting.type === "boolean" ? (
                      <Switch
                        id={setting.key}
                        checked={values[setting.key] as boolean}
                        onCheckedChange={(v) => set(setting.key, v)}
                      />
                    ) : setting.type === "select" ? (
                      <Select
                        value={String(values[setting.key])}
                        onValueChange={(v) => { if (v != null) set(setting.key, v); }}
                      >
                        <SelectTrigger id={setting.key} className="w-72 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(setting.options ?? []).map((opt) => (
                            <SelectItem key={opt} value={opt} className="capitalize">{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : setting.type === "textarea" ? (
                      <Textarea
                        id={setting.key}
                        className="w-full max-w-lg text-sm"
                        rows={3}
                        value={String(values[setting.key])}
                        onChange={(e) => set(setting.key, e.target.value)}
                      />
                    ) : setting.type === "number" ? (
                      <Input
                        id={setting.key}
                        type="number"
                        className="w-32 h-9 text-sm"
                        value={Number(values[setting.key])}
                        onChange={(e) => set(setting.key, Number(e.target.value))}
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        type="text"
                        className="w-full max-w-lg h-9 text-sm"
                        value={String(values[setting.key])}
                        onChange={(e) => set(setting.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/40 max-w-2xl">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => saveCategory(cat)}
                  disabled={!hasUnsaved}
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                {!hasUnsaved && (
                  <span className="text-xs text-emerald-600 font-medium">All changes saved</span>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

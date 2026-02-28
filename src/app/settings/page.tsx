"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/firebase";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Sprout,
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your farm configuration has been updated.",
      });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Control Center
          </h1>
          <p className="text-muted-foreground">Manage your profile, farm telemetry, and AI preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="farm" className="gap-2">
              <Sprout className="h-4 w-4" />
              Farm Config
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Farmer Profile</CardTitle>
                <CardDescription>Update your personal information and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.displayName || ""} placeholder="Farmer Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled className="bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Farm Description</Label>
                  <Input id="bio" placeholder="e.g. 50-acre family farm specializing in heritage corn." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farm">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Telemetry Settings</CardTitle>
                <CardDescription>Configure how your sensors sync with the AgroVision cloud.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      Real-time Sync
                    </div>
                    <div className="text-sm text-muted-foreground">Push sensor updates to Firestore every 5 minutes.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Anonymize Data
                    </div>
                    <div className="text-sm text-muted-foreground">Contribute to regional yield models anonymously.</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>AI Alert Preferences</CardTitle>
                <CardDescription>Choose which agricultural events trigger push notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex-1">Frost & Extreme Weather Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex-1">Soil Moisture Critical Levels</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex-1">AI Crop Rotation Suggestions</Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="farmer-button h-12 px-8 gap-2">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

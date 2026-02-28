
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CloudRain, 
  AlertTriangle, 
  Sprout, 
  Droplets, 
  Trash2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialNotifications = [
  {
    id: 1,
    type: "weather",
    title: "Frost Alert: Valley Basin",
    description: "Temperatures expected to drop below 2°C on April 12. Take protective measures for young Soybeans.",
    time: "2 hours ago",
    read: false,
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    id: 2,
    type: "ai",
    title: "New Yield Recommendation",
    description: "AI analysis suggests a 12% yield boost if you increase Nitrogen by 15kg/ha in the North Hill sector.",
    time: "5 hours ago",
    read: false,
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 3,
    type: "water",
    title: "Critical Moisture: East Brook",
    description: "Soil moisture in Sector B has dropped to 32%. Automated irrigation has been queued.",
    time: "1 day ago",
    read: true,
    icon: Droplets,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 4,
    type: "system",
    title: "Sensor Sync Complete",
    description: "All 12 IoT field sensors successfully synchronized with project studio-6018643022-dffb6.",
    time: "2 days ago",
    read: true,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated on your farm's health and AI insights.</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="h-10 text-xs font-bold uppercase tracking-widest">
              Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const Icon = n.icon;
              return (
                <Card 
                  key={n.id} 
                  className={cn(
                    "border-none shadow-sm transition-all group relative overflow-hidden",
                    !n.read && "bg-muted/30 border-l-4 border-l-primary"
                  )}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl shrink-0", n.bg)}>
                      <Icon className={cn("h-5 w-5", n.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className={cn("font-bold", !n.read ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </h3>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteNotification(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-24 bg-muted/10 rounded-3xl border-2 border-dashed">
              <div className="bg-white p-6 rounded-full shadow-sm w-fit mx-auto mb-4">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p className="text-sm text-muted-foreground">No new notifications for your farm.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

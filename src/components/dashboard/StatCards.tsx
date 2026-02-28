"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, TrendingUp, AlertTriangle, Droplets } from "lucide-react";

export function StatCards() {
  const stats = [
    {
      title: "Avg. Yield Predicted",
      value: "5,240 kg/ha",
      trend: "+12% vs last season",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Recommended Crop",
      value: "Corn (Maize)",
      trend: "Optimal for high rain",
      icon: Sprout,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Soil Moisture",
      value: "Optimal (24%)",
      trend: "Next watering in 2 days",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Alerts",
      value: "2 Notifications",
      trend: "Check fertilizer status",
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, TrendingUp, AlertTriangle, Droplets, Loader2 } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";

export function StatCards() {
  const firestore = useFirestore();

  const predictionsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "predictions");
  }, [firestore]);

  const fieldsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "fields");
  }, [firestore]);

  const { data: predictions, loading: predLoading } = useCollection(predictionsQuery);
  const { data: fields, loading: fieldsLoading } = useCollection(fieldsQuery);

  const stats = useMemo(() => {
    const avgYield = predictions?.length 
      ? Math.round(predictions.reduce((acc, p: any) => acc + (p.predictedYield || 0), 0) / predictions.length)
      : 0;

    const avgMoisture = fields?.length
      ? Math.round(fields.reduce((acc, f: any) => acc + (f.moisture || 0), 0) / fields.length)
      : 0;

    const recommendedCrop = fields?.[0]?.crop || "Corn (Maize)";

    return [
      {
        title: "Avg. Yield Predicted",
        value: avgYield > 0 ? `${avgYield.toLocaleString()} kg/ha` : "No data",
        trend: predictions?.length ? `Based on ${predictions.length} records` : "Start analyzing",
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        title: "Target Crop",
        value: recommendedCrop,
        trend: "Optimal for region",
        icon: Sprout,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Soil Moisture",
        value: avgMoisture > 0 ? `${avgMoisture}%` : "No sensors",
        trend: avgMoisture > 50 ? "Healthy levels" : "Requires check",
        icon: Droplets,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Active Alerts",
        value: fields?.length === 0 ? "1 Notification" : "0 Notifications",
        trend: fields?.length === 0 ? "Connect field sensors" : "System normal",
        icon: AlertTriangle,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ];
  }, [predictions, fields]);

  if (predLoading || fieldsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 border-none shadow-sm flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
          </Card>
        ))}
      </div>
    );
  }

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
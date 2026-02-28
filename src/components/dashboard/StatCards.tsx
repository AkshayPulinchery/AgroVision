"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Droplets, FlaskConical, BarChart3 } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { MOCK_FIELDS, MOCK_PREDICTIONS } from "@/lib/mock-data";

export function StatCards() {
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  const predictionsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "predictions");
  }, [firestore]);

  const fieldsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "fields");
  }, [firestore]);

  const { data: dbPredictions } = useCollection(predictionsQuery);
  const { data: dbFields } = useCollection(fieldsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!mounted) return [];

    // Merge DB and Mock for statistics
    const allPredictions = [...MOCK_PREDICTIONS, ...(dbPredictions || [])];
    const allFields = [...MOCK_FIELDS, ...(dbFields || [])];

    const avgYield = allPredictions.length 
      ? Math.round(allPredictions.reduce((acc, p: any) => acc + (p.predictedYield || 0), 0) / allPredictions.length)
      : 0;

    const avgMoisture = allFields.length
      ? Math.round(allFields.reduce((acc, f: any) => acc + (f.moisture || 0), 0) / allFields.length)
      : 0;

    const avgPH = allFields.length
      ? (allFields.reduce((acc, f: any) => acc + (f.soilPH || 0), 0) / allFields.length).toFixed(1)
      : "0";

    return [
      {
        title: "Total Yield Analyzed",
        value: `${allPredictions.length.toLocaleString()}`,
        trend: "Across all seasons",
        icon: BarChart3,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Soil PH (Avg)",
        value: `${avgPH} pH`,
        trend: "Regional healthy range",
        icon: FlaskConical,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        title: "Avg. Moisture",
        value: `${avgMoisture}%`,
        trend: avgMoisture > 50 ? "Satisfactory" : "Low Moisture",
        icon: Droplets,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Avg. Predicted Yield",
        value: avgYield > 0 ? `${avgYield.toLocaleString()} kg/ha` : "0 kg/ha",
        trend: "Estimated current harvest",
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
    ];
  }, [dbPredictions, dbFields, mounted]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted/50 border-none" />
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

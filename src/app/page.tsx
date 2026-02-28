"use client";

import { useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCards } from "@/components/dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sprout, 
  ArrowRight, 
  Map as MapIcon, 
  CloudRain,
  ThermometerSun,
  Loader2,
  RefreshCw,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { MOCK_PREDICTIONS, MOCK_FIELDS } from "@/lib/mock-data";

export default function Dashboard() {
  const firestore = useFirestore();
  const [weatherTime, setWeatherTime] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setWeatherTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setWeatherTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const predictionsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "predictions"), 
      orderBy("createdAt", "desc"), 
      limit(5)
    );
  }, [firestore]);
  
  const { data: dbPredictions, loading: dbLoading } = useCollection(predictionsQuery);

  // Fallback to MOCK data if DB is empty or loading
  const displayPredictions = useMemo(() => {
    if (!isMounted) return [];
    if (dbPredictions && dbPredictions.length > 0) return dbPredictions;
    return MOCK_PREDICTIONS.slice(0, 5);
  }, [dbPredictions, isMounted]);

  const avgTemp = useMemo(() => {
    if (!isMounted) return 0;
    return Math.round(MOCK_FIELDS.reduce((acc, f) => acc + (f.temp || 24), 0) / MOCK_FIELDS.length);
  }, [isMounted]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Farm Command Center
            </h1>
            <p className="text-muted-foreground">
              Real-time farm telemetry & predictive analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/predict">
              <Button size="lg" className="farmer-button gap-2">
                <Sprout className="h-5 w-5" />
                New Prediction
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <Sprout className="w-64 h-64" />
          </div>
          <CardContent className="p-8">
            <div className="max-w-xl space-y-4">
              <h2 className="text-2xl font-bold">Optimal Planting Season Starts Soon!</h2>
              <p className="text-primary-foreground/90">
                Based on historical rainfall patterns and current soil sensors, 
                the best time to plant your **Corn** crop is in the next 10 days.
              </p>
              <Button variant="secondary" className="gap-2 font-bold" asChild>
                <Link href="/recommendations">
                  View AI Recommendations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Latest AI yield estimations</CardDescription>
              </div>
              <Link href="/predict">
                <Button variant="ghost" className="text-primary font-bold">New Forecast</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isMounted ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : displayPredictions.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">{item.crop}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.createdAt instanceof Date 
                            ? formatDistanceToNow(item.createdAt, { addSuffix: true }) 
                            : item.createdAt?.toDate 
                              ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) 
                              : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{item.predictedYield?.toLocaleString()} kg/ha</div>
                      <div className="text-xs text-muted-foreground">Confidence: {Math.round((item.confidence || 0) * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
             <Card className="shadow-sm border-none bg-accent/5 relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-accent-foreground/40 uppercase">
                <RefreshCw className="h-2 w-2 animate-spin" />
                Live Sync
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  Farm Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <ThermometerSun className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-xl font-bold">{isMounted ? `${avgTemp}°C` : "--°C"}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">
                        {isMounted ? weatherTime : "--:--:--"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Conditions</div>
                    <div className="text-xs text-muted-foreground">Cloudy / Humid</div>
                  </div>
                </div>
                <Link href="/map" className="block">
                  <Button className="w-full justify-between h-12" variant="outline">
                    Explore Farm Map
                    <MapIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none overflow-hidden">
               <div className="relative h-32 w-full">
                  <Image 
                    src="https://picsum.photos/seed/agri-planner/400/200" 
                    alt="Season Planner" 
                    fill 
                    className="object-cover"
                    data-ai-hint="farm fields"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-bold">Season Planner</h3>
                  </div>
               </div>
               <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan your next crop rotation based on real-time soil analysis.
                  </p>
                  <Link href="/planner">
                    <Button className="w-full" variant="secondary">
                      Open Planner
                    </Button>
                  </Link>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

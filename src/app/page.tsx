"use client";

import { useMemo } from "react";
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
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const firestore = useFirestore();
  
  const predictionsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "predictions"), 
      orderBy("createdAt", "desc"), 
      limit(5)
    );
  }, [firestore]);
  
  const { data: predictions, loading } = useCollection(predictionsQuery);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Welcome back, Farmer Joe!
            </h1>
            <p className="text-muted-foreground">
              Here is your farm's real-time performance summary.
            </p>
          </div>
          <Link href="/predict">
            <Button size="lg" className="farmer-button gap-2">
              <Sprout className="h-5 w-5" />
              New Prediction
            </Button>
          </Link>
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
                <CardDescription>Latest AI yield estimations synced in real-time</CardDescription>
              </div>
              <Link href="/predict">
                <Button variant="ghost" className="text-primary font-bold">New Forecast</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-sm">Fetching predictions...</p>
                  </div>
                ) : predictions && predictions.length > 0 ? (
                  predictions.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                          <Sprout className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{item.crop}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.createdAt?.toDate ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{item.predictedYield?.toLocaleString()} kg/ha</div>
                        <div className="text-xs text-muted-foreground">Confidence: {Math.round((item.confidence || 0) * 100)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                    <p className="text-sm text-muted-foreground">No predictions found. Start by running a yield analysis.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
             <Card className="shadow-sm border-none bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  Local Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <ThermometerSun className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-xl font-bold">28°C</div>
                      <div className="text-xs text-muted-foreground">Partly Cloudy</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Humid</div>
                    <div className="text-xs text-muted-foreground">62%</div>
                  </div>
                </div>
                <Link href="/map" className="block">
                  <Button className="w-full justify-between h-12" variant="outline">
                    Explore Heatmap
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
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-bold">Season Planner</h3>
                  </div>
               </div>
               <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan your next crop rotation based on AI yield analysis.
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

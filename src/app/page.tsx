"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { StatCards } from "@/components/dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sprout, 
  ArrowRight, 
  Map as MapIcon, 
  Calendar,
  CloudRain,
  ThermometerSun
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Welcome back, Farmer Joe!
            </h1>
            <p className="text-muted-foreground">
              Here is what's happening on your farm today.
            </p>
          </div>
          <Link href="/predict">
            <Button size="lg" className="farmer-button gap-2">
              <Sprout className="h-5 w-5" />
              New Prediction
            </Button>
          </Link>
        </div>

        {/* Hero Alert */}
        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <Sprout className="w-64 h-64" />
          </div>
          <CardContent className="p-8">
            <div className="max-w-xl space-y-4">
              <h2 className="text-2xl font-bold">Optimal Planting Season Starts Soon!</h2>
              <p className="text-primary-foreground/90">
                Based on historical rainfall patterns and current soil temp (22°C), 
                the best time to plant your **Corn** crop is in the next 10 days.
              </p>
              <Button variant="secondary" className="gap-2 font-bold" asChild>
                <Link href="/recommendations">
                  View Full Report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Predictions */}
          <Card className="lg:col-span-2 shadow-sm border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Your farm's latest yield estimations</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary font-bold">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { field: "North Field", crop: "Corn", yield: "8,450 kg/ha", date: "2 days ago", score: "94%" },
                  { field: "East Sector", crop: "Soybeans", yield: "3,200 kg/ha", date: "1 week ago", score: "89%" },
                  { field: "Valley Basin", crop: "Rice", yield: "5,100 kg/ha", date: "2 weeks ago", score: "91%" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">{item.field}</h4>
                        <p className="text-sm text-muted-foreground">{item.crop} • {item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{item.yield}</div>
                      <div className="text-xs text-muted-foreground">Confidence: {item.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Weather */}
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
                  <Button className="w-full" variant="secondary">
                    Open Planner
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

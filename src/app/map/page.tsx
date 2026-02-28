
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Layers, 
  Navigation, 
  Maximize2,
  Sprout,
  Activity,
  Droplets,
  X,
  ChevronRight,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import for Leaflet (client-side only)
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
      <Sprout className="h-12 w-12 text-muted-foreground opacity-20" />
    </div>
  ),
});

type Field = {
  id: string;
  name: string;
  crop: string;
  yield: string;
  moisture: number;
  health: number;
  lat: number;
  lng: number;
};

const MOCK_FIELDS: Field[] = [
  { 
    id: "f1", 
    name: "North Hill", 
    crop: "Corn", 
    yield: "8,400 kg/ha", 
    moisture: 62, 
    health: 94, 
    lat: -1.2833, 
    lng: 36.8167 
  },
  { 
    id: "f2", 
    name: "East Brook", 
    crop: "Soybeans", 
    yield: "7,100 kg/ha", 
    moisture: 42, 
    health: 82, 
    lat: -1.2880, 
    lng: 36.8250 
  },
  { 
    id: "f3", 
    name: "Valley Basin", 
    crop: "Wheat", 
    yield: "5,800 kg/ha", 
    moisture: 85, 
    health: 78, 
    lat: -1.2950, 
    lng: 36.8100 
  },
];

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeLayer, setActiveLayer] = useState<'yield' | 'moisture' | 'health'>('yield');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl border bg-muted group">
        
        {/* Interactive Leaflet Map */}
        <div className="absolute inset-0 z-0">
          <LeafletMap 
            fields={MOCK_FIELDS} 
            onSelectField={setSelectedField} 
            selectedField={selectedField}
          />
        </div>

        {/* Floating Controls */}
        <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 flex flex-col gap-4 z-10">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
            <Input 
              placeholder="Search farm fields..." 
              className="pl-11 h-14 bg-white/95 backdrop-blur-md shadow-xl border-none text-base rounded-2xl ring-offset-transparent focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>

          <Card className="bg-white/95 backdrop-blur-md shadow-xl border-none rounded-2xl overflow-hidden">
            <div className="p-2 grid grid-cols-3 gap-1">
              {[
                { id: 'yield', icon: Activity, label: 'Yield' },
                { id: 'moisture', icon: Droplets, label: 'Water' },
                { id: 'health', icon: Sprout, label: 'Health' },
              ].map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{layer.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Action Buttons */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <Button size="icon" className="h-12 w-12 bg-white text-foreground hover:bg-white/90 shadow-xl rounded-2xl border-none">
            <Layers className="h-5 w-5" />
          </Button>
          <Button size="icon" className="h-12 w-12 bg-white text-foreground hover:bg-white/90 shadow-xl rounded-2xl border-none">
            <Maximize2 className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            className="h-12 w-12 bg-primary text-primary-foreground shadow-xl rounded-2xl border-none"
            onClick={() => setSelectedField(MOCK_FIELDS[0])}
          >
            <Navigation className="h-5 w-5" />
          </Button>
        </div>

        {/* Legend */}
        <Card className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md shadow-2xl border-none rounded-2xl p-4 hidden md:block z-10">
          <div className="text-[10px] font-black uppercase mb-3 text-muted-foreground tracking-[0.2em]">Intensity Scale</div>
          <div className="flex flex-col gap-2.5">
            {[
              { color: 'bg-red-500', label: 'Critical / Low' },
              { color: 'bg-yellow-500', label: 'Alert / Moderate' },
              { color: 'bg-emerald-500', label: 'Optimal / High' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full shadow-sm", item.color)}></div>
                <span className="text-[11px] font-bold text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Field Sidebar */}
        <div className={cn(
          "absolute right-6 top-6 bottom-6 w-80 bg-white/98 backdrop-blur-xl shadow-2xl rounded-3xl z-20 transition-all duration-500 transform border border-white/20",
          selectedField ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
        )}>
          {selectedField && (
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedField(null)}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-black text-foreground mb-1">{selectedField.name}</h2>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{selectedField.crop} Sector</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-2xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Moisture</div>
                    <div className="text-xl font-black flex items-center gap-1.5">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      {selectedField.moisture}%
                    </div>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-2xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Health</div>
                    <div className="text-xl font-black flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      {selectedField.health}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Soil Temperature</span>
                    <span className="text-primary">24.2°C</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary"></div>
                  </div>
                </div>

                <Card className="bg-primary text-primary-foreground border-none shadow-lg mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      AI Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-medium leading-relaxed opacity-90">
                      Optimal harvest window for this sector is in 12-14 days. Nitrogen levels are peaking.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full h-14 rounded-2xl font-bold gap-2 mt-6">
                Open Field Report
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Mobile Scroll */}
        <div className="md:hidden absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto no-scrollbar py-2 z-10">
          {MOCK_FIELDS.map((field) => (
            <Button 
              key={field.id}
              onClick={() => setSelectedField(field)}
              className={cn(
                "h-14 px-6 rounded-2xl whitespace-nowrap shadow-xl border-none transition-all",
                selectedField?.id === field.id ? "bg-primary text-primary-foreground scale-105" : "bg-white/95 text-foreground"
              )}
            >
              {field.name}
            </Button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

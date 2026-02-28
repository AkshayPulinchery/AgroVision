
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Layers, 
  Navigation, 
  Filter, 
  Maximize2,
  Sprout,
  Activity,
  Droplets,
  ThermometerSun,
  X,
  ChevronRight,
  Info
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Field = {
  id: string;
  name: string;
  crop: string;
  yield: string;
  moisture: number;
  health: number;
  pos: { top: string; left: string };
};

const MOCK_FIELDS: Field[] = [
  { 
    id: "f1", 
    name: "North Hill", 
    crop: "Corn", 
    yield: "8,400 kg/ha", 
    moisture: 62, 
    health: 94, 
    pos: { top: "35%", left: "25%" } 
  },
  { 
    id: "f2", 
    name: "East Brook", 
    crop: "Soybeans", 
    yield: "7,100 kg/ha", 
    moisture: 42, 
    health: 82, 
    pos: { top: "55%", left: "65%" } 
  },
  { 
    id: "f3", 
    name: "Valley Basin", 
    crop: "Wheat", 
    yield: "5,800 kg/ha", 
    moisture: 85, 
    health: 78, 
    pos: { top: "70%", left: "40%" } 
  },
];

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeLayer, setActiveLayer] = useState<'yield' | 'moisture' | 'health'>('yield');

  const mapImage = useMemo(() => 
    PlaceHolderImages.find(img => img.id === 'satellite-map')?.imageUrl || "https://picsum.photos/seed/map/1600/1200"
  , []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl border bg-muted group">
        
        {/* Map Background */}
        <div className="absolute inset-0">
          <Image 
            src={mapImage} 
            alt="Satellite Map" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
            data-ai-hint="satellite farm"
          />
          {/* Overlay Grid/Effects */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
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
          <Button size="icon" className="h-12 w-12 bg-primary text-primary-foreground shadow-xl rounded-2xl border-none animate-pulse">
            <Navigation className="h-5 w-5" />
          </Button>
        </div>

        {/* Field Pins */}
        {MOCK_FIELDS.map((field) => (
          <div 
            key={field.id}
            className="absolute transition-all duration-300"
            style={{ top: field.pos.top, left: field.pos.left }}
          >
            <button 
              onClick={() => setSelectedField(field)}
              className="group/pin relative flex items-center justify-center"
            >
              <div className={cn(
                "absolute -top-14 bg-white px-4 py-2 rounded-2xl shadow-2xl min-w-[140px] whitespace-nowrap transition-all transform",
                selectedField?.id === field.id ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-2 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:translate-y-0"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <Sprout className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm">{field.name}</span>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {activeLayer === 'yield' && `Yield: ${field.yield}`}
                  {activeLayer === 'moisture' && `Moisture: ${field.moisture}%`}
                  {activeLayer === 'health' && `Health: ${field.health}%`}
                </div>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-sm"></div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
                <div className={cn(
                  "w-10 h-10 bg-primary border-[6px] border-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 z-20",
                  selectedField?.id === field.id && "scale-125 ring-4 ring-primary/20"
                )}></div>
              </div>
            </button>
          </div>
        ))}

        {/* Legend */}
        <Card className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md shadow-2xl border-none rounded-2xl p-4 hidden md:block">
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

        {/* Bottom Mobile Scroll (Hidden on Desktop) */}
        <div className="md:hidden absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto no-scrollbar py-2">
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

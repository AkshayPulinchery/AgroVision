
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Layers, 
  Navigation, 
  Sprout, 
  Activity, 
  Droplets, 
  X, 
  ChevronRight, 
  Info, 
  Loader2, 
  RefreshCw, 
  Thermometer, 
  FlaskConical 
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { MOCK_FIELDS } from "@/lib/mock-data";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <div className="text-center">
        <Sprout className="h-12 w-12 text-primary/40 mx-auto animate-bounce" />
        <p className="text-xs font-bold text-muted-foreground mt-4 tracking-widest uppercase">Initializing Sat-Link...</p>
      </div>
    </div>
  ),
});

type Field = {
  id: string;
  name: string;
  crop: string;
  moisture: number;
  soilPH: number;
  temp: number;
  health: number;
  lat: number;
  lng: number;
};

export default function MapPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeLayer, setActiveLayer] = useState<'yield' | 'moisture' | 'health'>('yield');
  const [syncing, setSyncing] = useState(false);
  
  const firestore = useFirestore();
  const fieldsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "fields"), limit(50));
  }, [firestore]);
  
  const { data: dbFields, loading: dbLoading } = useCollection(fieldsQuery);

  // Combine DB fields with MOCK fields for a dense prototype
  const fields = useMemo(() => {
    const combined = [...MOCK_FIELDS];
    if (dbFields) {
      dbFields.forEach((dbF: any) => {
        const idx = combined.findIndex(f => f.id === dbF.id);
        if (idx === -1) combined.push(dbF as Field);
        else combined[idx] = dbF as Field;
      });
    }
    return combined as Field[];
  }, [dbFields]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSyncSensors = async () => {
    setSyncing(true);
    // Simulate sync
    await new Promise(r => setTimeout(r, 1500));
    toast({
      title: "Sensors Synced",
      description: "250+ field nodes refreshed with latest telemetry.",
    });
    setSyncing(false);
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl border bg-muted group">
        
        <div className="absolute inset-0 z-0">
          <LeafletMap 
            fields={fields} 
            onSelectField={setSelectedField} 
            selectedField={selectedField}
          />
        </div>

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

        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <Button 
            size="icon" 
            className={cn("h-12 w-12 bg-accent text-accent-foreground shadow-xl rounded-2xl border-none", syncing && "animate-pulse")}
            onClick={handleSyncSensors}
            disabled={syncing}
          >
            {syncing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
          </Button>
          <Button size="icon" className="h-12 w-12 bg-white text-foreground hover:bg-white/90 shadow-xl rounded-2xl border-none">
            <Layers className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            className="h-12 w-12 bg-primary text-primary-foreground shadow-xl rounded-2xl border-none"
            onClick={() => fields.length > 0 && setSelectedField(fields[0])}
          >
            <Navigation className="h-5 w-5" />
          </Button>
        </div>

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

              <div className="space-y-6 flex-1 overflow-y-auto">
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
                  <div className="p-4 bg-muted/40 rounded-2xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Soil PH</div>
                    <div className="text-xl font-black flex items-center gap-1.5">
                      <FlaskConical className="h-4 w-4 text-purple-500" />
                      {selectedField.soilPH || '6.5'}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-2xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Temp</div>
                    <div className="text-xl font-black flex items-center gap-1.5">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      {selectedField.temp || '24'}°C
                    </div>
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
                      Based on live sensor telemetry, this sector is in optimal range. Moisture levels are stable.
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
      </div>
    </AppLayout>
  );
}

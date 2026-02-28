"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Layers, 
  Navigation, 
  Filter, 
  Maximize2,
  Calendar,
  ThermometerSun,
  Sprout
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function MapPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-xl border">
        {/* Mock Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')` }}
        >
          {/* Mock Heatmap Overlay */}
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px]"></div>
          
          {/* Floating Map UI Components */}
          <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search farm or region..." 
                className="pl-10 h-12 bg-white/90 backdrop-blur shadow-lg border-none"
              />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
             <Button size="icon" className="bg-white text-foreground hover:bg-white/90 shadow-lg">
                <Layers className="h-5 w-5" />
             </Button>
             <Button size="icon" className="bg-white text-foreground hover:bg-white/90 shadow-lg">
                <Maximize2 className="h-5 w-5" />
             </Button>
             <Button size="icon" className="bg-primary text-primary-foreground shadow-lg">
                <Navigation className="h-5 w-5" />
             </Button>
          </div>

          {/* Farm Pins */}
          <div className="absolute top-1/2 left-1/3 group cursor-pointer">
             <div className="relative">
                <div className="absolute -top-16 -left-1/2 bg-white p-3 rounded-xl shadow-2xl min-w-[150px] opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Sprout className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm">North Hill Farm</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">Yield: <span className="text-emerald-600 font-bold">8,400 kg/ha</span></div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="w-[85%] h-full bg-emerald-500"></div>
                    </div>
                </div>
                <div className="w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg animate-pulse"></div>
             </div>
          </div>

          <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
             <div className="relative">
                <div className="absolute -top-16 -left-1/2 bg-white p-3 rounded-xl shadow-2xl min-w-[150px] opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Sprout className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm">East Brook</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">Yield: <span className="text-emerald-600 font-bold">7,100 kg/ha</span></div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="w-[70%] h-full bg-emerald-500"></div>
                    </div>
                </div>
                <div className="w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg"></div>
             </div>
          </div>

          {/* Heatmap Legend */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border">
            <div className="text-xs font-bold uppercase mb-2 text-muted-foreground tracking-widest">Yield Heatmap</div>
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>Low ( &lt; 2k kg/ha )</span>
               </div>
               <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                  <span>Medium ( 2k - 5k kg/ha )</span>
               </div>
               <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  <span>High ( &gt; 5k kg/ha )</span>
               </div>
            </div>
          </div>

          {/* Filter Bar (Mobile Scrollable) */}
          <div className="absolute bottom-8 left-8 right-32 flex gap-2 overflow-x-auto no-scrollbar">
             <Button variant="secondary" className="bg-white/90 backdrop-blur shadow-lg border-none whitespace-nowrap h-10 gap-2">
                <Calendar className="h-4 w-4" />
                Season: 2024
             </Button>
             <Button variant="secondary" className="bg-white/90 backdrop-blur shadow-lg border-none whitespace-nowrap h-10 gap-2">
                <Sprout className="h-4 w-4" />
                Crop: All
             </Button>
             <Button variant="secondary" className="bg-white/90 backdrop-blur shadow-lg border-none whitespace-nowrap h-10 gap-2">
                <ThermometerSun className="h-4 w-4" />
                Soil: PH 6-7
             </Button>
             <Button variant="secondary" className="bg-white/90 backdrop-blur shadow-lg border-none whitespace-nowrap h-10 gap-2">
                <Filter className="h-4 w-4" />
                More Filters
             </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


"use client";

import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Waves, 
  CloudRain, 
  Settings2,
  RefreshCw,
  Plus,
  Loader2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { MOCK_FIELDS, MOCK_IRRIGATION_LOGS } from "@/lib/mock-data";

const waterData = [
  { day: 'Mon', usage: 120 },
  { day: 'Tue', usage: 140 },
  { day: 'Wed', usage: 90 },
  { day: 'Thu', usage: 110 },
  { day: 'Fri', usage: 160 },
  { day: 'Sat', usage: 130 },
  { day: 'Sun', usage: 150 },
];

export default function WaterIntelligence() {
  const firestore = useFirestore();
  
  const logsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "irrigation_logs"), orderBy("timestamp", "desc"), limit(10));
  }, [firestore]);
  
  const { data: dbLogs } = useCollection(logsQuery);

  const fieldsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "fields");
  }, [firestore]);
  
  const { data: dbFields } = useCollection(fieldsQuery);

  const logs = useMemo(() => {
    if (dbLogs && dbLogs.length > 0) return dbLogs;
    return MOCK_IRRIGATION_LOGS.slice(0, 10);
  }, [dbLogs]);

  const moistureData = useMemo(() => {
    const allFields = dbFields && dbFields.length > 0 ? dbFields : MOCK_FIELDS.slice(0, 15);
    return allFields.map((f: any) => ({
      field: f.name,
      level: f.moisture,
      status: f.moisture > 60 ? "Optimal" : f.moisture > 40 ? "Moderate" : "Low",
      color: f.moisture > 60 ? "bg-emerald-500" : f.moisture > 40 ? "bg-amber-500" : "bg-red-500"
    }));
  }, [dbFields]);

  const avgMoisture = useMemo(() => {
    if (!moistureData.length) return 0;
    return Math.round(moistureData.reduce((acc, f) => acc + f.level, 0) / moistureData.length);
  }, [moistureData]);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Water Intelligence</h1>
            <p className="text-muted-foreground">Smart irrigation monitoring and moisture analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Settings2 className="h-4 w-4" />System Config</Button>
            <Button className="farmer-button gap-2"><Plus className="h-4 w-4" />Add Sensor</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-lg bg-gradient-to-br from-primary to-emerald-800 text-primary-foreground">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl"><Waves className="h-6 w-6" /></div>
                    <div>
                      <h2 className="text-2xl font-bold">Smart Irrigation System</h2>
                      <p className="text-primary-foreground/80">Automated based on real-time soil moisture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch id="auto-mode" defaultChecked />
                      <Label htmlFor="auto-mode" className="font-bold cursor-pointer">AI Auto-Pilot</Label>
                    </div>
                    <Button variant="secondary" className="font-bold">Manual Override</Button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="text-center">
                      <div className="text-3xl font-black">{avgMoisture}%</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Avg Moisture</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-lg">Weather Outlook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <CloudRain className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-bold">Rain Forecasted</div>
                    <div className="text-xs text-muted-foreground">85% probability within 48h</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our AI suggests pausing scheduled irrigation for North Hill as natural rainfall will meet saturation needs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Water Consumption</CardTitle>
                <CardDescription>Daily usage in Liters (Last 7 Days)</CardDescription>
              </div>
              <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={3} fill="hsl(var(--primary))" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Field Moisture</CardTitle>
              <CardDescription>Live sensor telemetry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {moistureData.map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <h4 className="font-bold text-sm">{field.field}</h4>
                    <span className="font-black text-lg">{field.level}%</span>
                  </div>
                  <Progress value={field.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Irrigation History</CardTitle>
            <CardDescription>Real-time log from automated valves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left pb-4 font-medium">Field Sector</th>
                    <th className="text-left pb-4 font-medium">Valve Type</th>
                    <th className="text-left pb-4 font-medium">Duration</th>
                    <th className="text-left pb-4 font-medium">Water Volume</th>
                    <th className="text-right pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((row: any, idx: number) => (
                    <tr key={row.id || idx} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-bold">{row.fieldName}</td>
                      <td className="py-4 text-muted-foreground">{row.type}</td>
                      <td className="py-4 text-muted-foreground">{row.duration}</td>
                      <td className="py-4 font-medium">{row.volume}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

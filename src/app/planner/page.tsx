
"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ClipboardCheck, 
  Calendar, 
  Plus, 
  Sprout, 
  ArrowRight, 
  Sparkles,
  Trash2,
  AlertCircle,
  LayoutGrid,
  Clock,
  Loader2
} from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PlannerPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [saving, setSaving] = useState(false);
  
  const plansQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "plans"), orderBy("startDate", "desc"));
  }, [firestore]);
  
  const { data: plansData, loading: plansLoading } = useCollection(plansQuery);

  const plans = useMemo(() => {
    if (!plansData) return [];
    return plansData.map(d => ({
      id: d.id,
      ...d,
      start: d.startDate ? new Date(d.startDate) : new Date(),
      end: d.endDate ? new Date(d.endDate) : new Date(),
    }));
  }, [plansData]);

  const [formData, setFormData] = useState({
    crop: "Corn",
    fieldName: "North Hill",
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleAddPlan = () => {
    if (!firestore || !startDate || !endDate) {
      toast({
        title: "Missing Info",
        description: "Please select start and end dates.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const planRef = collection(firestore, "plans");
    const data = {
      ...formData,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "Draft",
      expectedYield: "8,500 kg/ha"
    };

    addDoc(planRef, data)
      .then(() => {
        toast({ title: "Plan Added", description: "Successfully added to your timeline." });
        setSaving(false);
      })
      .catch(async () => {
        setSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'plans',
          operation: 'create',
          requestResourceData: data,
        }));
      });
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "plans", id))
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: `plans/${id}`,
          operation: 'delete',
        }));
      });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
              <ClipboardCheck className="h-8 w-8" />
              Season Planner
            </h1>
            <p className="text-muted-foreground">Strategic crop rotation and planting schedules powered by AI.</p>
          </div>
          <Button className="farmer-button gap-2">
            <Plus className="h-4 w-4" />
            New Season Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Draft New Season</CardTitle>
                <CardDescription>Configure your next planting cycle for optimal yield.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Target Crop</Label>
                    <Select value={formData.crop} onValueChange={(v) => setFormData({...formData, crop: v})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corn">Corn (Maize)</SelectItem>
                        <SelectItem value="Soybeans">Soybeans</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field Sector</Label>
                    <Select value={formData.fieldName} onValueChange={(v) => setFormData({...formData, fieldName: v})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North Hill">North Hill</SelectItem>
                        <SelectItem value="East Brook">East Brook</SelectItem>
                        <SelectItem value="Valley Basin">Valley Basin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Estimated Planting Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarPicker mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Harvest Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarPicker mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button className="w-full h-12 font-bold group" onClick={handleAddPlan} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add to Timeline
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Planned Rotations</h3>
              <div className="space-y-4">
                {plansLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : plans.map((plan) => (
                  <Card key={plan.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-2 bg-primary group-hover:w-3 transition-all"></div>
                      <CardContent className="p-5 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted p-3 rounded-lg"><Sprout className="h-6 w-6 text-primary" /></div>
                          <div>
                            <h4 className="font-bold text-lg">{plan.crop}</h4>
                            <p className="text-sm text-muted-foreground">{plan.fieldName} • {format(plan.start, "MMM d")} - {format(plan.end, "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-600">{plan.expectedYield}</div>
                            <div className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted mt-1">{plan.status}</div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-accent/5 overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-accent-foreground" />
                  Rotation Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Historical data suggests rotation is key to soil health in your current region.
                </p>
                <Button variant="outline" className="w-full text-xs h-9">View Soil Analysis</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

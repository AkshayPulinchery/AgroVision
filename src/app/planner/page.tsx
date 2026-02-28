"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Clock
} from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const [plans, setPlans] = useState([
    { id: 1, crop: "Corn", field: "North Field", start: new Date(2024, 3, 10), end: new Date(2024, 7, 20), status: "Upcoming", yield: "8,500 kg/ha" },
    { id: 2, crop: "Winter Wheat", field: "East Sector", start: new Date(2024, 9, 1), end: new Date(2025, 2, 15), status: "Draft", yield: "4,200 kg/ha" },
  ]);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleDelete = (id: number) => {
    setPlans(plans.filter(p => p.id !== id));
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
          {/* Main Planning Form */}
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
                    <Select defaultValue="Corn">
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corn">Corn (Maize)</SelectItem>
                        <SelectItem value="Soybeans">Soybeans</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field Sector</Label>
                    <Select defaultValue="North Hill">
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North Hill">North Hill</SelectItem>
                        <SelectItem value="East Brook">East Brook</SelectItem>
                        <SelectItem value="Valley Basin">Valley Basin</SelectItem>
                        <SelectItem value="South Orchard">South Orchard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Estimated Planting Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarPicker
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Harvest Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarPicker
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-primary">AI Recommendation</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Switching to **Soybeans** after this Corn cycle will replenish soil nitrogen by ~15%, 
                      reducing fertilizer costs by an estimated $120/hectare next season.
                    </p>
                  </div>
                </div>

                <Button className="w-full h-12 font-bold group">
                  Add to Timeline
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Planned Rotations</h3>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <LayoutGrid className="h-3 w-3 mr-1" /> Grid View
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary font-bold">
                        <Clock className="h-3 w-3 mr-1" /> Timeline View
                     </Button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="w-2 bg-primary group-hover:w-3 transition-all"></div>
                        <CardContent className="p-5 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <Sprout className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{plan.crop}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <span className="font-medium text-foreground">{plan.field}</span>
                                <span className="mx-1">•</span>
                                {format(plan.start, "MMM d, yyyy")} - {format(plan.end, "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 justify-between md:justify-end">
                            <div className="text-right">
                              <div className="text-sm font-bold text-emerald-600">{plan.yield}</div>
                              <div className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1",
                                plan.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'
                              )}>
                                {plan.status}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(plan.id)}
                            >
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

          {/* Side Info / Alerts */}
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
                  Historical data suggests that monocropping Corn for 3+ years in this region leads to a **22% yield decrease** due to pest buildup.
                </p>
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Recommended Sequence</div>
                  <div className="flex items-center gap-2 text-sm font-bold bg-white p-3 rounded-lg border border-accent/20">
                    <span className="text-primary">Corn</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>Soybeans</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>Wheat</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs h-9 border-accent/20 text-accent-foreground">
                  View Soil Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Planning Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Soil pH testing", status: "Complete" },
                  { label: "Fertilizer inventory", status: "Pending" },
                  { label: "Equipment check", status: "In Progress" },
                  { label: "Seed procurement", status: "Complete" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                      item.status === "Complete" ? "bg-primary border-primary text-white" : "border-muted-foreground/30 bg-muted/20"
                    )}>
                      {item.status === "Complete" && <Sparkles className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className={cn("font-medium", item.status === "Complete" && "text-muted-foreground line-through")}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{item.status}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-6 bg-primary rounded-2xl text-primary-foreground relative overflow-hidden shadow-lg">
                <Sprout className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20" />
                <h4 className="font-bold text-lg mb-2">Need Expert Help?</h4>
                <p className="text-xs opacity-90 mb-4 leading-relaxed">
                   Connect with our certified agricultural advisors for a personalized field review.
                </p>
                <Button variant="secondary" className="w-full font-bold h-10">
                   Contact Advisor
                </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

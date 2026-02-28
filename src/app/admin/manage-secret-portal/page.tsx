"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Upload, 
  RefreshCw, 
  Settings2, 
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  BarChart3,
  CheckCircle2,
  Trash2,
  Cpu
} from "lucide-react";
import { generateSyntheticCropData } from "@/ai/flows/generate-synthetic-crop-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminPortal() {
  const { toast } = useToast();
  const [retraining, setRetraining] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [datasets, setDatasets] = useState([
    { id: "DS-001", name: "Regional Harvest 2023", records: 1200, status: "Active", date: "2023-12-10" },
    { id: "DS-002", name: "Soil Health Aggregates", records: 450, status: "Active", date: "2024-01-05" },
    { id: "DS-003", name: "Synthetic Climate Set A", records: 400, status: "Archive", date: "2024-02-15" },
  ]);

  const handleRetrain = async () => {
    setRetraining(true);
    await new Promise(r => setTimeout(r, 3000));
    setRetraining(false);
    toast({
      title: "Model Retrained Successfully",
      description: "Yield Predictor RF-Model v2.4 is now active.",
    });
  };

  const handleGenerateSynthetic = async () => {
    setGenerating(true);
    try {
      const mockCsv = "soil_ph,rainfall,temp,fertilizer,crop,yield\n6.5,1000,24,150,Corn,8500";
      const result = await generateSyntheticCropData({
        existingCropData: mockCsv,
        numRecords: 400
      });
      
      const newDs = {
        id: `DS-${Math.floor(Math.random() * 1000)}`,
        name: "AI Generated Seasonal Data",
        records: 400,
        status: "Draft",
        date: new Date().toISOString().split('T')[0]
      };
      
      setDatasets([newDs, ...datasets]);
      toast({
        title: "Synthetic Data Generated",
        description: "Added 400 records to a new dataset draft.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <ShieldCheck className="h-5 w-5 text-primary" />
               <span className="text-xs font-bold uppercase tracking-widest text-primary">System Administrator</span>
            </div>
            <h1 className="text-3xl font-headline font-bold">Admin Management Console</h1>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export Analytics
             </Button>
             <Button className="gap-2 farmer-button h-10 px-4">
                <Plus className="h-4 w-4" />
                Upload Dataset
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <Database className="h-4 w-4 text-primary" />
                 Total Data Points
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold">2.45M</div>
               <p className="text-xs text-muted-foreground mt-1">+15% this month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <Cpu className="h-4 w-4 text-primary" />
                 Model Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold">94.2%</div>
               <p className="text-xs text-muted-foreground mt-1">Random Forest v2.3</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <BarChart3 className="h-4 w-4 text-primary" />
                 Active Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold">12,482</div>
               <p className="text-xs text-muted-foreground mt-1">Across 4 regions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-md">
                 <CardHeader>
                    <CardTitle>Dataset Inventory</CardTitle>
                    <CardDescription>Manage your training sources and synthetic data generation.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead>Dataset Name</TableHead>
                             <TableHead>Records</TableHead>
                             <TableHead>Status</TableHead>
                             <TableHead>Date</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {datasets.map((ds) => (
                             <TableRow key={ds.id}>
                                <TableCell className="font-medium">{ds.name}</TableCell>
                                <TableCell>{ds.records.toLocaleString()}</TableCell>
                                <TableCell>
                                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                      ds.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                                   }`}>
                                      {ds.status}
                                   </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{ds.date}</TableCell>
                                <TableCell className="text-right">
                                   <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                   </Button>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </div>

           <div className="space-y-6">
              <Card className="border-none shadow-md overflow-hidden">
                 <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="flex items-center gap-2">
                       <RefreshCw className={`h-5 w-5 ${retraining ? 'animate-spin' : ''}`} />
                       Model Training
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                       Retrain the Random Forest regressor with latest datasets to improve yield prediction accuracy.
                    </p>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                          <span>Progress</span>
                          <span>{retraining ? '45%' : 'Last run 2 days ago'}</span>
                       </div>
                       <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-primary transition-all ${retraining ? 'w-[45%]' : 'w-full'}`}></div>
                       </div>
                    </div>
                    <Button 
                       className="w-full h-12 font-bold" 
                       onClick={handleRetrain}
                       disabled={retraining}
                    >
                       {retraining ? 'Training...' : 'Trigger Retraining'}
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Upload className="h-5 w-5 text-primary" />
                       Synthetic Engine
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                       Generate realistic seasonal data using AI to balance minority crop representations in your models.
                    </p>
                    <Button 
                       variant="outline" 
                       className="w-full h-12 font-bold border-primary text-primary hover:bg-primary/5"
                       onClick={handleGenerateSynthetic}
                       disabled={generating}
                    >
                       {generating ? 'Generating 400 Records...' : 'Generate 400 Seasons'}
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                       <Settings2 className="h-4 w-4" />
                       Configuration
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer">
                       <span className="text-sm font-medium">Rec Logic Threshold</span>
                       <span className="text-xs text-primary font-bold">0.85</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer">
                       <span className="text-sm font-medium">Feature importance viz</span>
                       <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Enabled</span>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

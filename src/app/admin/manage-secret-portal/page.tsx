"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Cpu,
  Zap,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, writeBatch, doc } from "firebase/firestore";

export default function AdminPortal() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [retraining, setRetraining] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
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

  const handleSuperSeed = async () => {
    if (!firestore || !user) {
      toast({ title: "Auth Required", description: "Sign in to seed data.", variant: "destructive" });
      return;
    }

    setSeeding(true);
    try {
      const crops = ["Corn", "Soybeans", "Wheat", "Rice", "Cotton"];
      const fieldNames = ["North Hill", "East Brook", "Valley Basin", "South Plateau", "River Delta"];
      
      // Seed 500 Predictions in batches (Firestore batch limit is 500)
      const batch = writeBatch(firestore);
      const predictionsRef = collection(firestore, "predictions");
      
      for (let i = 0; i < 500; i++) {
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const docRef = doc(predictionsRef);
        batch.set(docRef, {
          userId: user.uid,
          crop,
          soilPH: Number((Math.random() * (7.5 - 5.5) + 5.5).toFixed(1)),
          rainfall: Math.floor(Math.random() * 800) + 600,
          temp: Math.floor(Math.random() * 15) + 15,
          fertilizer: Math.floor(Math.random() * 100) + 100,
          predictedYield: Math.floor(Math.random() * 5000) + 3000,
          confidence: 0.85 + Math.random() * 0.1,
          createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365) // Random date in last year
        });
      }

      // Seed 20 Fields
      const fieldsRef = collection(firestore, "fields");
      for (let i = 0; i < 20; i++) {
        const fieldDocRef = doc(fieldsRef);
        batch.set(fieldDocRef, {
          name: `${fieldNames[i % fieldNames.length]} Sector ${Math.floor(i / 5) + 1}`,
          crop: crops[Math.floor(Math.random() * crops.length)],
          lat: 34.0522 + (Math.random() - 0.5) * 0.1,
          lng: -118.2437 + (Math.random() - 0.5) * 0.1,
          moisture: Math.floor(Math.random() * 40) + 40,
          soilPH: Number((Math.random() * (7.2 - 5.8) + 5.8).toFixed(1)),
          temp: Math.floor(Math.random() * 10) + 20,
          health: Math.floor(Math.random() * 20) + 75,
          lastUpdated: serverTimestamp()
        });
      }

      await batch.commit();
      
      toast({
        title: "Database Seeded!",
        description: "Added 500 predictions and 20 field sensors for the event.",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Seeding Failed", description: "Check console for details.", variant: "destructive" });
    } finally {
      setSeeding(false);
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
             <Button 
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-4 font-bold"
                onClick={handleSuperSeed}
                disabled={seeding}
             >
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Super Seed 500+ Records
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
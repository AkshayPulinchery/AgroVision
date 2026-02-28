"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  RefreshCw, 
  Settings2, 
  ShieldCheck,
  Zap,
  Loader2,
  Trash2,
  BarChart3,
  Cpu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, writeBatch, doc, serverTimestamp, query, getDocs } from "firebase/firestore";

export default function AdminPortal() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [retraining, setRetraining] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  
  const [datasets] = useState([
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
      description: "AgroVision Model v3.1 is now active.",
    });
  };

  const handleClearDatabase = async () => {
    if (!firestore) return;
    setCleaning(true);
    try {
      const collections = ["predictions", "fields", "irrigation_logs", "plans"];
      for (const colName of collections) {
        const q = query(collection(firestore, colName));
        const snapshot = await getDocs(q);
        const batchSize = 500;
        for (let i = 0; i < snapshot.docs.length; i += batchSize) {
          const batch = writeBatch(firestore);
          snapshot.docs.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      toast({ title: "Database Cleared", description: "All prototype data has been removed." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to clear database.", variant: "destructive" });
    } finally {
      setCleaning(false);
    }
  };

  const handleSuperSeed = async () => {
    if (!firestore) {
      toast({ title: "Connection Error", description: "Database is not connected yet.", variant: "destructive" });
      return;
    }

    setSeeding(true);
    try {
      const crops = ["Corn", "Soybeans", "Wheat", "Rice", "Cotton"];
      const fieldPrefixes = ["North", "East", "South", "West", "Central", "Valley", "Ridge", "Brook", "Delta", "Plateau"];
      const irrigationTypes = ["Drip", "Sprinkler", "Pivot", "Surface"];
      
      // Batch 1: 500 Predictions (Max Batch Size)
      const batch1 = writeBatch(firestore);
      const predictionsRef = collection(firestore, "predictions");
      
      for (let i = 0; i < 500; i++) {
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const docRef = doc(predictionsRef);
        batch1.set(docRef, {
          userId: user?.uid || "demo-farmer-id",
          crop,
          soilPH: Number((Math.random() * (7.5 - 5.5) + 5.5).toFixed(1)),
          rainfall: Math.floor(Math.random() * 800) + 600,
          temp: Math.floor(Math.random() * 15) + 15,
          fertilizer: Math.floor(Math.random() * 100) + 100,
          predictedYield: Math.floor(Math.random() * 5000) + 3000,
          confidence: 0.85 + Math.random() * 0.1,
          createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365)
        });
      }
      await batch1.commit();

      // Batch 2: 250 Fields (The locations you requested)
      const batch2 = writeBatch(firestore);
      const fieldsRef = collection(firestore, "fields");
      
      // Base coordinates around Los Angeles area for demo purposes
      const baseLat = 34.0522;
      const baseLng = -118.2437;

      for (let i = 0; i < 250; i++) {
        const fieldDocRef = doc(fieldsRef);
        const prefix = fieldPrefixes[Math.floor(Math.random() * fieldPrefixes.length)];
        batch2.set(fieldDocRef, {
          name: `${prefix} Sector ${i + 1}`,
          crop: crops[Math.floor(Math.random() * crops.length)],
          lat: baseLat + (Math.random() - 0.5) * 0.08, // Increased spread
          lng: baseLng + (Math.random() - 0.5) * 0.08,
          moisture: Math.floor(Math.random() * 40) + 40,
          soilPH: Number((Math.random() * (7.2 - 5.8) + 5.8).toFixed(1)),
          temp: Math.floor(Math.random() * 10) + 20,
          health: Math.floor(Math.random() * 20) + 75,
          lastUpdated: serverTimestamp()
        });
      }
      await batch2.commit();

      // Batch 3: 100 Irrigation Logs
      const batch3 = writeBatch(firestore);
      const logsRef = collection(firestore, "irrigation_logs");
      for (let i = 0; i < 100; i++) {
        const logDocRef = doc(logsRef);
        batch3.set(logDocRef, {
          fieldName: `${fieldPrefixes[Math.floor(Math.random() * fieldPrefixes.length)]} Sector ${Math.floor(Math.random() * 250)}`,
          type: irrigationTypes[Math.floor(Math.random() * irrigationTypes.length)],
          duration: `${Math.floor(Math.random() * 45) + 15} mins`,
          volume: `${Math.floor(Math.random() * 2000) + 500}L`,
          timestamp: serverTimestamp(),
          status: Math.random() > 0.1 ? "Completed" : "In Progress"
        });
      }
      await batch3.commit();
      
      toast({
        title: "Seed Complete!",
        description: "Successfully added 250 map locations and 500 predictions.",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Seeding Failed", description: "Database error occurred.", variant: "destructive" });
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
                variant="outline"
                className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
                onClick={handleClearDatabase}
                disabled={cleaning || seeding}
             >
                {cleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Wipe Database
             </Button>
             <Button 
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-6 font-bold shadow-lg"
                onClick={handleSuperSeed}
                disabled={seeding || cleaning}
             >
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Super Seed (850+ Records)
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <Database className="h-4 w-4 text-primary" />
                 Map Density
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold">250 Nodes</div>
               <p className="text-xs text-muted-foreground mt-1">Active sensor telemetry</p>
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
               <div className="text-3xl font-bold">96.8%</div>
               <p className="text-xs text-muted-foreground mt-1">Optimized for 5 crops</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <BarChart3 className="h-4 w-4 text-primary" />
                 Prototype Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold">Global Scale</div>
               <p className="text-xs text-muted-foreground mt-1">Multi-region ready</p>
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
                       AI Model Retraining
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                       Retrain the AgroVision predictor with the latest synthetic data to improve regional accuracy.
                    </p>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                          <span>Progress</span>
                          <span>{retraining ? '65%' : 'Ready'}</span>
                       </div>
                       <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-primary transition-all ${retraining ? 'w-[65%]' : 'w-0'}`}></div>
                       </div>
                    </div>
                    <Button 
                       className="w-full h-12 font-bold" 
                       onClick={handleRetrain}
                       disabled={retraining}
                    >
                       {retraining ? 'Retraining...' : 'Trigger Model Run'}
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
                       <span className="text-sm font-medium">Map Cluster Threshold</span>
                       <span className="text-xs text-primary font-bold">50</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer">
                       <span className="text-sm font-medium">Real-time Telemetry</span>
                       <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

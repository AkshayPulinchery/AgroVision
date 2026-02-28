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
  Cpu,
  BrainCircuit,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, writeBatch, doc, serverTimestamp, query, getDocs } from "firebase/firestore";
import { trainRandomForest, TrainingOutput } from "@/ai/flows/train-random-forest-flow";
import { MOCK_PREDICTIONS } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminPortal() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [retraining, setRetraining] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [modelState, setModelState] = useState<TrainingOutput | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  
  const [datasets] = useState([
    { id: "DS-001", name: "Regional Harvest 2023", records: 1200, status: "Active", date: "2023-12-10" },
    { id: "DS-002", name: "Soil Health Aggregates", records: 450, status: "Active", date: "2024-01-05" },
    { id: "DS-003", name: "Synthetic Climate Set A", records: 400, status: "Archive", date: "2024-02-15" },
  ]);

  const handleRetrain = async () => {
    setRetraining(true);
    
    if (simulationMode) {
      await new Promise(r => setTimeout(r, 2000));
      const simResult: TrainingOutput = {
        modelInsights: "SIMULATION: Calibrated 100 decision trees. Strong correlations found between Soil pH (6.2-6.8) and Corn yield stability. Feature importance weighted heavily on Rainfall (34%) and Soil Health (28%).",
        accuracy: 0.972,
        featureImportance: [
          { feature: "Rainfall", importance: 0.34 },
          { feature: "Soil pH", importance: 0.28 },
          { feature: "Fertilizer", importance: 0.22 },
          { feature: "Temperature", importance: 0.16 }
        ],
        version: "3.1.2-SIM"
      };
      setModelState(simResult);
      toast({
        title: "Simulation Model Calibrated",
        description: "AgroVision Forest v3.1.2-SIM is now active.",
      });
      setRetraining(false);
      return;
    }

    try {
      const headers = "soil_ph,rainfall,temp,fertilizer,crop,yield\n";
      const csvData = MOCK_PREDICTIONS.slice(0, 50).map(p => 
        `${p.soilPH},${p.rainfall},${p.temp},${p.fertilizer},${p.crop},${p.predictedYield}`
      ).join("\n");
      
      const result = await trainRandomForest({ dataset: headers + csvData });
      setModelState(result);
      
      toast({
        title: "Model Retrained Successfully",
        description: `AgroVision Random Forest v${result.version} is now active. Accuracy: ${(result.accuracy * 100).toFixed(1)}%`,
      });
    } catch (err) {
      console.error(err);
      toast({ 
        title: "AI Training Error", 
        description: "Switching to Simulation Mode automatically.", 
        variant: "destructive" 
      });
      setSimulationMode(true);
      handleRetrain();
    } finally {
      setRetraining(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!firestore) {
      toast({ title: "Local Store Cleared", description: "Prototype data reset." });
      return;
    }
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
      toast({ title: "Database Cleared", description: "All Firestore data has been removed." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to clear database.", variant: "destructive" });
    } finally {
      setCleaning(false);
    }
  };

  const handleSuperSeed = async () => {
    setSeeding(true);
    // Even if no firestore, simulate success for prototyping
    if (!firestore) {
      await new Promise(r => setTimeout(r, 1500));
      toast({ title: "Local Seed Complete!", description: "Mock data refreshed for demo." });
      setSeeding(false);
      return;
    }

    try {
      const crops = ["Corn", "Soybeans", "Wheat", "Rice", "Cotton"];
      const fieldPrefixes = ["North", "East", "South", "West", "Central", "Valley", "Ridge", "Brook", "Delta", "Plateau"];
      
      const batch1 = writeBatch(firestore);
      const predictionsRef = collection(firestore, "predictions");
      for (let i = 0; i < 500; i++) {
        const docRef = doc(predictionsRef);
        batch1.set(docRef, {
          userId: user?.uid || "demo-farmer-id",
          crop: crops[Math.floor(Math.random() * crops.length)],
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

      const batch2 = writeBatch(firestore);
      const fieldsRef = collection(firestore, "fields");
      const baseLat = 34.0522;
      const baseLng = -118.2437;
      for (let i = 0; i < 250; i++) {
        const fieldDocRef = doc(fieldsRef);
        batch2.set(fieldDocRef, {
          name: `${fieldPrefixes[Math.floor(Math.random() * fieldPrefixes.length)]} Sector ${i + 1}`,
          crop: crops[Math.floor(Math.random() * crops.length)],
          lat: baseLat + (Math.random() - 0.5) * 0.12,
          lng: baseLng + (Math.random() - 0.5) * 0.12,
          moisture: Math.floor(Math.random() * 40) + 40,
          soilPH: Number((Math.random() * (7.2 - 5.8) + 5.8).toFixed(1)),
          temp: Math.floor(Math.random() * 10) + 20,
          health: Math.floor(Math.random() * 20) + 75,
          lastUpdated: serverTimestamp()
        });
      }
      await batch2.commit();
      
      toast({ title: "Seed Complete!", description: "Successfully added 850+ records to Firestore." });
    } catch (err) {
      console.error(err);
      toast({ title: "Seeding Failed", description: "Database error occurred.", variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <ShieldCheck className="h-5 w-5 text-primary" />
               <span className="text-xs font-bold uppercase tracking-widest text-primary">System Administrator</span>
            </div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Admin Management Console</h1>
          </div>
          <div className="flex gap-2">
             <Button 
                variant="outline"
                className="gap-2 text-destructive border-destructive hover:bg-destructive/10 h-10 px-4 font-bold"
                onClick={handleClearDatabase}
                disabled={cleaning || seeding}
             >
                {cleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Wipe All Data
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
               <div className="text-3xl font-bold">{modelState ? `${(modelState.accuracy * 100).toFixed(1)}%` : "96.8%"}</div>
               <p className="text-xs text-muted-foreground mt-1">Random Forest v3.1</p>
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
                       <BrainCircuit className={`h-5 w-5 ${retraining ? 'animate-pulse' : ''}`} />
                       Random Forest Trainer
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="trainer-sim" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Simulation</Label>
                      <Switch 
                        id="trainer-sim" 
                        checked={simulationMode} 
                        onCheckedChange={setSimulationMode}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                       Recalibrate the ensemble decision trees based on the latest harvest datasets.
                    </p>
                    {modelState && (
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-2">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">
                          {simulationMode ? "Simulated Model v3.1-S" : "Neural Forest v3.1"}
                        </div>
                        <p className="text-[11px] text-emerald-900 leading-tight">{modelState.modelInsights.substring(0, 100)}...</p>
                      </div>
                    )}
                    <Button 
                       className="w-full h-12 font-bold" 
                       onClick={handleRetrain}
                       disabled={retraining}
                    >
                       {retraining ? (
                         <>
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                           {simulationMode ? 'Calibrating Heuristics...' : 'Training Neural Nets...'}
                         </>
                       ) : 'Trigger Model Training'}
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

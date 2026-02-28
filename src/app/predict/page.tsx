
"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Sprout, 
  Loader2, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck,
  FlaskConical,
  CloudRain,
  Thermometer
} from "lucide-react";
import { predictYield, PredictionOutput } from "@/lib/ml-model";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PredictPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<PredictionOutput | null>(null);
  
  const [formData, setFormData] = useState({
    crop: "Corn",
    soilPH: 6.5,
    rainfall: 1000,
    temp: 24,
    fertilizer: 150
  });

  const handlePredict = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const prediction = predictYield(formData);
    setResult(prediction);
    setLoading(false);
  };

  const handleSave = () => {
    if (!result || !firestore || !user) {
      toast({
        title: "Error",
        description: "Must be signed in and have a prediction to save.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const predictionRef = collection(firestore, "predictions");
    const data = {
      userId: user.uid,
      ...formData,
      predictedYield: result.yield,
      confidence: result.confidence,
      createdAt: serverTimestamp()
    };

    addDoc(predictionRef, data)
      .then(() => {
        toast({
          title: "Success",
          description: "Prediction saved to your farm records.",
        });
        setSaving(false);
      })
      .catch(async (serverError) => {
        setSaving(false);
        const permissionError = new FirestorePermissionError({
          path: 'predictions',
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-headline font-bold text-primary">Yield Predictor</h1>
          <p className="text-muted-foreground">Input your field data to get AI-powered yield estimations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Environmental Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Crop</Label>
                <Select value={formData.crop} onValueChange={(val) => setFormData({...formData, crop: val})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select crop type" />
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

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    Soil pH
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{formData.soilPH}</span>
                  </Label>
                </div>
                <Slider 
                  value={[formData.soilPH]} 
                  min={4} 
                  max={9} 
                  step={0.1}
                  onValueChange={([val]) => setFormData({...formData, soilPH: val})}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Acidic (4.0)</span>
                  <span>Neutral (7.0)</span>
                  <span>Alkaline (9.0)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-500" />
                    Rainfall (mm)
                  </Label>
                  <Input 
                    type="number" 
                    value={formData.rainfall} 
                    onChange={(e) => setFormData({...formData, rainfall: Number(e.target.value)})}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    Temp (°C)
                  </Label>
                  <Input 
                    type="number" 
                    value={formData.temp} 
                    onChange={(e) => setFormData({...formData, temp: Number(e.target.value)})}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fertilizer Amount (kg/ha)</Label>
                <Input 
                  type="number" 
                  value={formData.fertilizer} 
                  onChange={(e) => setFormData({...formData, fertilizer: Number(e.target.value)})}
                  className="h-12"
                />
              </div>

              <Button 
                onClick={handlePredict} 
                disabled={loading}
                className="w-full h-14 text-lg font-bold group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <TrendingUp className="mr-2 h-5 w-5" />
                )}
                Calculate Yield
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Results Area */}
          <div className="space-y-6">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed rounded-2xl text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                  <Sprout className="h-12 w-12 text-muted" />
                </div>
                <h3 className="font-bold text-lg mb-2">Ready to Predict</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the environmental data to see your AI yield prediction results here.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/10 rounded-2xl">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="font-bold text-lg">Crunching Data...</h3>
                <p className="text-sm text-muted-foreground">Our model is analyzing your field data.</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <Card className="bg-primary text-primary-foreground border-none shadow-xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Predicted Yield</p>
                    <div className="text-5xl font-black mb-2">
                      {result.yield.toLocaleString()} <span className="text-xl font-normal">kg/ha</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm bg-black/10 w-fit mx-auto px-4 py-1.5 rounded-full">
                      <ShieldCheck className="h-4 w-4" />
                      Confidence Score: {Math.round(result.confidence * 100)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-none">
                  <CardHeader>
                    <CardTitle className="text-base">Feature Importance</CardTitle>
                    <CardDescription>What factors influenced this prediction most?</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.importance} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="feature" 
                          type="category" 
                          tick={{ fontSize: 12 }} 
                          width={100}
                        />
                        <Bar 
                          dataKey="weight" 
                          fill="hsl(var(--primary))" 
                          radius={[0, 4, 4, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setResult(null)}>
                    Reset
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Record
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
